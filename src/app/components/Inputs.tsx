import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(String(props.value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full text-lavender-text font-sans">
      <div className="flex justify-between items-center">
        {label && <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">{label}</label>}
        <Tooltip title="Copy text" content="Copy full contents of this textbox securely to your system clipboard.">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-lavender-surface rounded text-lavender-accent transition-colors duration-150"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </Tooltip>
      </div>
      <textarea 
        {...props}
        className="w-full bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent resize-none font-sans"
      />
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(String(props.value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full text-lavender-text font-sans">
      <div className="flex justify-between items-center">
        {label && <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">{label}</label>}
        <Tooltip title="Copy text" content="Copy full contents of this textbox securely to your system clipboard.">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-lavender-surface rounded text-lavender-accent transition-colors duration-150"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </Tooltip>
      </div>
      <input 
        {...props}
        className="w-full bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent font-sans"
      />
    </div>
  );
};
