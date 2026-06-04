import React, { useState } from 'react';
import { LogEntry } from '../../types';
import { Dialog } from './Dialog';
import { formatTimestamp, cn } from '../../lib/utils';
import { ChevronRight, ChevronDown, Copy, Download, Check } from 'lucide-react';

interface LogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
}

export const LogDialog: React.FC<LogDialogProps> = ({ isOpen, onClose, logs }) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const filteredLogs = logs.filter(log => activeLevel === 'all' || log.level === activeLevel);

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCopy = (entry: LogEntry) => {
    navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const levels = [
    { id: 'all', label: 'All' },
    { id: 'info', label: 'Info' },
    { id: 'warn', label: 'Warn' },
    { id: 'error', label: 'Error' },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="System Console Log" size="full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex border-b border-lavender-border">
            {levels.map(level => (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level.id as any)}
                className={cn(
                  "px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors",
                  activeLevel === level.id 
                    ? "border-lavender-accent text-lavender-accent" 
                    : "border-transparent text-lavender-text/50 hover:text-lavender-text"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-lavender-accent text-lavender-bg font-bold rounded hover:opacity-90"
          >
            <Download size={16} /> Export JSON
          </button>
        </div>
        <div className="flex-1 overflow-auto border border-lavender-border rounded bg-black/30">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-lavender-text/30 italic">No {activeLevel !== 'all' ? activeLevel : ''} log entries yet.</div>
          ) : (
            <div className="divide-y divide-lavender-border">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-2">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleExpand(log.id)}>
                    {expanded.includes(log.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-xs font-mono text-lavender-text/50">{formatTimestamp(log.timestamp)}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                      log.level === 'error' ? "bg-red-500/20 text-red-400" :
                      log.level === 'warn' ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/20 text-blue-400"
                    )}>
                      {log.level}
                    </span>
                    <span className="font-bold flex-1">{log.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(log); }}
                      className="p-1 hover:bg-lavender-surface rounded"
                    >
                      {copiedId === log.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  {expanded.includes(log.id) && (
                    <div className="mt-2 ml-7 p-3 bg-black/50 rounded border border-lavender-border/50 font-mono text-xs whitespace-pre-wrap">
                      {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
