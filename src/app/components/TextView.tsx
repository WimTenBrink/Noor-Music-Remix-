import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface TextViewProps {
  content: string;
}

export const TextView: React.FC<TextViewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-lavender-surface/10">
      <div className="flex justify-end gap-2 p-2 border-b border-lavender-border bg-lavender-bg/50">
        <button 
          onClick={handleCopy} 
          className="p-2 hover:bg-lavender-surface rounded text-lavender-accent transition-colors" 
          title="Copy"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
        <button 
          onClick={handleDownload} 
          className="p-2 hover:bg-lavender-surface rounded text-lavender-accent transition-colors" 
          title="Download Text"
        >
          <Download size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <pre className="font-mono text-sm text-lavender-text/80 whitespace-pre-wrap break-all leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
};
