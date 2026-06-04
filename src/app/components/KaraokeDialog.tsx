import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Download, Copy, Check } from 'lucide-react';
import { parseLyrics, getCleanFormattedLyrics } from '../utils/lyricsParser';

interface KaraokeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lyrics: string;
}

export const KaraokeDialog: React.FC<KaraokeDialogProps> = ({ isOpen, onClose, title, lyrics }) => {
  const [copied, setCopied] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sections = parseLyrics(lyrics);
  const cleanLyrics = getCleanFormattedLyrics(lyrics);

  useEffect(() => {
    if (sections.length > 0 && (!selectedSectionId || !sections.some(s => s.id === selectedSectionId))) {
      setSelectedSectionId(sections[0].id);
    }
  }, [lyrics, sections, selectedSectionId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanLyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'pdf') => {
    if (format === 'md') {
      const content = `# ${title || 'Untitled Song'}\n\n${cleanLyrics}`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'song'}.md`;
      a.click();
    } else {
      window.print(); // Simple PDF export via print
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Karaoke Mode"
      onConfirm={onClose}
      size="full"
    >
      <div className="flex flex-col gap-4 w-full h-[80vh] overflow-hidden">
        {/* Top actions toolbar */}
        <div className="flex justify-between items-center p-2 border-b border-lavender-border">
          <span className="text-sm text-lavender-text/60">
            Select a verse or section to view its performance details on the left.
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy} 
              className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors" 
              title="Copy Clean Lyrics"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
            <button 
              onClick={() => handleDownload('md')} 
              className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors" 
              title="Download Lyrics Markdown"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => handleDownload('pdf')} 
              className="px-3 py-1 hover:bg-lavender-surface rounded text-lavender-text font-bold text-sm transition-colors border border-lavender-border"
              title="Export to PDF"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Content area: Sidebar + Main Lyrics Panel */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Left Sidebar holding instructions */}
          <div className="w-1/4 min-w-[280px] max-w-[360px] bg-lavender-surface/10 border border-lavender-border/40 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-lavender-accent border-b border-lavender-border/40 pb-2 flex items-center justify-between">
              <span>Performance Details</span>
              <span className="text-xs bg-lavender-surface px-2 py-0.5 rounded text-lavender-accent">
                {sections.length} Sections
              </span>
            </h3>
            
            <div className="flex flex-col gap-3">
              {sections.map((section) => {
                const isSelected = selectedSectionId === section.id;
                const checkString = `${section.title} ${section.singer || ''} ${section.melodicPeak || ''} ${section.consonantTiming || ''}`.toLowerCase();
                const isRap = checkString.includes('rap') || checkString.includes('hip hop') || checkString.includes('rapper') || checkString.includes('rapping') || checkString.includes('rapped');
                const isOpera = !isRap && (checkString.includes('opera') || checkString.includes('operatic') || checkString.includes('soprano') || checkString.includes('coloratura') || checkString.includes('aria'));

                const borderStyle = isSelected 
                  ? (isRap ? 'border-yellow-500 bg-yellow-500/10 shadow-md translate-x-1' : isOpera ? 'border-violet-500/80 bg-violet-500/10 shadow-md translate-x-1' : 'bg-lavender-accent/15 border-lavender-accent shadow-md translate-x-1')
                  : (isRap ? 'bg-yellow-500/2 border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5' : isOpera ? 'bg-violet-500/2 border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/5' : 'bg-lavender-surface/5 border-lavender-border/20 hover:border-lavender-border/80 hover:bg-lavender-surface/10');

                const titleAccent = isSelected
                  ? (isRap ? 'text-yellow-400 font-extrabold' : isOpera ? 'text-violet-300 font-extrabold' : 'text-lavender-accent')
                  : (isRap ? 'text-yellow-500' : isOpera ? 'text-violet-400' : 'text-lavender-text');

                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`text-left p-4 rounded-lg transition-all border outline-none ${borderStyle}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-base ${titleAccent}`}>
                        {section.title}
                        {isRap && ' ⚡'}
                        {isOpera && ' 🎭'}
                      </span>
                      {section.tempo && (
                        <span className="text-[10px] bg-lavender-surface px-1.5 py-0.5 rounded text-lavender-accent font-mono border border-lavender-border/40">
                          {section.tempo}
                        </span>
                      )}
                    </div>

                    {section.singer && (
                      <div className="text-xs text-lavender-text/80 mb-3 bg-lavender-surface/30 px-2 py-1 rounded border border-lavender-border/10 italic">
                        Vocal: {section.singer}
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs text-lavender-text/90">
                      {section.key && (
                        <div className="flex gap-1">
                          <span className="font-semibold text-lavender-accent/80">Key:</span>
                          <span className="font-mono">{section.key}</span>
                        </div>
                      )}
                      {section.melodicPeak && (
                        <div>
                          <span className="font-semibold text-lavender-accent/80">Melodic Peak:</span>
                          <p className="mt-0.5 ml-1 leading-normal text-lavender-text/80">{section.melodicPeak}</p>
                        </div>
                      )}
                      {section.consonantTiming && (
                        <div>
                          <span className="font-semibold text-lavender-accent/80">Consonant Timing:</span>
                          <p className="mt-0.5 ml-1 leading-normal text-lavender-text/80">{section.consonantTiming}</p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Main Lyrics Panel */}
          <div className="flex-1 bg-lavender-bg/30 border border-lavender-border/40 rounded-lg flex flex-col p-8 overflow-y-auto min-h-0">
            <h1 className="text-3xl font-bold text-lavender-accent text-center border-b border-lavender-border pb-4 mb-6">
              {title || 'Untitled Song'}
            </h1>
            
            <div className="flex flex-col gap-6 text-center py-4">
              {sections.length === 0 ? (
                <div className="text-xl text-lavender-text/50">No lyrics available.</div>
              ) : (
                sections.map((section) => {
                  const isSelected = selectedSectionId === section.id;
                  const checkString = `${section.title} ${section.singer || ''} ${section.melodicPeak || ''} ${section.consonantTiming || ''}`.toLowerCase();
                  const isRap = checkString.includes('rap') || checkString.includes('hip hop') || checkString.includes('rapper') || checkString.includes('rapping') || checkString.includes('rapped');
                  const isOpera = !isRap && (checkString.includes('opera') || checkString.includes('operatic') || checkString.includes('soprano') || checkString.includes('coloratura') || checkString.includes('aria'));

                  // Box highlighting based on selection + style
                  let activeBoxStyle = 'bg-lavender-accent/5 border-lavender-accent/70 scale-[1.01] shadow-lg';
                  if (isSelected) {
                    if (isRap) activeBoxStyle = 'bg-yellow-500/5 border-yellow-500/60 scale-[1.01] shadow-[0_0_15px_rgba(234,179,8,0.15)]';
                    else if (isOpera) activeBoxStyle = 'bg-violet-500/5 border-violet-500/60 scale-[1.01] shadow-[0_0_15px_rgba(139,92,246,0.15)]';
                  }

                  const boxHoverStyle = isSelected
                    ? activeBoxStyle
                    : 'border-transparent hover:bg-lavender-surface/10 hover:border-lavender-border/20';

                  // Font colors for rap (yellow) and opera (light violet)
                  const fontColorStyle = isRap 
                    ? 'text-yellow-300 font-semibold drop-shadow-[0_0_4px_rgba(234,179,8,0.15)]' 
                    : isOpera 
                      ? 'text-violet-300 font-medium drop-shadow-[0_0_4px_rgba(139,92,246,0.15)]' 
                      : 'text-lavender-text font-medium';

                  return (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`p-6 rounded-xl transition-all cursor-pointer duration-300 border ${boxHoverStyle}`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isRap ? 'bg-yellow-500/20 text-yellow-300' : isOpera ? 'bg-violet-500/20 text-violet-300' : 'bg-lavender-surface/60 text-lavender-accent'
                        }`}>
                          {section.title}
                          {isRap && ' ⚡'}
                          {isOpera && ' 🎭'}
                        </span>
                        {section.singer && (
                          <span className={`text-xs px-2 py-0.5 rounded-full italic ${
                            isRap ? 'bg-yellow-500/10 text-yellow-1050/70' : isOpera ? 'bg-violet-500/10 text-violet-1050/70' : 'bg-lavender-accent/10 text-lavender-text/80'
                          }`}>
                            {section.singer}
                          </span>
                        )}
                      </div>
                      
                      <div className={`whitespace-pre-line text-2xl leading-relaxed ${fontColorStyle}`}>
                        {section.lines.join('\n')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
