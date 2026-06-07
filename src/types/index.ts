export type Priority = 'low' | 'normal' | 'high';
export type JobStatus = 'pending' | 'running' | 'done' | 'failed';

export interface Job {
  id: string;
  name: string;
  priority: Priority;
  status: JobStatus;
  createdAt: number;
  apiKey?: string;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  rawRequest?: string;
  rawResponse?: string;
  result?: any;
  prompt?: string;
  systemInstruction?: string;
  retryCount?: number;
  generationSettings?: {
    instructions: string;
    musicInspiration: string;
    dialectId: string;
    rating: string;
    coreGrooves: string[];
    emotion: string;
    selfReflect?: boolean;
  };
}

export interface StoryPrompts {
  miranda: { wan: string; sdxl: string };
  annelies: { wan: string; sdxl: string };
  fannie: { wan: string; sdxl: string };
  emma: { wan: string; sdxl: string };
  mirandaAnnelies: { wan: string; sdxl: string };
  fannieEmma: { wan: string; sdxl: string };
  group: { wan: string; sdxl: string };
}

export interface PortraitPrompts {
  miranda: { wan: string; sdxl: string };
  annelies: { wan: string; sdxl: string };
  fannie: { wan: string; sdxl: string };
  emma: { wan: string; sdxl: string };
}

export type PortraitType = 'Face' | 'Torso' | 'Body';

export interface ForbiddenTopics {
  barefoot: boolean;
  naturism: boolean;
  farm: boolean;
  singers: boolean;
}

export interface Song {
  title: string;
  style: string;
  lyrics: string;
  imagePrompts?: {
    start: string;
    middle: string;
    end: string;
  };
  story?: string;
  storyPrompts?: StoryPrompts;
  interview?: string;
  settings?: any;
}

export interface Instrument {
  name: string;
  type: string;
}

export interface Style {
  name: string;
  substyles: string[];
}

export interface LibraryItem {
  id: string;
  name: string;
  type: 'song' | 'image' | 'xml' | 'json' | 'text' | 'markdown';
  content: any;
  sourceUrl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  title: string;
  details: string;
}
