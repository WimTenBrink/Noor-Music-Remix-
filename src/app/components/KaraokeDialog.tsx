import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from './Dialog';
import { 
  Download, Copy, Check, UploadCloud, FileAudio, Trash2, ShieldCheck, ShieldAlert, RotateCcw 
} from 'lucide-react';
import { parseLyrics, getCleanFormattedLyrics } from '../utils/lyricsParser';
import { Job, Song, LibraryItem } from '../../types';
import { MarkdownView } from './MarkdownView';
import { useJobQueue } from '../hooks/useJobQueue';
import { 
  GENERATE_STORY_BEHIND_SONG_PROMPT,
  GENERATE_ENTENDRES_PROMPT,
  GENERATE_TECHNICAL_PROMPT,
  GENERATE_INTERVIEW_REVIEW_PROMPT,
  GENERATE_ANALYSIS_PROMPT,
  GENERATE_COMPARE_PROMPT
} from '../../constants/prompts';
import { 
  SYSTEM_INSTRUCTIONS_STORY_BEHIND_SONG,
  SYSTEM_INSTRUCTIONS_ENTENDRES,
  SYSTEM_INSTRUCTIONS_TECHNICAL,
  SYSTEM_INSTRUCTIONS_INTERVIEW_REVIEW,
  SYSTEM_INSTRUCTIONS_ANALYSIS,
  SYSTEM_INSTRUCTIONS_COMPARE
} from '../../constants/instructions';

interface KaraokeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lyrics: string;
  isMp3Matched?: boolean;
  onDropMp3?: (file: File) => void;
  jobs?: Job[];
  song?: Song;
}

interface UploadedFile {
  name: string;
  size: number;
  matched: boolean;
  date: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const KaraokeDialog: React.FC<KaraokeDialogProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  lyrics,
  isMp3Matched = false,
  onDropMp3,
  jobs = [],
  song
}) => {
  const { retryJob, addJob } = useJobQueue();
  const [copied, setCopied] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'story' | 'dropFile' | 'compare' | 'entendres' | 'technical' | 'interview' | 'analysis'>('lyrics');
  const [isDragging, setIsDragging] = useState(false);
  
  // Track uploaded files with persistence in localStorage (unique to context)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem('noor-uploaded-mp3s-v4');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-uploaded-mp3s-v4', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const dragCounter = useRef(0);

  const sections = parseLyrics(lyrics);
  const cleanLyrics = getCleanFormattedLyrics(lyrics);

  const checkIfMatched = (fileName: string, songTitle?: string): boolean => {
    if (!songTitle) return false;
    const cleanTitle = songTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanFileName = fileName.toLowerCase().replace(/\.mp3$/, '').replace(/[^a-z0-9]/g, '');
    
    const isPrefixOrSuffix = cleanFileName.includes(cleanTitle) || cleanTitle.includes(cleanFileName);
    const titleWords = songTitle.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
    const areWordsInName = titleWords.length > 0 && titleWords.every(word => fileName.toLowerCase().includes(word));
    return isPrefixOrSuffix || areWordsInName || fileName.toLowerCase() === 'song.mp3' || fileName.toLowerCase() === 'audio.mp3';
  };

  const handleProcessFile = (file: File) => {
    const isMatched = checkIfMatched(file.name, title);
    
    const newFileRecord: UploadedFile = {
      name: file.name,
      size: file.size,
      matched: isMatched,
      date: new Date().toLocaleTimeString()
    };
    
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.name !== file.name);
      return [newFileRecord, ...filtered];
    });

    if (onDropMp3) {
      onDropMp3(file);
    }
  };

  useEffect(() => {
    if (sections.length > 0 && (!selectedSectionId || !sections.some(s => s.id === selectedSectionId))) {
      setSelectedSectionId(sections[0].id);
    }
  }, [lyrics, sections, selectedSectionId]);

  // Reset tab to 'lyrics' when dialog is opened/closed or song changes
  useEffect(() => {
    setActiveTab('lyrics');
  }, [isOpen, title]);

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
      URL.revokeObjectURL(url);
    } else {
      window.print(); // Simple PDF export via print
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (activeTab !== 'dropFile') return;
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (activeTab !== 'dropFile') return;
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (activeTab !== 'dropFile') return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (activeTab !== 'dropFile') return;
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const getJobStatus = (prefix: string) => {
    if (!jobs) return null;
    const matching = jobs.find(j => j.name.startsWith(prefix) && (j.status === 'pending' || j.status === 'running'));
    return matching ? matching.status : null;
  };

  const hasExtraTabs = isMp3Matched || !!song?.entendres || !!song?.technical || !!song?.interviewReview || !!song?.analysis || !!song?.compare;

  const tabEntries = [
    { id: 'lyrics', label: 'Lyrics & Karaoke', prefix: '', desc: 'Main lyrics & vocal arrangement' },
    { id: 'story', label: 'Story Behind Song', prefix: 'Story Behind Song: ', desc: 'The story behind the song itself, explaining what it is about and singer interpretations/quotes.' },
    { id: 'dropFile', label: 'Drop File', prefix: '', desc: 'Drop MP3 audio to unlock more reports' },
    { id: 'compare', label: 'Compare Versions', prefix: 'Compare Versions: ', desc: 'Comparison of multiple MP3 files/mixes of this song to find the dominant master.' },
    { id: 'entendres', label: 'Multi-Level Entendres', prefix: 'Entendres Analysis: ', desc: 'We are conducting an in-depth linguistic review of all double, triple, quadruple, and multi-layered (5+) sensual double entendres, metaphors, and botanical/musical subtexts.' },
    { id: 'technical', label: 'Technical Details', prefix: 'Technical Details: ', desc: 'We are mapping key signature modal centers, tempo grids, chord progressions, and vocal quartet arrangements.' },
    { id: 'interview', label: 'Interview & Review', prefix: 'Interview & Review: ', desc: 'Senna Bakker is compiling her studio interview with the singers and drafting her honest track review.' },
    { id: 'analysis', label: 'Vocal/Sound Analysis', prefix: 'Analysis: ', desc: 'The DSP digital signal processing system is reading MP3 ID3 header metadata tags and reviewing live acoustic mix quality.' },
  ];

  const getTabStatus = (tabId: string, prefix: string) => {
    if (tabId === 'lyrics') return 'success';
    if (tabId === 'dropFile') return isMp3Matched ? 'success' : 'empty';

    const contentVal = tabId === 'story' ? song?.story :
                       tabId === 'compare' ? song?.compare :
                       tabId === 'entendres' ? song?.entendres :
                       tabId === 'technical' ? song?.technical :
                       tabId === 'interview' ? song?.interviewReview :
                       tabId === 'analysis' ? song?.analysis : null;

    if (contentVal) return 'success';

    if (prefix) {
      const matchedJob = jobs.find(j => j.name.startsWith(prefix));
      if (matchedJob) {
        if (matchedJob.status === 'failed') return 'failed';
        if (matchedJob.status === 'done' && !contentVal) return 'failed';
        return 'pending';
      }
    }

    return 'empty';
  };

  const handleRetryTab = (tab: any) => {
    const token = localStorage.getItem('noor-api-key') || '';
    const matchedJob = jobs.find(j => j.name.startsWith(tab.prefix));

    if (matchedJob) {
      retryJob(matchedJob.id, token);
    } else {
      if (tab.id === 'story') {
        addJob(
          `Story Behind Song: ${title}`,
          'normal',
          GENERATE_STORY_BEHIND_SONG_PROMPT(title, lyrics, song?.imageDescription),
          token,
          song?.settings || {},
          SYSTEM_INSTRUCTIONS_STORY_BEHIND_SONG
        );
      } else if (tab.id === 'compare') {
        const matchedMP3s = uploadedFiles.filter(f => checkIfMatched(f.name, title));
        if (matchedMP3s.length > 1) {
          const leadFile = matchedMP3s[matchedMP3s.length - 1]; // oldest is lead
          const compareFile = matchedMP3s[0]; // newest uploaded
          addJob(
            `Compare Versions: ${title}`,
            'high',
            GENERATE_COMPARE_PROMPT(title, lyrics, song?.style || '', leadFile, compareFile),
            token,
            song?.settings || {},
            SYSTEM_INSTRUCTIONS_COMPARE
          );
        }
      } else if (tab.id === 'entendres') {
        addJob(
          `Double Entendres: ${title}`,
          'high',
          GENERATE_ENTENDRES_PROMPT(title, lyrics),
          token,
          song?.settings || {},
          SYSTEM_INSTRUCTIONS_ENTENDRES
        );
      } else if (tab.id === 'technical') {
        addJob(
          `Technical Details: ${title}`,
          'high',
          GENERATE_TECHNICAL_PROMPT(title, lyrics, song?.style || '', song?.settings || {}),
          token,
          song?.settings || {},
          SYSTEM_INSTRUCTIONS_TECHNICAL
        );
      } else if (tab.id === 'interview') {
        addJob(
          `Interview & Review: ${title}`,
          'high',
          GENERATE_INTERVIEW_REVIEW_PROMPT(title, lyrics, song?.story || '', song?.imageDescription),
          token,
          song?.settings || {},
          SYSTEM_INSTRUCTIONS_INTERVIEW_REVIEW
        );
      } else if (tab.id === 'analysis') {
        const mp3File = uploadedFiles.find(f => checkIfMatched(f.name, title));
        const filename = mp3File?.name || 'song.mp3';
        const filesize = mp3File?.size || 3200000;
        addJob(
          `Analysis: ${title}`,
          'high',
          GENERATE_ANALYSIS_PROMPT(title, filename, filesize, song?.style || ''),
          token,
          song?.settings || {},
          SYSTEM_INSTRUCTIONS_ANALYSIS
        );
      }
    }
  };

  const renderTabContent = (tabId: string, content: string | undefined, jobNamePrefix: string, titleLabel: string, descriptionLabel: string, tabObj?: any) => {
    const status = getJobStatus(jobNamePrefix);
    if (status) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-lavender-surface/5 rounded-lg border border-lavender-border/20 m-4 h-[55vh]">
          <div className="w-12 h-12 border-4 border-lavender-accent border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-xl font-bold text-lavender-accent">Generating {titleLabel}</h3>
          <p className="text-sm text-lavender-text/70 mt-2 max-w-sm leading-relaxed">{descriptionLabel}</p>
          <div className="mt-4 text-xs bg-lavender-surface px-3 py-1.5 rounded text-lavender-accent font-mono uppercase tracking-wider animate-pulse border border-lavender-border/40">
            Queue Status: {status}
          </div>
        </div>
      );
    }

    const matchedJob = jobs.find(j => j.name.startsWith(jobNamePrefix));
    if (matchedJob && matchedJob.status === 'failed' && !content) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-lavender-surface/5 rounded-lg border border-red-500/30 m-4 h-[55vh]">
          <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20 shadow-inner mb-4 text-3xl">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-red-400">Generation Failed</h3>
          <p className="text-sm text-lavender-text/70 mt-2 max-w-sm leading-relaxed">
            The background job encountered an issue while generating "{titleLabel}".
          </p>
          {matchedJob.error && (
            <div className="mt-2 text-xs bg-red-500/5 px-4 py-2 rounded text-red-300 font-mono border border-red-500/10 max-w-lg overflow-auto max-h-32 mb-4">
              {matchedJob.error}
            </div>
          )}
          <button
            onClick={() => handleRetryTab(tabObj)}
            className="px-4 py-2 bg-lavender-accent hover:bg-lavender-accent/80 text-black font-extrabold rounded-lg flex items-center gap-2 transition-all cursor-pointer text-sm"
          >
            <RotateCcw size={14} />
            Retry Generation Step
          </button>
        </div>
      );
    }

    if (!content) {
      const isLockedTab = tabId !== 'story' && tabId !== 'compare';
      const isCompareTab = tabId === 'compare';
      const hasMultipleMP3s = uploadedFiles.filter(f => checkIfMatched(f.name, title)).length > 1;

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-lavender-surface/5 rounded-lg border border-lavender-border/20 m-4 h-[55vh]">
          <div className="p-6 bg-lavender-surface rounded-full border border-lavender-border/40 shadow-inner mb-4 text-3xl">
            {isLockedTab ? '🔒' : isCompareTab ? '🔬' : '📝'}
          </div>
          <h3 className="text-xl font-bold text-lavender-text/80">
            {isLockedTab ? 'Report Locked' : isCompareTab ? 'Versions Comparison' : 'Story Behind Song'}
          </h3>
          <p className="text-sm text-lavender-text/60 mt-2 max-w-sm leading-relaxed">
            {isCompareTab 
              ? (hasMultipleMP3s
                ? `Ready to generate! Multiple MP3 sound files detected for this song. Click below to start the alternative mix comparison analysis.`
                : `To compare song versions, drop/upload a second MP3 sound file for "${title || 'this song'}" into the workspace. The first file acts as the lead track, and subsequent files are compared against it.`
              )
              : isLockedTab 
                ? `To unlock advanced analyses, drop the correct MP3 sound file for "${title || 'this song'}" directly onto this dialog, or upload it in the 'Drop File' tab page.`
                : `The story behind "${title || 'this song'}" has not been downloaded or generated. Click below to start the storyteller generation.`
            }
          </p>
          {((!isLockedTab && !isCompareTab) || (isCompareTab && hasMultipleMP3s)) && (
            <button
              onClick={() => handleRetryTab(tabObj)}
              className="mt-6 px-4 py-2 bg-lavender-accent hover:bg-lavender-accent/80 text-black font-extrabold rounded-lg flex items-center gap-2 transition-all cursor-pointer text-sm"
            >
              <RotateCcw size={14} />
              {isCompareTab ? 'Compare Versions' : 'Generate Story'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 bg-lavender-bg/30 border border-lavender-border/40 rounded-lg flex flex-col overflow-hidden m-4 h-[70vh]">
        <MarkdownView content={content} filename={`${title}_${tabId}`} />
      </div>
    );
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Karaoke Mode"
      onConfirm={onClose}
      size="full"
    >
      <div 
        className="flex flex-col gap-4 w-full h-[85vh] overflow-hidden relative"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-lavender-bg/95 border-4 border-dashed border-lavender-accent flex flex-col items-center justify-center p-8 text-center backdrop-blur-md pointer-events-none">
            <div className="p-6 bg-lavender-surface rounded-full border border-lavender-border/40 shadow-xl mb-4 text-4xl animate-bounce">
              🎵
            </div>
            <h3 className="text-2xl font-bold text-lavender-accent">Drop MP3 Sound File Here</h3>
            <p className="text-sm text-lavender-text/70 mt-2 max-w-sm font-semibold">
              Verify if the dropped audio is the matched file for "{title || 'Untitled Song'}" to unlock advanced reviews!
            </p>
          </div>
        )}

        {/* Top actions toolbar */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-lavender-border flex-wrap gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-lavender-text/80 font-medium">
              Active Song: <span className="text-lavender-accent font-bold">{title || 'Untitled'}</span>
            </span>
            <span className="text-xs text-lavender-text/50 font-medium">
              Drag & drop this song's MP3 file anywhere here to trigger technical/meta report analyses.
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy} 
              className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors border border-lavender-border/30 cursor-pointer" 
              title="Copy Clean Lyrics"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
            <button 
              onClick={() => handleDownload('md')} 
              className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors border border-lavender-border/30 cursor-pointer" 
              title="Download Lyrics Markdown"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => handleDownload('pdf')} 
              className="px-3 py-1 hover:bg-lavender-surface rounded text-lavender-text font-bold text-sm transition-colors border border-lavender-border cursor-pointer"
              title="Export to PDF"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-lavender-border/40 gap-1 px-4 bg-lavender-surface/10 overflow-x-auto min-h-[44px]">
          {tabEntries.map((tab) => {
            const isAlwaysAvailable = tab.id === 'lyrics' || tab.id === 'story' || tab.id === 'dropFile';
            let isTabAvailable = isAlwaysAvailable || isMp3Matched;
            if (!isTabAvailable) {
              if (tab.id === 'entendres') isTabAvailable = !!song?.entendres;
              else if (tab.id === 'technical') isTabAvailable = !!song?.technical;
              else if (tab.id === 'interview') isTabAvailable = !!song?.interviewReview;
              else if (tab.id === 'analysis') isTabAvailable = !!song?.analysis;
              else if (tab.id === 'compare') isTabAvailable = !!song?.compare || uploadedFiles.filter(f => checkIfMatched(f.name, title)).length > 1;
            }

            const activeStyle = activeTab === tab.id
              ? 'border-lavender-accent text-lavender-accent bg-lavender-accent/5 font-extrabold'
              : 'border-transparent text-lavender-text/60 hover:text-lavender-text hover:bg-lavender-surface/10';

            const status = getTabStatus(tab.id, tab.prefix || '');
            let statusIcon = null;

            if (status === 'success') {
              statusIcon = <Check size={14} className="text-green-400 shrink-0" />;
            } else if (status === 'failed') {
              statusIcon = (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-red-500 font-bold text-xs" title="Generation Failed">✕</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetryTab(tab);
                    }}
                    className="p-0.5 hover:bg-lavender-accent/15 rounded text-amber-400 transition-all cursor-pointer flex items-center justify-center border border-lavender-border/20 hover:border-amber-400/40"
                    title="Retry Generation"
                  >
                    <RotateCcw size={10} className="shrink-0" />
                  </button>
                </div>
              );
            } else {
              // 'empty' or 'pending'
              const isPending = tab.prefix ? jobs.some(j => j.name.startsWith(tab.prefix) && (j.status === 'pending' || j.status === 'running')) : false;
              statusIcon = (
                <span 
                  className={`w-2 h-2 rounded-full shrink-0 ${isPending ? 'bg-amber-500 animate-pulse' : 'bg-orange-500'}`} 
                  title={isPending ? "Generating..." : "No file generated yet"}
                />
              );
            }

            return (
              <div
                key={tab.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab(tab.id as any)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(tab.id as any);
                  }
                }}
                className={`px-4 py-2 text-xs md:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer font-bold ${activeStyle}`}
              >
                {statusIcon}
                {tab.id === 'dropFile' && <span className="text-xs">📥</span>}
                {tab.label}
                {!isTabAvailable && <span className="text-[10px] opacity-60">🔒</span>}
              </div>
            );
          })}
        </div>

        {/* Tab Body Render */}
        {activeTab === 'lyrics' && (
          <div className="flex-1 flex gap-6 min-h-0 overflow-hidden px-4 pb-4">
            {/* Left Sidebar holding instructions */}
            <div className="w-1/4 min-w-[280px] max-w-[360px] bg-lavender-surface/10 border border-lavender-border/40 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
              <h3 className="text-lg font-bold text-lavender-accent border-b border-lavender-border/40 pb-2 flex items-center justify-between">
                <span>Performance Details</span>
                <span className="text-xs bg-lavender-surface px-2 py-0.5 rounded text-lavender-accent font-mono">
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
                      className={`text-left p-4 rounded-lg transition-all border outline-none cursor-pointer ${borderStyle}`}
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
            <div className="flex-1 bg-lavender-bg/30 border border-lavender-border/40 rounded-lg flex flex-col p-8 overflow-y-auto min-h-0 relative">
              {!isMp3Matched && !hasExtraTabs && (
                <div className="mb-4 bg-lavender-accent/10 border border-lavender-border rounded-xl p-4 text-xs text-lavender-accent/90 flex items-center justify-between gap-3 shadow-sm select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <span>Drag and drop this song's matched MP3 music file onto this dialog to unlock <strong>advanced reviews</strong> (Double Entendres, Technical details, Senna Bakker interview, and Vocal Quality analyzers).</span>
                  </div>
                </div>
              )}

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

                    let activeBoxStyle = 'bg-lavender-accent/5 border-lavender-accent/70 scale-[1.01] shadow-lg';
                    if (isSelected) {
                      if (isRap) activeBoxStyle = 'bg-yellow-500/5 border-yellow-500/60 scale-[1.01] shadow-[0_0_15px_rgba(234,179,8,0.15)]';
                      else if (isOpera) activeBoxStyle = 'bg-violet-500/5 border-violet-500/60 scale-[1.01] shadow-[0_0_15px_rgba(139,92,246,0.15)]';
                    }

                    const boxHoverStyle = isSelected
                      ? activeBoxStyle
                      : 'border-transparent hover:bg-lavender-surface/10 hover:border-lavender-border/20';

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
                          <span className={`${
                            isRap ? 'bg-yellow-500/20 text-yellow-300' : isOpera ? 'bg-violet-500/20 text-violet-300' : 'bg-lavender-surface/60 text-lavender-accent'
                          } text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                            {section.title}
                            {isRap && ' ⚡'}
                            {isOpera && ' 🎭'}
                          </span>
                          {section.singer && (
                            <span className="text-xs px-2 py-0.5 rounded-full italic bg-lavender-accent/10 text-lavender-text/85">
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
        )}

        {/* Upload File / Drop File tab content */}
        {activeTab === 'dropFile' && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden px-4 pb-4 text-lavender-text">
            {/* Left/Main drag area */}
            <div className="flex-1 flex flex-col gap-4">
              <div 
                className="flex-1 border-2 border-dashed border-lavender-border/40 hover:border-lavender-accent/60 bg-lavender-surface/5 rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all min-h-[300px] relative cursor-pointer group"
                onClick={() => document.getElementById('karaoke-file-input')?.click()}
              >
                <input 
                  id="karaoke-file-input"
                  type="file" 
                  accept=".mp3" 
                  onChange={handleFileInputChange} 
                  className="hidden" 
                />
                <div className="p-6 bg-lavender-surface group-hover:bg-lavender-surface/80 rounded-full border border-lavender-border/40 group-hover:border-lavender-accent/40 shadow-xl mb-4 text-lavender-accent animate-pulse transition-all">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl font-bold text-lavender-accent">Drag & Drop Song MP3 Audio File</h3>
                <p className="text-sm text-lavender-text/70 mt-2 max-w-sm font-medium">
                  Or click anywhere in this dashed box to browse files on your computer.
                </p>
                <div className="mt-4 text-[10px] bg-lavender-accent/10 border border-lavender-accent/30 text-lavender-accent font-black px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest leading-none">
                  accepts only *.mp3
                </div>
              </div>
            </div>

            {/* Right panel listing uploaded/dropped files */}
            <div className="w-full md:w-1/3 min-w-[320px] bg-lavender-surface/10 border border-lavender-border/40 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-lavender-border/40 pb-2">
                <h3 className="text-xs font-black text-lavender-accent flex items-center gap-1.5 uppercase tracking-wide">
                  <FileAudio size={14} />
                  <span>Uploaded Files Log</span>
                </h3>
                {uploadedFiles.length > 0 && (
                  <button 
                    onClick={() => setUploadedFiles([])}
                    className="text-[9px] bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Clear Log
                  </button>
                )}
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-lavender-text/40 italic text-xs border border-dashed border-lavender-border/10 rounded-lg min-h-[220px]">
                  <div className="text-xl mb-2">📁</div>
                  No files uploaded yet. Drag or pick an MP3 file to verify it for Karaoke analytics.
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                  {uploadedFiles.map((f, idx) => {
                    const isForCurrentSong = checkIfMatched(f.name, title);
                    const copiedFileId = `cp-${idx}`;
                    return (
                      <div 
                        key={f.name + '-' + idx} 
                        className={`p-3.5 border rounded-xl flex flex-col gap-2 transition-all ${
                          isForCurrentSong
                            ? 'bg-green-500/5 border-green-500/30'
                            : 'bg-lavender-surface/30 border-lavender-border/25 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-black text-white truncate block" title={f.name}>
                              {f.name}
                            </span>
                            <span className="text-[10px] text-lavender-text/50 font-bold block">
                              Size: {formatBytes(f.size || 0)} • Logged: {f.date}
                            </span>
                          </div>
                          
                          <div className="flex gap-1.5 shrink-0">
                            {/* Copy file button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(f.name);
                                const el = document.getElementById(copiedFileId);
                                if (el) {
                                  el.innerText = 'Copied!';
                                  setTimeout(() => { if (el) el.innerText = 'Copy'; }, 1500);
                                }
                              }}
                              className="p-1.5 bg-lavender-surface hover:bg-lavender-accent hover:text-black rounded border border-lavender-border/30 hover:border-transparent text-lavender-text transition-all cursor-pointer relative group"
                              title="Copy File Name"
                            >
                              <Copy size={11} />
                              <span id={copiedFileId} className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block bg-black text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-md z-10">
                                Copy
                              </span>
                            </button>

                            {/* Delete File button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFiles(prev => prev.filter((_, itemIdx) => itemIdx !== idx));
                              }}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white rounded transition-all cursor-pointer relative group"
                              title="Remove Log Entry"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Status bar */}
                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-lavender-border/15">
                          {isForCurrentSong ? (
                            <span className="flex items-center gap-1 text-[9.5px] font-black text-green-400 uppercase tracking-wider">
                              <ShieldCheck size={11} />
                              MATCHED with "{title}"
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9.5px] font-black text-red-400 uppercase tracking-wider">
                              <ShieldAlert size={11} />
                              MISMATCH: Not for active song
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'story' && renderTabContent(
          'story', 
          song?.story, 
          'Story Behind Song: ', 
          'Story Behind Song', 
          tabEntries.find(t => t.id === 'story')?.desc || '',
          tabEntries.find(t => t.id === 'story')
        )}

        {activeTab === 'entendres' && renderTabContent(
          'entendres', 
          song?.entendres, 
          'Double Entendres: ', 
          'Double Entendres Linguistic Review', 
          tabEntries.find(t => t.id === 'entendres')?.desc || '',
          tabEntries.find(t => t.id === 'entendres')
        )}

        {activeTab === 'technical' && renderTabContent(
          'technical', 
          song?.technical, 
          'Technical Details: ', 
          'Technical Musicology Mapping', 
          tabEntries.find(t => t.id === 'technical')?.desc || '',
          tabEntries.find(t => t.id === 'technical')
        )}

        {activeTab === 'interview' && renderTabContent(
          'interview', 
          song?.interviewReview, 
          'Interview & Review: ', 
          'Senna Bakker Behind-The-Scenes Interview & Review', 
          tabEntries.find(t => t.id === 'interview')?.desc || '',
          tabEntries.find(t => t.id === 'interview')
        )}

        {activeTab === 'analysis' && renderTabContent(
          'analysis', 
          song?.analysis, 
          'Analysis: ', 
          'Acoustic vocal/sound analysis report', 
          tabEntries.find(t => t.id === 'analysis')?.desc || '',
          tabEntries.find(t => t.id === 'analysis')
        )}

        {activeTab === 'compare' && renderTabContent(
          'compare', 
          song?.compare, 
          'Compare Versions: ', 
          'Comparative Sound Analysis', 
          tabEntries.find(t => t.id === 'compare')?.desc || '',
          tabEntries.find(t => t.id === 'compare')
        )}
      </div>
    </Dialog>
  );
};
