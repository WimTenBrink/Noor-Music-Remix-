import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Job } from '../../types';
import { AlertCircle, Copy, Check, Info, RefreshCw, HelpCircle } from 'lucide-react';

interface DoubleFailedDialogProps {
  job: Job | null;
  onClose: () => void;
}

export const DoubleFailedDialog: React.FC<DoubleFailedDialogProps> = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const handleCopyError = () => {
    navigator.clipboard.writeText(JSON.stringify({
      jobId: job.id,
      jobName: job.name,
      error: job.error,
      systemInstructionLength: job.systemInstruction?.length || 0,
      timestamp: Date.now()
    }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine potential "why" based on error text
  let whyMessage = 'An unexpected error occurred during execution. This could be due to network fluctuations or transient errors on the server.';
  let actionSuggestions = [
    'Check your API key in the Settings menu.',
    'Verify that your internet connection is active and stable.',
    'Please try running the task again in a few moments.'
  ];

  if (job.error?.includes('429')) {
    whyMessage = 'The Google developer platform received too many requests in a short timeframe (Rate Limit Exceeded). The job queue has been automatically paused.';
    actionSuggestions = [
      'Wait a minute for the rate limits to reset.',
      'Click Resume in the status bar to start pending tasks once ready.',
      'Ensure you are not sending highly volume-heavy prompts too quickly.'
    ];
  } else if (job.error?.includes('API key') || job.error?.includes('key') || job.error?.includes('API_KEY')) {
    whyMessage = 'The API key provided appears to be invalid, inactive, or completely missing.';
    actionSuggestions = [
      'Open the Settings menu. Check that your Google Projects API key is entered correctly.',
      'Test your API key directly on Google AI Studio if you suspect it is disabled.',
      'Ensure the key has permission to call the specified AI models.'
    ];
  } else if (job.error?.toLowerCase().includes('safety') || job.error?.toLowerCase().includes('blocked')) {
    whyMessage = 'The generation was flagged or blocked by safety filters of the model.';
    actionSuggestions = [
      'Refine your instructions or prompt to avoid topics that could trigger safety guards.',
      'Check the Content Settings in the "Edit" menu to toggle barefoot/naturism filters if applicable.',
      'Modify the lyrics instructions to adhere strictly to appropriate content guidelines.'
    ];
  }

  return (
    <Dialog
      isOpen={!!job}
      onClose={onClose}
      onConfirm={onClose}
      title="Critical Job Execution Error"
    >
      <div className="max-w-2xl bg-lavender-bg text-lavender-text font-sans p-2">
        <div className="flex items-start gap-4 p-4 bg-red-950/20 border border-red-900/30 rounded-2xl mb-6">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
            <AlertCircle size={28} />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-bold text-red-200">
              Task Failed Code 102 (Double-Failure State)
            </h3>
            <p className="text-sm text-red-300">
              The application completed the first attempt, encountered an error, and automatically initiated a second execution step. The retry also failed.
            </p>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-lavender-surface border border-lavender-border/40 p-3 rounded-lg">
              <span className="text-lavender-text/40 block uppercase tracking-wide">Failing Job</span>
              <span className="font-bold text-lavender-accent text-sm truncate block mt-0.5">{job.name}</span>
            </div>
            <div className="bg-lavender-surface border border-lavender-border/40 p-3 rounded-lg">
              <span className="text-lavender-text/40 block uppercase tracking-wide">Job ID / Retries</span>
              <span className="font-bold text-lavender-text text-sm block mt-0.5">{job.id} (Attempted 2x)</span>
            </div>
          </div>

          {/* Exact Error Message */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-lavender-accent/70 uppercase tracking-widest flex items-center gap-1">
                <Info size={12} />
                Raw Error Message
              </span>
              <button
                onClick={handleCopyError}
                className="flex items-center gap-1 px-2.5 py-1 text-xs hover:bg-lavender-surface border border-lavender-border/40 text-lavender-text/60 rounded bg-lavender-bg transition-all"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Payload'}
              </button>
            </div>
            <div className="bg-red-900/10 border border-red-900/20 p-4 rounded-xl font-mono text-sm text-red-300 overflow-x-auto break-all">
              {job.error || 'Unknown execution failure.'}
            </div>
          </div>

          {/* Diagnosis and Suggestions */}
          <div className="bg-lavender-surface border border-lavender-border p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-lavender-border/40 pb-2">
              <HelpCircle size={18} className="text-lavender-accent" />
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-lavender-accent">
                Troubleshooting Diagnosis
              </h4>
            </div>

            <p className="text-sm text-lavender-text/80 leading-relaxed font-semibold">
              {whyMessage}
            </p>

            <div className="space-y-2 mt-4">
              <span className="text-xs font-bold text-lavender-accent uppercase tracking-wider block">Suggested Actions:</span>
              <ul className="list-disc list-inside space-y-1.5 pl-1.5">
                {actionSuggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-lavender-text/70 leading-normal">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
