import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy, Check } from 'lucide-react';
import { SINGERS } from '../../constants/singers';

interface MarkdownViewProps {
  content: string;
  children?: React.ReactNode;
  filename?: string;
}

const calculateAge = (birthDate: string) => {
  const today = new Date(); // Dynamic current date from browser settings
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, children, filename = 'document' }) => {
  const [copied, setCopied] = useState(false);

  const processedContent = useMemo(() => {
    let result = content;
    SINGERS.forEach(singer => {
      const age = calculateAge(singer.birthDate);
      const placeholder = `{${singer.id}-age}`;
      result = result.replaceAll(placeholder, age.toString());
    });
    
    // Clean any AI-generated HTML p elements with align and image blocks
    result = result.replace(/<p\s+align="center">[\s\S]*?<\/p>/gi, '');
    result = result.replace(/<img[\s\S]*?\/>/gi, '');
    result = result.replace(/<p\s+align='center'>[\s\S]*?<\/p>/gi, '');
    return result;
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(processedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'pdf') => {
    if (format === 'md') {
      const blob = new Blob([processedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      a.click();
    } else {
      window.print(); // Simple PDF export via print
    }
  };

  useEffect(() => {
    const mj = (window as any).MathJax;
    if (mj) {
      // Small timeout to let React render the DOM node completely
      const timer = setTimeout(() => {
        try {
          mj.typesetPromise?.();
        } catch (err) {
          console.error('MathJax typeset error:', err);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [processedContent]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex justify-end gap-2 p-2 border-b border-lavender-border">
        <button onClick={handleCopy} className="p-2 hover:bg-lavender-surface rounded" title="Copy">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <button onClick={() => handleDownload('md')} className="p-2 hover:bg-lavender-surface rounded" title="Download Markdown"><Download size={16} /></button>
        <button onClick={() => handleDownload('pdf')} className="p-2 hover:bg-lavender-surface rounded font-bold text-xs">PDF</button>
      </div>
      <div className="flex-1 overflow-auto p-6 markdown-body">
        {children}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{processedContent}</ReactMarkdown>
      </div>
    </div>
  );
};
