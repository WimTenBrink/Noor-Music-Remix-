import { Job, Priority, JobStatus } from '../../types';
import { generateSong } from './aiService';
import { SYSTEM_INSTRUCTIONS } from '../../constants/instructions';

function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();

  // 1. Try a direct JSON.parse first (fast path)
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Direct parse failed, proceed with robust extraction
  }

  // 2. Try looking for JSON code blocks specifically via regex
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = cleaned.match(jsonBlockRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      // If the matched code block itself fails to parse (e.g. because of trailing comments inside),
      // we fall back to scanning using the block contents
      cleaned = match[1].trim();
    }
  }

  // Also remove generic triple backticks if present
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

  // 3. Robust substring scanning for a valid JSON structure (object or array)
  // We search for '{' (or '[') and try to find a matching '}' (or ']') that parses successfully.
  const firstObj = cleaned.indexOf('{');
  const firstArr = cleaned.indexOf('[');

  if (firstObj !== -1 && (firstArr === -1 || firstObj < firstArr)) {
    // Find all occurrences of '}' starting from the firstObj index
    const indices: number[] = [];
    let pos = cleaned.indexOf('}', firstObj);
    while (pos !== -1) {
      indices.push(pos);
      pos = cleaned.indexOf('}', pos + 1);
    }
    // Try scanning from the last index of '}' backwards, finding the largest valid JSON object
    for (let i = indices.length - 1; i >= 0; i--) {
      const endIdx = indices[i];
      const candidate = cleaned.substring(firstObj, endIdx + 1);
      try {
        return JSON.parse(candidate);
      } catch (err) {
        // continue scanning backwards
      }
    }
  } else if (firstArr !== -1) {
    // Find all occurrences of ']' starting from the firstArr index
    const indices: number[] = [];
    let pos = cleaned.indexOf(']', firstArr);
    while (pos !== -1) {
      indices.push(pos);
      pos = cleaned.indexOf(']', pos + 1);
    }
    // Try scanning from the last index of ']' backwards, finding the largest valid JSON array
    for (let i = indices.length - 1; i >= 0; i--) {
      const endIdx = indices[i];
      const candidate = cleaned.substring(firstArr, endIdx + 1);
      try {
        return JSON.parse(candidate);
      } catch (err) {
        // continue scanning backwards
      }
    }
  }

  // 4. Fallback: try parsing cleaned text or throw original parse error
  return JSON.parse(text);
}

class JobService {
  private queue: Job[] = [];
  private runningCount = 0;
  private maxConcurrent = 5;
  private isPaused = false;
  private listeners: ((jobs: Job[]) => void)[] = [];

  constructor() {
    setInterval(() => this.processQueue(), 1000);
  }

  subscribe(listener: (jobs: Job[]) => void) {
    this.listeners.push(listener);
    listener([...this.queue]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.queue]));
  }

  addJob(name: string, priority: Priority, prompt: string, apiKey: string, generationSettings?: any, systemInstruction?: string) {
    const job: Job = {
      id: Math.random().toString(36).substring(7),
      name,
      priority,
      status: 'pending',
      createdAt: Date.now(),
      apiKey,
      prompt,
      systemInstruction: systemInstruction || SYSTEM_INSTRUCTIONS,
      generationSettings,
    };
    this.queue.push(job);
    this.notify();
    return job.id;
  }

  pause() {
    this.isPaused = true;
    this.notify();
  }

  resume() {
    this.isPaused = false;
    this.notify();
  }

  getIsPaused() {
    return this.isPaused;
  }

  deleteJob(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status !== 'running') {
      this.queue = this.queue.filter(j => j.id !== id);
      this.notify();
    }
  }

  deleteAll(status?: JobStatus) {
    this.queue = this.queue.filter(j => {
      if (j.status === 'running') return true;
      if (status && j.status !== status) return true;
      return false;
    });
    this.notify();
  }

  clearQueue() {
    this.queue = [];
    this.runningCount = 0;
    this.isPaused = false;
    this.notify();
  }

  retryJob(id: string, apiKey: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status === 'failed') {
      job.status = 'pending';
      job.error = undefined;
      job.retryCount = 0;
      if (apiKey) job.apiKey = apiKey;
      this.notify();
    }
  }

  retryAll(apiKey: string) {
    this.queue.forEach(j => {
      if (j.status === 'failed') {
        j.status = 'pending';
        j.error = undefined;
        j.retryCount = 0;
        if (apiKey) j.apiKey = apiKey;
      }
    });
    this.notify();
  }

  speedUp(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status === 'pending') {
      if (job.priority === 'low') job.priority = 'normal';
      else if (job.priority === 'normal') job.priority = 'high';
      this.notify();
    }
  }

  private async processQueue() {
    // Failsafe: check for any running jobs that have been active for more than 100 seconds and mark them as failed.
    let changed = false;
    this.queue.forEach(j => {
      if (j.status === 'running' && j.startedAt && (Date.now() - j.startedAt > 100000)) {
        console.warn(`Failsafe: job ${j.id} (${j.name}) has been active for over 100 seconds. Terminating with timeout.`);
        j.status = 'failed';
        j.error = 'AI response timed out (100s background failsafe limit reached). The request was cancelled to prevent freezing the pipeline.';
        j.completedAt = Date.now();
        this.runningCount = Math.max(0, this.runningCount - 1);
        changed = true;
      }
    });
    if (changed) {
      this.notify();
    }

    if (this.isPaused || this.runningCount >= this.maxConcurrent) return;

    const pendingJobs = this.queue
      .filter(j => j.status === 'pending')
      .sort((a, b) => {
        const priorityMap = { high: 0, normal: 1, low: 2 };
        if (priorityMap[a.priority] !== priorityMap[b.priority]) {
          return priorityMap[a.priority] - priorityMap[b.priority];
        }
        return a.createdAt - b.createdAt;
      });

    if (pendingJobs.length === 0) return;

    const job = pendingJobs[0];
    this.runJob(job);
  }

  private async runJob(job: Job) {
    job.status = 'running';
    job.startedAt = Date.now();
    this.runningCount++;
    this.notify();

    try {
      const localStorageKey = typeof window !== 'undefined' ? localStorage.getItem('noor-api-key') || '' : '';
      const apiKey = job.apiKey || localStorageKey || process.env.GEMINI_API_KEY || '';
      
      const browserNow = new Date();
      const browserTimezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC';
      const temporalContext = `

**DYNAMIC TEMPORAL CONTEXT (Browser Settings):**
- **Date/Time:** ${browserNow.toString()} (ISO: ${browserNow.toISOString()})
- **Time Zone:** ${browserTimezone}
`;

      const resolvedSystemInstruction = (job.systemInstruction || SYSTEM_INSTRUCTIONS) + temporalContext;

      // Construct "raw" request for logging
      const rawRequestObj = {
        model: "gemini-3.5-flash",
        contents: job.prompt,
        config: {
          systemInstruction: resolvedSystemInstruction,
          responseMimeType: "application/json",
        }
      };
      job.rawRequest = JSON.stringify(rawRequestObj, (key, value) => {
        if (typeof value === 'string' && value.length > 100 && value.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
          return value.substring(0, 10) + "..." + value.substring(value.length - 10);
        }
        return value;
      }, 2);

      const response = await generateSong(job.prompt || '', apiKey, resolvedSystemInstruction);
      
      // Capture "raw" response for logging
      const rawResponseObj = {
        candidates: response.candidates,
        usageMetadata: (response as any).usageMetadata,
      };
      job.rawResponse = JSON.stringify(rawResponseObj, (key, value) => {
        if (typeof value === 'string' && value.length > 100 && value.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
          return value.substring(0, 10) + "..." + value.substring(value.length - 10);
        }
        return value;
      }, 2);

      if (!response.text) throw new Error("No text returned from AI");
      
      const parsed = cleanAndParseJSON(response.text);
      if (parsed && typeof parsed === 'object') {
        if (job.generationSettings) {
          parsed.settings = job.generationSettings;
        }
      }
      job.result = parsed;
      job.status = 'done';
    } catch (error: any) {
      if (!job.retryCount || job.retryCount === 0) {
        job.retryCount = 1;
        job.status = 'pending';
        job.error = undefined;
        // Keep logs clean that it is auto-retrying
        console.warn(`Job "${job.name}" (${job.id}) failed on first attempt. Retrying automatically... Error: ${error.message}`);
      } else {
        job.status = 'failed';
        job.error = error.message;
        job.retryCount = 2; // Failed twice!
        if (error.message.includes('429')) {
          this.pause();
        }
      }
    } finally {
      job.completedAt = Date.now();
      this.runningCount--;
      this.notify();
    }
  }
}

export const jobService = new JobService();
