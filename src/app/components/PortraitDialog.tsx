import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { PortraitPrompts, PortraitType } from '../../types';
import { Check, User, FileText, Download, RefreshCw, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MarkdownView } from './MarkdownView';

interface PortraitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: PortraitType;
  prompts: PortraitPrompts;
  onRegenerate: (type: PortraitType) => void;
}

type Tab = 'miranda' | 'annelies' | 'fannie' | 'emma' | 'summary';

export const PortraitDialog: React.FC<PortraitDialogProps> = ({
  isOpen,
  onClose,
  type,
  prompts,
  onRegenerate
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('miranda');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'miranda', label: 'Miranda', icon: <User size={16} /> },
    { id: 'annelies', label: 'Annelies', icon: <User size={16} /> },
    { id: 'fannie', label: 'Fannie', icon: <User size={16} /> },
    { id: 'emma', label: 'Emma', icon: <User size={16} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={16} /> },
  ];

  const generateMarkdown = () => {
    const singers = [
      { id: 'miranda', label: 'Miranda' },
      { id: 'annelies', label: 'Annelies' },
      { id: 'fannie', label: 'Fannie' },
      { id: 'emma', label: 'Emma' }
    ];

    let md = `# Portrait Prompts: ${type}\n\n`;
    
    md += `## Stable Diffusion (SDXL) - Without Clothing\n\n`;
    singers.forEach(s => {
      md += `### ${s.label}\n\n${prompts[s.id as keyof PortraitPrompts].sdxl}\n\n`;
    });

    md += `## Wan Video - With Clothing\n\n`;
    singers.forEach(s => {
      md += `### ${s.label}\n\n${prompts[s.id as keyof PortraitPrompts].wan}\n\n`;
    });

    return md;
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Portraits.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPromptSection = (singer: keyof PortraitPrompts) => {
    const singerPrompts = prompts[singer];
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-lavender-accent flex items-center gap-2">
            <Wand2 size={16} />
            WAN Video Prompt (With Clothing)
          </h4>
          <div className="relative group">
            <textarea
              readOnly
              value={singerPrompts.wan}
              className="w-full h-40 bg-black/40 border border-lavender-border rounded p-3 text-sm focus:ring-1 focus:ring-lavender-accent outline-none resize-none font-mono"
            />
            <button
              onClick={() => navigator.clipboard.writeText(singerPrompts.wan)}
              className="absolute top-2 right-2 p-1.5 bg-lavender-surface/80 hover:bg-lavender-accent hover:text-lavender-bg rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy to Clipboard"
            >
              <Check size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-lavender-accent flex items-center gap-2">
            <Wand2 size={16} />
            SDXL Weighted Prompt (Without Clothing)
          </h4>
          <div className="relative group">
            <textarea
              readOnly
              value={singerPrompts.sdxl}
              className="w-full h-40 bg-black/40 border border-lavender-border rounded p-3 text-sm focus:ring-1 focus:ring-lavender-accent outline-none resize-none font-mono"
            />
            <button
              onClick={() => navigator.clipboard.writeText(singerPrompts.sdxl)}
              className="absolute top-2 right-2 p-1.5 bg-lavender-surface/80 hover:bg-lavender-accent hover:text-lavender-bg rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy to Clipboard"
            >
              <Check size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title={`${type} Portraits`}
      size="full"
    >
      <div className="flex flex-col h-full bg-lavender-bg/40">
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-lavender-border bg-lavender-surface/30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onRegenerate(type)}
              className="flex items-center gap-2 px-4 py-1.5 bg-lavender-accent text-lavender-bg rounded font-bold hover:scale-105 transition-all text-sm"
            >
              <RefreshCw size={16} />
              Regenerate
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 border border-lavender-accent text-lavender-accent rounded font-bold hover:bg-lavender-accent hover:text-lavender-bg transition-all text-sm"
          >
            <Download size={16} />
            Download Summary
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-lavender-border bg-lavender-surface/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id
                  ? "text-lavender-accent bg-lavender-accent/5"
                  : "text-lavender-text/50 hover:text-lavender-text hover:bg-lavender-surface/30"
              )}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lavender-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'miranda' && renderPromptSection('miranda')}
          {activeTab === 'annelies' && renderPromptSection('annelies')}
          {activeTab === 'fannie' && renderPromptSection('fannie')}
          {activeTab === 'emma' && renderPromptSection('emma')}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-black/40 border border-lavender-border rounded p-6 h-[65vh] overflow-hidden">
                <MarkdownView content={generateMarkdown()} filename="Portraits" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
