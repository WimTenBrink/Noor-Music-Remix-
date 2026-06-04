import React, { useState, useEffect } from 'react';
import { Input, TextArea } from './Inputs';
import { Song, Job } from '../../types';
import { cn } from '../../lib/utils';
import { Sparkles, Loader2, Clock, Cpu } from 'lucide-react';

interface MainPanelProps {
  song: Song;
  onChange: (song: Song) => void;
  onDropFile: (file: File) => void;
  jobs?: Job[];
}

export const MainPanel: React.FC<MainPanelProps> = ({ song, onChange, onDropFile, jobs }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const runningJob = jobs?.find(j => j.status === 'running');

  useEffect(() => {
    if (!runningJob || !runningJob.startedAt) {
      setElapsedTime(0);
      return;
    }
    // Set initial elapsed
    setElapsedTime(Math.round((Date.now() - runningJob.startedAt) / 1000));
    
    const interval = setInterval(() => {
      if (runningJob.startedAt) {
        setElapsedTime(Math.round((Date.now() - runningJob.startedAt) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [runningJob]);

  const getThinkingStep = (seconds: number) => {
    if (seconds < 5) return "Initializing request pipeline and model context...";
    if (seconds < 12) return "Loading system guidelines, active singer profiles, and content filters...";
    if (seconds < 25) return "Drafting poetic lyrics, adjusting verses, and refining emotional cues...";
    if (seconds < 40) return "Integrating custom music genres, grooves, and instruments...";
    if (seconds < 60) return "Translating and phonetic-aligning dialect/click language structures...";
    return "Packaging raw JSON response and verifying complete payload structure...";
  };

  const handleChange = (field: keyof Song, value: string) => {
    onChange({ ...song, [field]: value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onDropFile(file);
    }
  };

  return (
    <div 
      className={cn(
        "flex-1 overflow-auto p-8 flex flex-col gap-8 transition-colors relative",
        isDragging ? "bg-lavender-accent/10" : "bg-lavender-bg/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center border-4 border-dashed border-lavender-accent pointer-events-none">
          <div className="bg-lavender-bg p-8 rounded-lg shadow-2xl text-2xl font-bold text-lavender-accent">
            Drop Song JSON Here
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        
        {/* AI Activity Feedback Banner */}
        {runningJob && (
          <div className="bg-lavender-accent/5 border-2 border-lavender-accent/15 rounded-2xl p-6 mb-2 animate-pulse transition-all flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-lavender-accent" size={24} />
                <div>
                  <h3 className="text-base font-extrabold text-lavender-accent flex items-center gap-2">
                    AI Creative Pipeline Active
                    <Sparkles size={16} className="text-yellow-400" />
                  </h3>
                  <p className="text-sm font-bold text-lavender-text mt-0.5">
                    Running Task: <span className="font-mono text-xs text-lavender-accent bg-lavender-bg py-0.5 px-1.5 rounded border border-lavender-border/40">{runningJob.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm bg-lavender-bg py-1 px-3 rounded-lg border border-lavender-border/40 text-lavender-accent">
                <Clock size={16} />
                <span>{elapsedTime}s</span>
              </div>
            </div>

            {/* Progressive Status Details */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 items-center bg-lavender-bg/40 p-4 rounded-xl border border-lavender-border/20">
              <div>
                <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest block">Pipeline Progress Status</span>
                <span className="text-sm font-semibold text-lavender-text mt-1 block">
                  {getThinkingStep(elapsedTime)}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-t md:border-t-0 md:border-l border-lavender-border/30 pt-3 md:pt-0">
                <span className="text-[9px] font-bold text-lavender-text/40 uppercase tracking-widest block text-center">Concurrency Threads</span>
                <div className="flex items-center gap-1 text-sm font-mono font-bold text-lavender-accent mt-1">
                  <Cpu size={14} />
                  <span>Active</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-lavender-text/50 leading-relaxed max-w-xxl">
              💡 <strong className="text-lavender-text/70 font-semibold">Note:</strong> Lyrical composition combined with phonetic alignment and structure verification is a highly complex task. If a timeout occurs, our robust scheduler will automatically re-queue the task with structural adjustments.
            </div>
          </div>
        )}
        <Input 
          label="Song Title" 
          placeholder="Enter song title..." 
          value={song.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        
        <TextArea 
          label="Style (SUNO Format)" 
          placeholder="e.g. Synthpop, Dream Pop, Sapphic, Electric Guitar, Crwth..." 
          rows={3}
          value={song.style}
          onChange={(e) => handleChange('style', e.target.value)}
        />

        <TextArea 
          label="Lyrics & Instructions" 
          placeholder="[Verse 1]\n[Miranda]\nIn the quiet of the morning..." 
          rows={15}
          value={song.lyrics}
          onChange={(e) => handleChange('lyrics', e.target.value)}
        />
      </div>
    </div>
  );
};

