import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from './Dialog';
import { Shield, Music, Check, Trash2, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';

export interface IntroOutroConfig {
  enabled: boolean;
  duration: number; // 5 to 60 seconds
  instruments: string[];
}

interface IntroOutroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g. "Configure Intro" or "Configure Outro"
  onConfirm: (config: IntroOutroConfig) => void;
  initialConfig: IntroOutroConfig;
}

const INSTRUMENT_CATEGORIES = [
  {
    category: "Strings & Harps",
    instruments: ["Crwth", "Violin", "Cello", "Acoustic Guitar", "Harp", "Lute", "Viola", "Mandolin", "Double Bass", "Guitarrón", "Balalaika", "Bouzouki", "Banjo", "Sitar", "Shamisen", "Guzheng"]
  },
  {
    category: "Brass",
    instruments: ["Trumpet", "Trombone", "French Horn", "Tuba", "Bugle", "Cornet", "Euphonium", "Mellophone", "Sousaphone", "Sackbut", "Shofar", "Didgeridoo"]
  },
  {
    category: "Bagpipes & Reeds",
    instruments: ["Bagpipes", "Uilleann Pipes", "Accordion", "Harmonica", "Clarinet", "Great Highland Bagpipe", "Northumbrian Smallpipes", "Sheng", "Kena", "Oboe", "English Horn", "Bassoon"]
  },
  {
    category: "Drums & Percussion",
    instruments: ["Drums", "Snare Drum", "Bass Drum", "Timpani", "Hand Drums", "Tambourine", "Taiko", "Cajón", "Congas", "Bongos", "Djembe", "Tabla", "Darabuka", "Frame Drum", "Bodhrán", "Shakers"]
  },
  {
    category: "Woodwinds & Keys",
    instruments: ["Flute", "Recorder", "Piano", "Harpsichord", "Synthesizer", "Organ", "Fife", "Ocarina", "Pan Flute", "Xiao", "Shakuhachi", "Ney", "Celesta", "Clavinet", "Mellotron"]
  },
  {
    category: "Ethnic & Folk Winds",
    instruments: ["Kaval", "Surna", "Bawu", "Native American Flute", "Duduk", "Tin Whistle", "Fujara", "Mijwiz", "Siku"]
  },
  {
    category: "Modern & Cinematic FX",
    instruments: ["Ambient Drone Synth", "Sub-Bass Drop", "Cinematic Strings Rise", "Analog White Noise", "808 Sub Boom", "Glitch Plucks", "Granular Textures", "Tape Lo-fi Crackle"]
  },
  {
    category: "Orchestral Mallets",
    instruments: ["Marimba", "Xylophone", "Vibraphone", "Glockenspiel", "Tubular Bells", "Crotales", "Steel Drums", "Kalimba", "Music Box"]
  }
];

export const IntroOutroDialog: React.FC<IntroOutroDialogProps> = ({
  isOpen,
  onClose,
  title,
  onConfirm,
  initialConfig
}) => {
  const [enabled, setEnabled] = useState(false);
  const [duration, setDuration] = useState(15);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(INSTRUMENT_CATEGORIES[0].category);

  // Sync state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEnabled(initialConfig?.enabled ?? false);
      setDuration(initialConfig?.duration ?? 15);
      setSelectedInstruments(initialConfig?.instruments ? [...initialConfig.instruments] : []);
      setSearchQuery('');
      setActiveCategory(INSTRUMENT_CATEGORIES[0].category);
    }
  }, [isOpen, initialConfig]);

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    );
  };

  const handleClearAll = () => {
    setSelectedInstruments([]);
  };

  const handleToggleEnable = () => {
    setEnabled(prev => !prev);
  };

  // Filtered list of instruments inside active category OR global search
  const filteredInstruments = useMemo(() => {
    if (searchQuery.trim() === '') {
      return INSTRUMENT_CATEGORIES.find(c => c.category === activeCategory)?.instruments || [];
    }
    const query = searchQuery.toLowerCase();
    const results: { name: string; categoryName: string }[] = [];
    INSTRUMENT_CATEGORIES.forEach(cat => {
      cat.instruments.forEach(inst => {
        if (inst.toLowerCase().includes(query)) {
          results.push({ name: inst, categoryName: cat.category });
        }
      });
    });
    return results;
  }, [searchQuery, activeCategory]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onConfirm({
          enabled,
          duration,
          instruments: selectedInstruments
        });
        onClose();
      }}
      onClear={() => {
        setEnabled(false);
        setDuration(15);
        setSelectedInstruments([]);
      }}
      clearText="Disable segment & clear instruments"
      title={title}
      size="full"
      isNested={true}
    >
      <div className="flex flex-col h-full font-sans text-lavender-text">
        {/* Toggle bar for enabling / disabling the section */}
        <div className="flex items-center justify-between p-4 mb-4 bg-lavender-surface/20 border border-lavender-border/40 rounded-xl shrink-0">
          <div className="flex items-center gap-3">
            {enabled ? (
              <ToggleRight size={38} className="text-green-400 cursor-pointer" onClick={handleToggleEnable} />
            ) : (
              <ToggleLeft size={38} className="text-lavender-text/30 cursor-pointer" onClick={handleToggleEnable} />
            )}
            <div>
              <span className="text-xs font-bold uppercase text-lavender-accent tracking-wider block">
                {title.includes('Intro') ? 'Intro Segment Status' : 'Outro Segment Status'}
              </span>
              <p className="text-[11px] text-lavender-text/50 font-medium">
                {enabled ? 'Active (No vocals, purely instrumental play duration)' : 'Inactive (No separate instrumental piece added)'}
              </p>
            </div>
          </div>

          {enabled && selectedInstruments.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/10 border border-red-900/30 hover:border-red-900/55 rounded-lg transition-all"
            >
              <Trash2 size={13} />
              Reset Instruments ({selectedInstruments.length})
            </button>
          )}
        </div>

        {/* If Disabled, show a nice premium cover with custom guidelines */}
        {!enabled ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-lavender-border/20 bg-lavender-surface/5 rounded-xl p-8 mb-2">
            <Music size={48} className="text-lavender-text/20 mb-4 animate-pulse-subtle" />
            <h3 className="text-sm font-black text-lavender-accent mb-2">
              {title.includes('Intro') ? 'Add Instrumental Intro' : 'Add Instrumental Outro'}
            </h3>
            <p className="text-xs text-lavender-text/50 text-center max-w-md font-medium leading-relaxed mb-6">
              When disabled, the song will begin/end standard without any separate instrumental passages. Enable to define the duration and custom instruments for spectacular, pure acoustics.
            </p>
            <button
              type="button"
              onClick={handleToggleEnable}
              className="px-5 py-2.5 bg-lavender-accent text-black font-black text-xs rounded-lg transition-all shadow-md hover:scale-[1.02]"
            >
              Enable Segment &rarr;
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            {/* Suno Optimizations & Structural Presets */}
            <div className="bg-lavender-surface/15 border border-lavender-border/20 rounded-xl p-5 mb-5 shrink-0 flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 bg-lavender-accent/5 border border-lavender-accent/20 rounded-lg text-[11px] leading-relaxed text-lavender-text/80">
                <Shield size={16} className="text-lavender-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-lavender-accent block uppercase tracking-wider mb-0.5">Suno AI Structural Constraint</span>
                  Suno AI operates on neural-transformer patterns; it does not understand numerical timestamps or clock timing in seconds. Placing timing instructions like <code className="bg-black/40 px-1 py-0.5 rounded text-lavender-accent">duration: 60s</code> inside bracket tags can cause vocal hallucinations (such as humming, whispering, or robotic male vocals) because Suno interprets the digits literally as lyrics! We have mapped your choice to pure acoustic layout tags to keep sections vocal-free.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-lavender-accent flex items-center gap-1.5">
                  <Sliders size={12} />
                  Structural Preset Setting
                </span>
                <span className="text-[10px] font-extrabold uppercase text-lavender-text/45">
                  Native Suno Optimization
                </span>
              </div>

              {/* Grid of Structural Levels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    value: 10,
                    label: "Short Prelude",
                    meta: "Minimalistic",
                    description: "Quick, sweet instrumental entry phrase. Safeguards completely against vocal bleeding."
                  },
                  {
                    value: 20,
                    label: "Standard Build",
                    meta: "Recommended",
                    description: "Introduces instrument solos allowing tempo and musical key to lock cleanly before verses."
                  },
                  {
                    value: 40,
                    label: "Long Progressive",
                    meta: "Atmospheric",
                    description: "Enforces atmospheric developmental phases to let instruments rise organically."
                  },
                  {
                    value: 60,
                    label: "Extended Epic",
                    meta: "Intense",
                    description: "Full orchestrations with progressive percussion build-up and a dramatic drop."
                  }
                ].map((preset) => {
                  const isSelected = duration === preset.value || 
                    (preset.value === 20 && ![10, 20, 40, 60].includes(duration) && duration < 30) ||
                    (preset.value === 40 && ![10, 20, 40, 60].includes(duration) && duration >= 30 && duration < 50) ||
                    (preset.value === 60 && ![10, 20, 40, 60].includes(duration) && duration >= 50);

                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setDuration(preset.value)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-full hover:scale-[1.01] ${
                        isSelected
                          ? 'bg-lavender-accent/10 border-lavender-accent text-lavender-accent'
                          : 'bg-lavender-surface/30 border-lavender-border/20 text-lavender-text/70 hover:border-lavender-border/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-black truncate">{preset.label}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isSelected ? 'bg-lavender-accent/20 text-lavender-accent' : 'bg-lavender-surface/50 text-lavender-text/40'
                          }`}>
                            {preset.meta}
                          </span>
                        </div>
                        <p className="text-[10px] text-lavender-text/50 font-medium leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-lavender-border/10 flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-tight text-lavender-text/40">Relative Scale: ~{preset.value}s</span>
                        {isSelected && <Check size={11} className="text-lavender-accent" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Grid for Categories & Selection */}
            <div className="flex flex-1 flex-col md:flex-row gap-5 min-h-0">
              {/* Category sidebar selection */}
              <div className="w-full md:w-1/4 flex flex-col gap-2 shrink-0 max-h-[160px] md:max-h-none overflow-y-auto pr-1">
                <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-2 mb-1">
                  Instrument Types
                </span>
                {INSTRUMENT_CATEGORIES.map(group => {
                  const isActive = group.category === activeCategory;
                  const count = group.instruments.filter(i => selectedInstruments.includes(i)).length;

                  return (
                    <button
                      key={group.category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(group.category);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all relative flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-lavender-accent/10 border-lavender-accent text-lavender-accent'
                          : 'bg-lavender-surface/40 hover:border-lavender-border/80 border-lavender-border/25 text-lavender-text/80'
                      }`}
                    >
                      <span className="truncate">{group.category}</span>
                      {count > 0 && (
                        <span className="text-[10px] bg-lavender-accent text-black font-black px-1.5 py-0.5 rounded-full inline-block">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instruments Selection list */}
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                {/* Search */}
                <div className="relative shrink-0">
                  <input
                    type="text"
                    placeholder="Search specific instrument or plays..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 bg-lavender-surface/30 border border-lavender-border/30 rounded-lg text-xs font-bold text-lavender-text placeholder-lavender-text/40 focus:outline-none focus:ring-1 focus:ring-lavender-accent"
                  />
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredInstruments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-lavender-border/10 rounded-xl">
                      <p className="text-xs text-lavender-text/40 italic">No instruments matched your search</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {searchQuery.trim() === '' ? (
                        (filteredInstruments as string[]).map(inst => {
                          const isSel = selectedInstruments.includes(inst);
                          return (
                            <button
                              key={inst}
                              type="button"
                              onClick={() => toggleInstrument(inst)}
                              className={`p-3 text-left rounded-lg text-xs font-extrabold border transition-all flex items-center justify-between cursor-pointer ${
                                isSel
                                  ? 'bg-lavender-accent/20 border-lavender-accent text-lavender-accent'
                                  : 'bg-lavender-surface/20 border-lavender-border/30 hover:border-lavender-border'
                              }`}
                            >
                              <span className="truncate">{inst}</span>
                              {isSel && <Check size={12} className="text-lavender-accent shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        (filteredInstruments as { name: string; categoryName: string }[]).map(({ name, categoryName }) => {
                          const isSel = selectedInstruments.includes(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => toggleInstrument(name)}
                              className={`p-3 text-left rounded-lg text-xs font-extrabold border transition-all flex items-center justify-between cursor-pointer ${
                                isSel
                                  ? 'bg-lavender-accent/20 border-lavender-accent text-lavender-accent'
                                  : 'bg-lavender-surface/20 border-lavender-border/30 hover:border-lavender-border'
                              }`}
                            >
                              <div className="flex flex-col truncate">
                                <span className="truncate">{name}</span>
                                <span className="text-[8px] text-lavender-text/30 uppercase mt-0.5">{categoryName}</span>
                              </div>
                              {isSel && <Check size={12} className="text-lavender-accent shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
