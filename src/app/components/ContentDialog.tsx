import React from 'react';
import { Dialog } from './Dialog';
import { ForbiddenTopics } from '../../types';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topics: ForbiddenTopics;
  onToggle: (topic: keyof ForbiddenTopics) => void;
}

export const ContentDialog: React.FC<ContentDialogProps> = ({ isOpen, onClose, topics, onToggle }) => {
  const options: { id: keyof ForbiddenTopics; label: string; description: string }[] = [
    { id: 'barefoot', label: 'Barefoot', description: 'Disable any mention of feet or being barefoot in the lyrics.' },
    { id: 'naturism', label: 'Naturism', description: 'Disable any mention of naturism, nudity, or unadorned bodies.' },
    { id: 'farm', label: 'The Farm', description: 'Disable references to the band\'s rural life, farm animals, or farm chores.' },
    { id: 'singers', label: 'The Singers', description: 'Disable specific references to singer names and their personal relationships to make songs more generic.' },
  ];

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Content Settings"
      size="normal"
    >
      <div className="flex flex-col gap-6 p-4 w-[400px] max-w-full">
        <p className="text-sm text-lavender-text/70 italic">
          Select which topics should be excluded from the generated lyrics to make the songs more generic or focus on specific themes.
        </p>

        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left",
                topics[option.id] 
                  ? "bg-lavender-accent/10 border-lavender-accent ring-1 ring-lavender-accent/50" 
                  : "bg-lavender-surface/30 border-lavender-border hover:border-lavender-accent/50"
              )}
            >
              <div className={cn(
                "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0",
                topics[option.id] 
                  ? "bg-lavender-accent border-lavender-accent" 
                  : "bg-lavender-bg border-lavender-border"
              )}>
                {topics[option.id] && <Check size={16} className="text-lavender-bg stroke-[3]" />}
              </div>
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "font-bold leading-none",
                  topics[option.id] ? "text-lavender-accent" : "text-lavender-text"
                )}>
                  {option.label}
                </span>
                <span className="text-xs text-lavender-text/50">
                  {option.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
