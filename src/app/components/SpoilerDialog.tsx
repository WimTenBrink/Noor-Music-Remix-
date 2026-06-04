import React from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';
import { DEFAULT_INTERVIEW_MD } from '../../constants/defaultInterview';

interface SpoilerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle?: string;
  interviewContent?: string;
}

export const SpoilerDialog: React.FC<SpoilerDialogProps> = ({ 
  isOpen, 
  onClose, 
  songTitle = 'Untitled Song', 
  interviewContent 
}) => {
  const content = interviewContent || DEFAULT_INTERVIEW_MD;
  const displayTitle = interviewContent 
    ? `Behind the Scenes: ${songTitle}` 
    : 'Behind the Scenes Interview (Spoilers)';

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      onConfirm={onClose}
      title={displayTitle}
      size="full"
    >
      <div className="w-full h-full flex flex-col bg-lavender-bg text-lavender-text font-sans">
        <div className="bg-lavender-surface p-4 border border-lavender-border rounded-lg mb-4 text-sm text-lavender-text/80 leading-relaxed">
          <p className="font-bold text-lavender-accent mb-1">Spoiler Interview Feature</p>
          This dialog presents an exclusive, behind-the-scenes deep-dive interview with the four singers of Noor conducted by Dutch journalist <strong className="text-lavender-accent">Senna Bakker</strong>. It is saved directly inside the song's JSON file.
        </div>
        <div className="flex-1 bg-lavender-surface border border-lavender-border rounded-lg overflow-hidden min-h-[400px]">
          <MarkdownView content={content} filename={`${songTitle.replace(/\s+/g, '_')}_interview`} />
        </div>
      </div>
    </Dialog>
  );
};
