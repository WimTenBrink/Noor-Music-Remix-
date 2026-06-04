import React from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  filename?: string;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose, title, content, filename }) => (
  <Dialog isOpen={isOpen} onClose={onClose} title={title} size="full">
    <MarkdownView content={content} filename={filename || title} />
  </Dialog>
);
