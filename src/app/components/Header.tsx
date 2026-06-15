import React, { useState } from 'react';
import { NoorLogo } from './NoorLogo';
import { FileText, Settings, HelpCircle, ChevronDown, Wand2, Terminal, Mic2, ImageIcon, BookOpen, Edit } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  onAction: (action: string) => void;
  onGenerate: () => void;
  onShowLogs: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAction, 
  onGenerate, 
  onShowLogs
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      id: 'singers',
      label: 'Singers',
      icon: <Mic2 size={16} />,
      items: [
        { id: 'the-band', label: 'The Band', tooltipTitle: 'Vocal Group', tooltipContent: 'Compose as a collective full-band output.' },
        { id: 'wardrobe', label: 'Wardrobe System', tooltipTitle: 'Singer Wardrobe Closets', tooltipContent: 'Browse clothing lists and export wardrobe documentation.' },
        { id: 'culinary', label: 'Culinary Database', tooltipTitle: 'Singer Likes/Dislikes', tooltipContent: 'Browse diets, favorites, and kitchen disaster ratings.' },
        { id: 'farm', label: 'Farm Settings', tooltipTitle: 'Abcoude Farm', tooltipContent: 'Explore the band\'s studio homestead, farmlands, and attic.' },
        { id: 'singer-miranda', label: 'Miranda Noor', tooltipTitle: 'Lead Vocals', tooltipContent: "Compose specifically for Miranda's clean soaring soprano." },
        { id: 'singer-annelies', label: 'Annelies Brink', tooltipTitle: 'Alto Harmonies', tooltipContent: 'Pitch deep velvety alto phrases and low-octave backups.' },
        { id: 'singer-fannie', label: 'Fannie de Jong', tooltipTitle: 'Folk Soprano', tooltipContent: 'Traditional bright tones, ideal for celtic folk or ballads.' },
        { id: 'singer-emma', label: 'Emma Vermeer', tooltipTitle: 'Whispering Mezzo', tooltipContent: 'Melancholy, low-octave, intimate conversational notes.' },
        { id: 'singer-face', label: 'Face Photo', tooltipTitle: 'Portrait Singer', tooltipContent: 'Generate portrait-focused close-up visuals.' },
        { id: 'singer-torso', label: 'Torso Shot', tooltipTitle: 'Mid-length Singer', tooltipContent: 'Generate mid-shot performance style illustrations.' },
        { id: 'singer-body', label: 'Body Style', tooltipTitle: 'Fullshot Singer', tooltipContent: 'Generate full-body performer portraits.' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      items: [
        { id: 'api-key', label: 'API Key', tooltipTitle: 'Google Gemini Key', tooltipContent: 'Configure your Google Project API Credentials.' },
        { id: 'content-settings', label: 'Content Filters', tooltipTitle: 'Blocked Terms', tooltipContent: 'Specify forbidden topics or words to exclude from generation.' },
        { id: 'clear', label: 'Clear', tooltipTitle: 'Clear Application', tooltipContent: 'Clears all the lyrics stuff and logs and does a refresh of the application.' },
      ]
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle size={16} />,
      items: [
        { id: 'system-instructions', label: 'System Instructions', tooltipTitle: 'System Lore', tooltipContent: 'Instructions to recreate this magnificent application.' },
        { id: 'manual', label: 'User Manual', tooltipTitle: 'Manual Guide', tooltipContent: 'A comprehensive operational manual to master Noor Music.' },
        { id: 'code-overview', label: 'Developer Guide', tooltipTitle: 'Code Architecture', tooltipContent: 'Full structures, state hook definitions, and folder schema catalog.' },
      ]
    }
  ];

  return (
    <header className="h-14 border-b border-lavender-border bg-lavender-bg flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <NoorLogo className="w-8 h-8 text-lavender-accent" />
          <h1 className="text-xl font-bold tracking-tighter text-lavender-accent">Noor Music</h1>
        </div>

        <nav className="flex items-center gap-2">
          {menus.map(menu => (
            <div key={menu.id} className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm font-bold transition-colors",
                  activeMenu === menu.id ? "bg-lavender-surface text-lavender-accent" : "hover:bg-lavender-surface/50"
                )}
              >
                {menu.icon}
                {menu.label}
                <ChevronDown size={14} className={cn("transition-transform", activeMenu === menu.id && "rotate-180")} />
              </button>

              {activeMenu === menu.id && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-lavender-surface border border-lavender-border rounded shadow-xl py-1 z-50">
                  {menu.items.map(item => (
                    <div key={item.id} className="w-full">
                      <Tooltip title={item.tooltipTitle} content={item.tooltipContent} className="block w-full">
                        <button
                          onClick={() => {
                            onAction(item.id);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-lavender-accent hover:text-lavender-bg transition-colors"
                        >
                          {item.label}
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="Event Logs" content="Analyze real-time events, warnings, or debug messages.">
          <button 
            onClick={onShowLogs}
            className="p-2 hover:bg-lavender-surface rounded text-lavender-text/70"
          >
            <Terminal size={20} />
          </button>
        </Tooltip>

        <Tooltip title="Story Narrative" content="Add an overarching background story to influence lyric references and portraits.">
          <button 
            onClick={() => onAction('story')}
            className="flex items-center gap-2 px-4 py-2 border border-lavender-accent/50 text-lavender-accent/80 font-bold rounded-full hover:bg-lavender-accent hover:text-lavender-bg transition-all"
          >
            <BookOpen size={18} />
            Story
          </button>
        </Tooltip>

        <Tooltip title="Composition Images" content="Manage lyric story segments and map them to custom character images.">
          <button 
            onClick={() => onAction('images')}
            className="flex items-center gap-2 px-4 py-2 border border-lavender-accent/50 text-lavender-accent/80 font-bold rounded-full hover:bg-lavender-accent hover:text-lavender-bg transition-all"
          >
            <ImageIcon size={18} />
            Images
          </button>
        </Tooltip>

        <Tooltip title="Karaoke Mode" content="Follow live lyrics bouncing on top of the audio track synchronized.">
          <button 
            onClick={() => onAction('karaoke')}
            className="flex items-center gap-2 px-4 py-2 border border-lavender-accent text-lavender-accent font-bold rounded-full hover:bg-lavender-accent hover:text-lavender-bg transition-all"
          >
            <Mic2 size={18} />
            Karaoke
          </button>
        </Tooltip>

        <Tooltip title="Behind the Scenes" content="Read an extensive interview on how the singers created this song.">
          <button 
            onClick={() => onAction('spoiler')}
            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 font-bold rounded-full hover:bg-red-500 hover:text-white transition-all"
          >
            <BookOpen size={18} />
            Spoiler
          </button>
        </Tooltip>

        <Tooltip title="Create / Modify Song" content="Compose high-fidelity songs and map instruments, language accents, and narrative parameters.">
          <button 
            onClick={onGenerate}
            className="flex items-center gap-2 px-6 py-2 bg-lavender-accent text-lavender-bg font-bold rounded-full hover:opacity-90 transition-all shadow-lg shadow-lavender-accent/20"
          >
            <Wand2 size={18} />
            Generate Song
          </button>
        </Tooltip>
      </div>

      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}
    </header>
  );
};
