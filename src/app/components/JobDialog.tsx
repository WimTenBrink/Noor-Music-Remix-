import React, { useState } from 'react';
import { Job } from '../../types';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';
import { TreeView } from './TreeView';
import { ImageView } from './ImageView';
import { cn } from '../../lib/utils';

interface JobDialogProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDialog: React.FC<JobDialogProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState<'result' | 'input' | 'error' | 'request' | 'response'>('result');

  if (!job) return null;

  const tabs = [
    { id: 'result', label: 'Result' },
    { id: 'input', label: 'Original Data' },
    { id: 'error', label: 'Error', hidden: !job.error },
    { id: 'request', label: 'Raw Request' },
    { id: 'response', label: 'Raw Response' },
  ].filter(t => !t.hidden);

  const renderResult = () => {
    if (!job.result) {
      return <div className="flex items-center justify-center h-full text-lavender-text/30 italic">No result available yet.</div>;
    }

    // If it's a song object (lyrics)
    if (job.result.lyrics) {
      return (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-lavender-accent">{job.result.title}</h2>
            <div className="px-3 py-1 bg-lavender-surface rounded-full text-xs font-bold text-lavender-accent/70 uppercase tracking-widest border border-lavender-border">
              {job.result.style}
            </div>
          </div>
          <MarkdownView 
            content={`# ${job.result.title}\n\n**Style:** ${job.result.style}\n\n---\n\n${job.result.lyrics}`} 
          />
        </div>
      );
    }

    // If it's an image URL
    if (typeof job.result === 'string' && (job.result.startsWith('http') || job.result.startsWith('data:image'))) {
      return <ImageView src={job.result} />;
    }

    // If it's XML or JSON object
    if (typeof job.result === 'object' || (typeof job.result === 'string' && job.result.trim().startsWith('<'))) {
      return <TreeView data={job.result} isRoot />;
    }

    // Default to text
    return <div className="p-4"><MarkdownView content={String(job.result)} /></div>;
  };

  return (
    <Dialog isOpen={!!job} onClose={onClose} title={`Job: ${job.name}`} size="full">
      <div className="flex flex-col h-full">
        <div className="flex border-b border-lavender-border mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors",
                activeTab === tab.id 
                  ? "border-lavender-accent text-lavender-accent" 
                  : "border-transparent text-lavender-text/50 hover:text-lavender-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden bg-lavender-surface/20 rounded border border-lavender-border">
          {activeTab === 'result' && (
            <div className="h-full overflow-auto">
              {renderResult()}
            </div>
          )}
          {activeTab === 'input' && (
            <div className="h-full overflow-auto p-4">
              <div className="mb-6">
                <h4 className="text-xs font-bold text-lavender-accent uppercase mb-2">System Instructions</h4>
                <div className="p-4 bg-lavender-surface rounded text-sm font-mono whitespace-pre-wrap">
                  {job.systemInstruction || "Noor Songwriter System Instructions..."}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xs font-bold text-lavender-accent uppercase mb-2">User Prompt</h4>
                <div className="p-4 bg-lavender-surface rounded whitespace-pre-wrap">{job.prompt}</div>
              </div>
            </div>
          )}
          {activeTab === 'error' && (
            <div className="h-full overflow-auto p-4 text-red-400">
              <h4 className="text-lg font-bold mb-2">Error Details</h4>
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded whitespace-pre-wrap">{job.error}</div>
            </div>
          )}
          {activeTab === 'request' && (
            <div className="h-full overflow-auto">
              <TreeView data={JSON.parse(job.rawRequest || '{}')} isRoot />
            </div>
          )}
          {activeTab === 'response' && (
            <div className="h-full overflow-auto">
              <TreeView data={JSON.parse(job.rawResponse || '{}')} isRoot />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
