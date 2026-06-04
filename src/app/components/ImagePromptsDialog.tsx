import React from 'react';
import { Dialog } from './Dialog';
import { TextArea } from './Inputs';
import { ImageIcon } from 'lucide-react';

interface ImagePromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: {
    start: string;
    middle: string;
    end: string;
  };
  onUpdatePrompt: (key: 'start' | 'middle' | 'end', value: string) => void;
}

export const ImagePromptsDialog: React.FC<ImagePromptsDialogProps> = ({ 
  isOpen, 
  onClose, 
  prompts,
  onUpdatePrompt
}) => {
  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Image Generation Prompts"
      onConfirm={onClose}
    >
      <div className="flex flex-col gap-6 min-w-[500px] p-2">
        <div className="flex items-center gap-3 text-lavender-accent mb-2">
          <ImageIcon size={24} />
          <p className="text-sm opacity-70">These prompts are generated for WAN image generation (9:16 portrait).</p>
        </div>

        <TextArea 
          label="Start of the Song"
          value={prompts.start}
          onChange={(e) => onUpdatePrompt('start', e.target.value)}
          rows={4}
          placeholder="Prompt for the beginning of the song..."
        />

        <TextArea 
          label="Middle of the Song"
          value={prompts.middle}
          onChange={(e) => onUpdatePrompt('middle', e.target.value)}
          rows={4}
          placeholder="Prompt for the middle of the song..."
        />

        <TextArea 
          label="Ending of the Song"
          value={prompts.end}
          onChange={(e) => onUpdatePrompt('end', e.target.value)}
          rows={4}
          placeholder="Prompt for the end of the song..."
        />
      </div>
    </Dialog>
  );
};
