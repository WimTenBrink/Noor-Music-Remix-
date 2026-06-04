import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { StoryPrompts } from '../../types';
import { Check, X, BookOpen, User, Users, Wand2, FileText, Download } from 'lucide-react';
import { MarkdownView } from './MarkdownView';
import { cn } from '../../lib/utils';

interface StoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: string;
  prompts: StoryPrompts;
  onGenerate: (story: string, noClothes: boolean) => void;
  onUpdateStory: (story: string) => void;
  songTitle: string;
}

type Tab = 'story' | 'miranda' | 'annelies' | 'fannie' | 'emma' | 'mirandaAnnelies' | 'fannieEmma' | 'group' | 'summary';

export const StoryDialog: React.FC<StoryDialogProps> = ({
  isOpen,
  onClose,
  story,
  prompts,
  onGenerate,
  onUpdateStory,
  songTitle
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('story');
  const [noClothes, setNoClothes] = useState(false);
  const [localStory, setLocalStory] = useState(story);

  React.useEffect(() => {
    setLocalStory(story);
  }, [story]);

  const handleGenerate = () => {
    onUpdateStory(localStory);
    onGenerate(localStory, noClothes);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'Story', icon: <BookOpen size={16} /> },
    { id: 'miranda', label: 'Miranda', icon: <User size={16} /> },
    { id: 'annelies', label: 'Annelies', icon: <User size={16} /> },
    { id: 'fannie', label: 'Fannie', icon: <User size={16} /> },
    { id: 'emma', label: 'Emma', icon: <User size={16} /> },
    { id: 'mirandaAnnelies', label: 'M & A', icon: <Users size={16} /> },
    { id: 'fannieEmma', label: 'F & E', icon: <Users size={16} /> },
    { id: 'group', label: 'Group', icon: <Users size={16} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={16} /> },
  ];

  const generateMarkdown = () => {
    const sections = [
      { id: 'miranda', label: 'Miranda' },
      { id: 'annelies', label: 'Annelies' },
      { id: 'fannie', label: 'Fannie' },
      { id: 'emma', label: 'Emma' },
      { id: 'mirandaAnnelies', label: 'Miranda & Annelies' },
      { id: 'fannieEmma', label: 'Fannie & Emma' },
      { id: 'group', label: 'Group' }
    ];

    let md = `# Image Prompts Summary: ${songTitle}\n\n`;
    md += `## Stable Diffusion\n\n`;
    sections.forEach(s => {
      md += `### ${s.label}\n\n${prompts[s.id as keyof StoryPrompts].sdxl}\n\n`;
    });

    md += `## Wan Video\n\n`;
    sections.forEach(s => {
      md += `### ${s.label}\n\n${prompts[s.id as keyof StoryPrompts].wan}\n\n`;
    });

    return md;
  };

  const renderPromptSection = (singer: keyof StoryPrompts) => {
    const singerPrompts = prompts[singer];
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-lavender-accent flex items-center gap-2">
            <Wand2 size={16} />
            WAN Video Prompt
          </h4>
          <div className="relative group">
            <textarea
              readOnly
              value={singerPrompts.wan}
              className="w-full h-32 bg-black/40 border border-lavender-border rounded p-3 text-sm focus:ring-1 focus:ring-lavender-accent outline-none resize-none font-mono"
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
            SDXL Weighted Prompt
          </h4>
          <div className="relative group">
            <textarea
              readOnly
              value={singerPrompts.sdxl}
              className="w-full h-32 bg-black/40 border border-lavender-border rounded p-3 text-sm focus:ring-1 focus:ring-lavender-accent outline-none resize-none font-mono"
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
      title="Story & Image Prompts"
      size="full"
    >
      <div className="flex flex-col h-full bg-lavender-bg/40">
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
          {activeTab === 'story' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-lavender-accent uppercase tracking-widest">
                  The Story
                </label>
                <textarea
                  value={localStory}
                  onChange={(e) => setLocalStory(e.target.value)}
                  placeholder="Enter a short story to generate image prompts..."
                  className="w-full h-64 bg-black/40 border border-lavender-border rounded p-4 text-lg focus:ring-1 focus:ring-lavender-accent outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between bg-lavender-surface/20 p-4 rounded-lg border border-lavender-border/50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={noClothes}
                      onChange={(e) => setNoClothes(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-10 h-5 bg-lavender-surface rounded-full transition-colors",
                      noClothes && "bg-lavender-accent"
                    )} />
                    <div className={cn(
                      "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                      noClothes && "translate-x-5"
                    )} />
                  </div>
                  <span className="text-sm font-medium group-hover:text-lavender-accent transition-colors">
                    No Clothes (Generate prompts without clothing)
                  </span>
                </label>

                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-2 bg-lavender-accent text-lavender-bg rounded font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-lavender-accent/20"
                >
                  <Wand2 size={18} />
                  Generate Prompts
                </button>
              </div>
            </div>
          )}

          {activeTab === 'miranda' && renderPromptSection('miranda')}
          {activeTab === 'annelies' && renderPromptSection('annelies')}
          {activeTab === 'fannie' && renderPromptSection('fannie')}
          {activeTab === 'emma' && renderPromptSection('emma')}
          {activeTab === 'mirandaAnnelies' && renderPromptSection('mirandaAnnelies')}
          {activeTab === 'fannieEmma' && renderPromptSection('fannieEmma')}
          {activeTab === 'group' && renderPromptSection('group')}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-lavender-accent">Prompts Summary</h3>
              </div>
              <div className="bg-black/40 border border-lavender-border rounded p-6 h-[60vh] overflow-hidden">
                <MarkdownView content={generateMarkdown()} filename={songTitle} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
