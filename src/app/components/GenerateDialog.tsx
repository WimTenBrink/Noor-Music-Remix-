import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { TextArea } from './Inputs';
import { LANGUAGE_GROUPS, findGroupByDialectId, findDialectById } from '../utils/languages';
import { TooltipDropdown } from './TooltipDropdown';
import { INNUENDO_STEPS, getInnuendoStep } from '../utils/innuendoLevels';
import { LanguageSelectionDialog } from './LanguageSelectionDialog';
import { EmotionSelectionDialog } from './EmotionSelectionDialog';
import { InstrumentsSelectionDialog } from './InstrumentsSelectionDialog';
import { StylesAndGroovesDialog } from './StylesAndGroovesDialog';
import { SfxSelectionDialog } from './SfxSelectionDialog';
import { IntroOutroDialog, IntroOutroConfig } from './IntroOutroDialog';
import { getEpicStep } from '../utils/epicLevels';
import { RhymeSelectionDialog } from './RhymeSelectionDialog';
import { findRhymeTypeById } from '../utils/rhymes';
import { 
  DIALECT_TOOLTIPS, 
  LANGUAGE_GROUP_TOOLTIPS, 
  RATING_TOOLTIPS, 
  GROOVE_TOOLTIPS 
} from '../utils/tooltipsData';
import { SONG_EMOTIONS } from '../utils/emotions';

const CORE_GROOVES = [
  "Euro-Bounce",
  "Synth-Pop",
  "4-on-the-Floor",
  "Techno",
  "Industrial",
  "Acid-Jazz",
  "Sophisti-Pop",
  "Trap",
  "Boom-Bap",
  "Hip-Hop",
  "6/8 Tarantella",
  "Folk Jig",
  "Symphonic",
  "Operatic Strings",
  "Hyperpop",
  "Glitch-Core",
  "Gothic Rock",
  "Darkwave",
  "Acoustic Folk",
  "Organic",
  "Melodramatic",
  "High-Stakes",
  "Laid-back",
  "Conversational",
  "Rapid-fire",
  "Staccato",
  "Ethereal",
  "Chanting",
  "Ancient Sistrum Rattle",
  "Spoken-Word",
  "Deadpan Outro",
  "Polyphonic Ringtone Chime",
  "Neo-Soul Shimmer",
  "Chillwave Sunset",
  "Shoegaze Distortion",
  "Trip-Hop Downbeat",
  "Liquid Drum & Bass Roll",
  "Krautrock Motorik Beat",
  "Electro-Swing Brass",
  "Psychedelic Rock Swirl",
  "Afrobeat Polyrhythms",
  "Reggae Roots Dubwise",
  "Future Bass Pluck",
  "Vaporwave Chill",
  "Cinematic Orchestral Brass",
  "Baroque Chamber Harpsichord",
  "Spaghetti Western Whistle",
  "Celtic Folk Harp",
  "Glitch Hop Glitchiness",
  "Dark Ambient Drone",
  "Yacht Rock Glide",
  "Post-Punk Driving Bass",
  "Lo-Fi Lullaby Vinyl Crackle",
  "Flamenco Rasgueado Flourish",
  "Bluegrass Banjo Roll",
  "Space Disco Arpeggiator",
  "Surf Rock Spring Reverb",
  "IDM Complex Glitches",
  "Tribal Trance Hand Drums",
  "8-Bit Retro Chiptune",
  "Heavy Metal Chugging Riffs",
  "Dream-Pop Reverb Guitar",
  "Acid House TB-303 Acidline",
  "Funk Wah-Wah Scratch Guitar",
  "Indie Folk Mandolin Roll",
  "Samba Batucada Percussion",
  "Dub Siren Echo Feedback",
  "Gregorian Polyphonic Chant",
  "Chao Gong Clash",
  "Taiko Drum Ensemble",
  "Thunderous Orchestral Bass Drum",
  "Explosive Snare Rimshot",
  "Chinese Lion Dance Drum",
  "Ceremonial Wind Gong Shimmer",
  "Heavy Industrial Piston Slams",
  "Massive Timpani Roll & Strike",
  "Samba Surdo Thunder Beats",
  "Militaristic Field Snare",
  "Anvil Hammer Strikes",
  "Symphonic Gong Swell",
  "Aggressive Metal Double-Lick",
  "Brazilian Batucada Surdo Accent",
  "Heavy Marching Quad Drums",
  "Tribal War Drums Polyrhythm"
];

interface GenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    instructions: string, 
    musicInspiration: string, 
    selectedDialectId: string, 
    rating: string, 
    coreGrooves: string[], 
    emotion: string,
    instruments: string[],
    styles: string[],
    childVoice: boolean,
    soundEffects: string[],
    introConfig?: IntroOutroConfig,
    outroConfig?: IntroOutroConfig,
    selfReflect?: boolean,
    innuendoLevel?: number,
    reverseLyrics?: boolean,
    epicLevel?: number,
    rhymeId?: string
  ) => void;
  initialValue?: string;
  selectedInstruments: string[];
  selectedStyles: string[];
  currentDialectId: string;
  currentRating: string;
  selfReflect: boolean;
  currentInnuendoLevel?: number;
  reverseLyrics?: boolean;
  currentEpicLevel?: number;
  currentRhymeId?: string;
}

export const GenerateDialog: React.FC<GenerateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialValue = '',
  selectedInstruments,
  selectedStyles,
  currentDialectId,
  currentRating,
  selfReflect,
  currentInnuendoLevel = 0,
  reverseLyrics = false,
  currentEpicLevel = 0,
  currentRhymeId = 'perfect'
}) => {
  const [instructions, setInstructions] = useState(() => localStorage.getItem('noor-instructions') || initialValue);
  const [musicInspiration, setMusicInspiration] = useState(() => localStorage.getItem('noor-music-inspiration') || '');
  const [dialogDialectId, setDialogDialectId] = useState(() => localStorage.getItem('noor-dialect-id') || currentDialectId);
  const [dialogRating, setDialogRating] = useState(() => localStorage.getItem('noor-rating') || currentRating);
  const [selectedGrooves, setSelectedGrooves] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-grooves');
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogInnuendoLevel, setDialogInnuendoLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-innuendo-level');
    return saved ? parseInt(saved, 10) : currentInnuendoLevel || 0;
  });
  const [dialogEmotionName, setDialogEmotionName] = useState(() => localStorage.getItem('noor-emotion-name') || 'Joyful');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [tempSelectedInstruments, setTempSelectedInstruments] = useState<string[]>([]);
  const [tempSelectedStyles, setTempSelectedStyles] = useState<string[]>([]);
  const [showInstrumentsSelector, setShowInstrumentsSelector] = useState(false);
  const [showStylesAndGroovesSelector, setShowStylesAndGroovesSelector] = useState(false);
  const [dialogChildVoice, setDialogChildVoice] = useState(() => localStorage.getItem('noor-child-voice') === 'true');
  const [dialogSelfReflect, setDialogSelfReflect] = useState(() => {
    const saved = localStorage.getItem('noor-self-reflect');
    return saved !== null ? saved === 'true' : true;
  });
  const [dialogReverseLyrics, setDialogReverseLyrics] = useState(() => {
    const saved = localStorage.getItem('noor-reverse-lyrics');
    return saved !== null ? saved === 'true' : false;
  });
  const [dialogEpicLevel, setDialogEpicLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-epic-level');
    return saved ? parseInt(saved, 10) : currentEpicLevel || 0;
  });
  const [dialogRhymeId, setDialogRhymeId] = useState<string>(() => {
    return localStorage.getItem('noor-rhyme-id') || currentRhymeId;
  });
  const [showRhymeSelector, setShowRhymeSelector] = useState(false);
  const [selectedSfx, setSelectedSfx] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-sound-effects');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSfxSelector, setShowSfxSelector] = useState(false);

  const [dialogIntroConfig, setDialogIntroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-intro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });
  const [dialogOutroConfig, setDialogOutroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-outro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });
  const [showIntroSelector, setShowIntroSelector] = useState(false);
  const [showOutroSelector, setShowOutroSelector] = useState(false);

  useEffect(() => {
    localStorage.setItem('noor-instructions', instructions);
  }, [instructions]);

  useEffect(() => {
    localStorage.setItem('noor-music-inspiration', musicInspiration);
  }, [musicInspiration]);

  useEffect(() => {
    localStorage.setItem('noor-selected-grooves', JSON.stringify(selectedGrooves));
  }, [selectedGrooves]);

  useEffect(() => {
    localStorage.setItem('noor-emotion-name', dialogEmotionName);
  }, [dialogEmotionName]);

  useEffect(() => {
    localStorage.setItem('noor-dialect-id', dialogDialectId);
  }, [dialogDialectId]);

  useEffect(() => {
    localStorage.setItem('noor-rating', dialogRating);
  }, [dialogRating]);

  useEffect(() => {
    localStorage.setItem('noor-child-voice', dialogChildVoice ? 'true' : 'false');
  }, [dialogChildVoice]);

  useEffect(() => {
    localStorage.setItem('noor-self-reflect', dialogSelfReflect ? 'true' : 'false');
  }, [dialogSelfReflect]);

  useEffect(() => {
    localStorage.setItem('noor-reverse-lyrics', dialogReverseLyrics ? 'true' : 'false');
  }, [dialogReverseLyrics]);

  useEffect(() => {
    localStorage.setItem('noor-selected-sound-effects', JSON.stringify(selectedSfx));
  }, [selectedSfx]);

  useEffect(() => {
    localStorage.setItem('noor-intro-config', JSON.stringify(dialogIntroConfig));
  }, [dialogIntroConfig]);

  useEffect(() => {
    localStorage.setItem('noor-outro-config', JSON.stringify(dialogOutroConfig));
  }, [dialogOutroConfig]);

  useEffect(() => {
    localStorage.setItem('noor-innuendo-level', dialogInnuendoLevel.toString());
  }, [dialogInnuendoLevel]);

  useEffect(() => {
    localStorage.setItem('noor-epic-level', dialogEpicLevel.toString());
  }, [dialogEpicLevel]);

  useEffect(() => {
    localStorage.setItem('noor-rhyme-id', dialogRhymeId);
  }, [dialogRhymeId]);

  // Sync state values when modal is opened with new props
  useEffect(() => {
    if (isOpen) {
      const savedDialect = localStorage.getItem('noor-dialect-id');
      setDialogDialectId(savedDialect || currentDialectId || 'en-GB');

      const savedRating = localStorage.getItem('noor-rating');
      setDialogRating(savedRating || currentRating || 'PG');

      const savedGrooves = localStorage.getItem('noor-selected-grooves');
      setSelectedGrooves(savedGrooves ? JSON.parse(savedGrooves) : []);

      const savedEmotion = localStorage.getItem('noor-emotion-name');
      setDialogEmotionName(savedEmotion || 'Joyful');

      const savedInspiration = localStorage.getItem('noor-music-inspiration');
      setMusicInspiration(savedInspiration || '');

      const savedInstructions = localStorage.getItem('noor-instructions');
      setInstructions(savedInstructions || initialValue || '');

      const savedChildVoice = localStorage.getItem('noor-child-voice');
      setDialogChildVoice(savedChildVoice === 'true');

      const savedSelfReflect = localStorage.getItem('noor-self-reflect');
      setDialogSelfReflect(savedSelfReflect !== null ? savedSelfReflect === 'true' : selfReflect);

      const savedSfx = localStorage.getItem('noor-selected-sound-effects');
      setSelectedSfx(savedSfx ? JSON.parse(savedSfx) : []);

      const savedIntro = localStorage.getItem('noor-intro-config');
      setDialogIntroConfig(savedIntro ? JSON.parse(savedIntro) : { enabled: false, duration: 15, instruments: [] });

      const savedOutro = localStorage.getItem('noor-outro-config');
      setDialogOutroConfig(savedOutro ? JSON.parse(savedOutro) : { enabled: false, duration: 15, instruments: [] });

      const savedInnuendo = localStorage.getItem('noor-innuendo-level');
      setDialogInnuendoLevel(savedInnuendo ? parseInt(savedInnuendo, 10) : currentInnuendoLevel || 0);

      const savedEpic = localStorage.getItem('noor-epic-level');
      setDialogEpicLevel(savedEpic ? parseInt(savedEpic, 10) : currentEpicLevel || 0);

      const savedRhyme = localStorage.getItem('noor-rhyme-id');
      setDialogRhymeId(savedRhyme || currentRhymeId || 'perfect');

      setTempSelectedInstruments([...selectedInstruments]);
      setTempSelectedStyles([...selectedStyles]);
    }
  }, [isOpen, currentDialectId, currentRating, selectedInstruments, selectedStyles, initialValue, selfReflect, currentInnuendoLevel, currentEpicLevel, currentRhymeId]);

  const ratingOptions = [
    { id: 'G', name: 'G (General Audience)', tooltipTitle: 'Rating G', tooltipContent: RATING_TOOLTIPS['G'] },
    { id: 'PG', name: 'PG (Parental Guidance)', tooltipTitle: 'Rating PG', tooltipContent: RATING_TOOLTIPS['PG'] },
    { id: 'PG-13', name: 'PG-13 (Parents Strongly Cautioned)', tooltipTitle: 'Rating PG-13', tooltipContent: RATING_TOOLTIPS['PG-13'] },
    { id: 'R', name: 'R (Restricted)', tooltipTitle: 'Rating R', tooltipContent: RATING_TOOLTIPS['R'] },
    { id: 'NC-17', name: 'NC-17 (Clearly Adults Only)', tooltipTitle: 'Rating NC-17', tooltipContent: RATING_TOOLTIPS['NC-17'] },
  ];

  const activeInnuendoStep = getInnuendoStep(dialogInnuendoLevel);
  const activeEpicStep = getEpicStep(dialogEpicLevel);

  const handleClearAllOptions = () => {
    setInstructions('');
    setMusicInspiration('');
    setDialogDialectId('');
    setDialogRating('G');
    setSelectedGrooves([]);
    setDialogEmotionName('Joyful');
    setTempSelectedInstruments([]);
    setTempSelectedStyles([]);
    setDialogChildVoice(false);
    setSelectedSfx([]);
    setDialogIntroConfig({ enabled: false, duration: 15, instruments: [] });
    setDialogOutroConfig({ enabled: false, duration: 15, instruments: [] });
    setDialogSelfReflect(false);
    setDialogInnuendoLevel(0);
    setDialogReverseLyrics(false);
    setDialogEpicLevel(0);
    setDialogRhymeId('perfect');
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      onConfirm={() => onConfirm(
        instructions, 
        musicInspiration, 
        dialogDialectId, 
        dialogRating, 
        selectedGrooves, 
        dialogEmotionName, 
        tempSelectedInstruments, 
        tempSelectedStyles,
        dialogChildVoice,
        selectedSfx,
        dialogIntroConfig,
        dialogOutroConfig,
        dialogSelfReflect,
        dialogInnuendoLevel,
        dialogReverseLyrics,
        dialogEpicLevel,
        dialogRhymeId
      )} 
      onClear={handleClearAllOptions}
      clearText="Reset all generation parameters to default"
      title="Generate / Modify Song"
      size="full"
    >
      <div className="flex flex-col gap-6 h-full text-lavender-text">
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
          
          {/* Left Column (Span 1 of 3): Parameters buttons (shortened, no summary here!) */}
          <div className="lg:col-span-1 flex flex-col gap-4 p-5 bg-lavender-surface/10 border border-lavender-border/25 rounded-xl h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-lavender-accent uppercase tracking-widest block mb-3 border-b border-lavender-border/40 pb-1">
                  Configure Song Parameters
                </span>
                
                {/* Compact Buttons List */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* 1. Accent */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">1. Vocal Accent</span>
                    <button
                      type="button"
                      onClick={() => setShowLanguageSelector(true)}
                      className="w-full text-center py-2 px-3 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all text-xs font-bold text-lavender-text truncate cursor-pointer"
                    >
                      Browse Accent &rarr;
                    </button>
                  </div>

                  {/* 2. Emotion */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">2. Track Emotion</span>
                    <button
                      type="button"
                      onClick={() => setShowEmotionSelector(true)}
                      className="w-full text-center py-2 px-3 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all text-xs font-bold text-lavender-text truncate cursor-pointer"
                    >
                      Browse Emotion &rarr;
                    </button>
                  </div>

                  {/* 3. Styles & Grooves */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">3. Styles & Grooves</span>
                    <button
                      type="button"
                      onClick={() => setShowStylesAndGroovesSelector(true)}
                      className="w-full text-center py-2 px-3 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all text-xs font-bold text-lavender-text truncate cursor-pointer animate-pulse-subtle"
                    >
                      Browse Styles & Grooves &rarr;
                    </button>
                  </div>

                  {/* 4. Instruments */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">4. Instruments</span>
                    <button
                      type="button"
                      onClick={() => setShowInstrumentsSelector(true)}
                      className="w-full text-center py-2 px-3 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all text-xs font-bold text-lavender-text truncate cursor-pointer"
                    >
                      Browse Band &rarr;
                    </button>
                  </div>

                  {/* 5. Safety Rating */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">5. Safety Rating</span>
                    <div className="flex bg-lavender-surface border border-lavender-border rounded p-0.5 justify-around items-center h-[34px]">
                      {['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => {
                        const isSel = dialogRating === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setDialogRating(r)}
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-lavender-accent text-black font-black' 
                                : 'text-lavender-text/50 hover:text-lavender-accent'
                            }`}
                            title={RATING_TOOLTIPS[r] || r}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. Vocal Profile */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">6. Vocal Profile</span>
                    <label className="flex items-center justify-between h-[34px] bg-lavender-surface border border-lavender-border rounded px-3 cursor-pointer hover:border-lavender-accent transition-all">
                      <span className="text-[11px] font-extrabold text-lavender-text/80">Child Voice</span>
                      <input
                        type="checkbox"
                        checked={dialogChildVoice}
                        onChange={(e) => setDialogChildVoice(e.target.checked)}
                        className="accent-lavender-accent cursor-pointer w-3.5 h-3.5 rounded border border-lavender-border bg-lavender-bg"
                      />
                    </label>
                  </div>

                  {/* 7. Self-Reflection */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">7. Self-Reflection</span>
                    <label className="flex items-center justify-between h-[34px] bg-lavender-surface border border-lavender-border rounded px-3 cursor-pointer hover:border-lavender-accent transition-all animate-fade-in" title="If enabled, the lyrics can mention the singers, their habits, and being barefoot">
                      <span className="text-[11px] font-extrabold text-lavender-text/80">Self-Reflective Lyrics</span>
                      <input
                        type="checkbox"
                        id="checkbox-self-reflect"
                        checked={dialogSelfReflect}
                        onChange={(e) => setDialogSelfReflect(e.target.checked)}
                        className="accent-lavender-accent cursor-pointer w-3.5 h-3.5 rounded border border-lavender-border bg-lavender-bg"
                      />
                    </label>
                  </div>

                  {/* 8. Sound Effects */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">8. Sound Effects</span>
                    <button
                      type="button"
                      onClick={() => setShowSfxSelector(true)}
                      className="w-full text-center py-2 px-3 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all text-xs font-bold text-lavender-text truncate cursor-pointer"
                    >
                      Browse FX &rarr;
                    </button>
                  </div>

                  {/* 9. Instrumental Intro */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">9. Instrumental Intro</span>
                    <button
                      type="button"
                      onClick={() => setShowIntroSelector(true)}
                      className={`w-full text-center py-2 px-3 border rounded transition-all text-xs font-bold truncate cursor-pointer ${
                        dialogIntroConfig.enabled
                          ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent hover:border-lavender-accent/50'
                          : 'bg-lavender-surface/60 border-lavender-border hover:border-lavender-accent hover:bg-lavender-surface text-lavender-text'
                      }`}
                    >
                      {dialogIntroConfig.enabled ? `Intro: ${dialogIntroConfig.duration}s` : 'Configure Intro'}
                    </button>
                  </div>

                  {/* 10. Instrumental Outro */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">10. Instrumental Outro</span>
                    <button
                      type="button"
                      onClick={() => setShowOutroSelector(true)}
                      className={`w-full text-center py-2 px-3 border rounded transition-all text-xs font-bold truncate cursor-pointer ${
                        dialogOutroConfig.enabled
                          ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent hover:border-lavender-accent/50'
                          : 'bg-lavender-surface/60 border-lavender-border hover:border-lavender-accent hover:bg-lavender-surface text-lavender-text'
                      }`}
                    >
                      {dialogOutroConfig.enabled ? `Outro: ${dialogOutroConfig.duration}s` : 'Configure Outro'}
                    </button>
                  </div>

                  {/* 11. Lyric Reversal */}
                  <div className="space-y-1 col-span-2">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">11. Lyric Reversal</span>
                    <label className="flex items-center justify-between h-[34px] bg-lavender-surface border border-lavender-border rounded px-3 cursor-pointer hover:border-lavender-accent transition-all animate-fade-in" title="If enabled, all lyrics will be fully reversed (e.g., 'Hello' becomes 'Olleh') while keeping structural tag brackets untouched. Works for all languages!">
                      <span className="text-[11px] font-extrabold text-lavender-text/80">Reverse Generated Lyrics</span>
                      <input
                        type="checkbox"
                        id="checkbox-reverse-lyrics"
                        checked={dialogReverseLyrics}
                        onChange={(e) => setDialogReverseLyrics(e.target.checked)}
                        className="accent-lavender-accent cursor-pointer w-3.5 h-3.5 rounded border border-lavender-border bg-lavender-bg"
                      />
                    </label>
                  </div>

                  {/* 12. Epic Drama Level */}
                  <div className="space-y-2 col-span-2 mt-2 pt-2 border-t border-lavender-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">12. Epic Drama Level</span>
                      <span className="text-[10px] bg-lavender-accent/15 border border-lavender-accent/25 text-lavender-accent font-mono font-bold px-2.5 py-0.5 rounded-full">
                        Step {dialogEpicLevel + 1} / 24
                      </span>
                    </div>

                    {/* Active Epic Level Description */}
                    <div className="bg-lavender-surface/60 border border-lavender-border/30 rounded-lg p-2.5">
                      <div className="flex items-baseline justify-between gap-2 border-b border-lavender-border/10 pb-1 mb-1">
                        <span className="text-[11px] font-black text-lavender-accent uppercase tracking-wide">
                          {activeEpicStep.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-lavender-text/70 leading-normal">
                        {activeEpicStep.description}
                      </p>
                    </div>

                    {/* Slider Input */}
                    <div className="space-y-1">
                      <input 
                        type="range"
                        min="0"
                        max="23"
                        value={dialogEpicLevel}
                        onChange={(e) => setDialogEpicLevel(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-lavender-surface border border-lavender-border/30 rounded-lg appearance-none cursor-pointer accent-lavender-accent hover:border-lavender-accent/35"
                      />
                      <div className="flex justify-between text-[8px] text-lavender-text/40 font-bold px-0.5 font-mono uppercase tracking-wide font-sans">
                        <span>Basic Pop (0)</span>
                        <span>Dramatic Epic (23)</span>
                      </div>
                    </div>
                  </div>

                  {/* 13. Rhyme Scheme / Structure */}
                  <div className="space-y-2 col-span-2 mt-2 pt-2 border-t border-lavender-border/20">
                    <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest block">13. Rhyme Scheme / Structure</span>
                    <button
                      type="button"
                      onClick={() => setShowRhymeSelector(true)}
                      className="w-full text-left p-2.5 bg-lavender-surface/60 border border-lavender-border rounded hover:border-lavender-accent hover:bg-lavender-surface transition-all cursor-pointer flex justify-between items-center"
                    >
                      <div className="truncate pr-2">
                        <span className="text-xs font-semibold text-lavender-accent block truncate">
                          {findRhymeTypeById(dialogRhymeId).name}
                        </span>
                        <p className="text-[10px] text-lavender-text/60 truncate mt-0.5">
                          {findRhymeTypeById(dialogRhymeId).description}
                        </p>
                      </div>
                      <span className="text-lavender-text/45 text-[10px] font-bold shrink-0">Browse &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspiration Text Input at bottom of Left Column */}
            <div className="shrink-0 bg-lavender-surface/10 border border-lavender-border/25 rounded-lg p-3.5 mt-auto">
              <TextArea 
                label="Artists Inspiration / Style" 
                placeholder="e.g. A mixture of Madonna with Kraftwerk..." 
                rows={2}
                value={musicInspiration}
                onChange={(e) => setMusicInspiration(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column (Span 2 of 3): Innuendo slider, Prompt area & Active Summary */}
          <div className="lg:col-span-2 flex flex-col gap-5 p-5 bg-lavender-surface/10 border border-lavender-border/25 rounded-xl h-full overflow-y-auto">
            
            {/* Level of Sensual/Sexual Innuendo Slider */}
            <div className="bg-lavender-surface/25 border border-lavender-border/30 rounded-xl p-4.5 space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-lavender-border/25 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-lavender-accent tracking-widest">
                    Sensual / Sexual Innuendo Subtext
                  </span>
                  <span className="text-[10px] bg-lavender-accent/15 border border-lavender-accent/25 text-lavender-accent font-bold px-2.5 py-0.5 rounded-full font-mono">
                    Step {dialogInnuendoLevel + 1} / 24
                  </span>
                </div>
                {/* Safety Rating Cap Gauge */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
                  <span className="text-lavender-text/50">Active Safety Rating:</span>
                  <span className={`px-2 py-0.5 rounded font-black ${
                    dialogRating === 'G' || dialogRating === 'PG'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                      : dialogRating === 'PG-13'
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                      : 'bg-red-500/15 text-red-400 border border-red-500/25'
                  }`}>
                    {dialogRating}
                  </span>
                </div>
              </div>

              {/* Text explanation panel */}
              <div className="bg-lavender-surface/60 border border-lavender-border/20 rounded-lg p-3">
                <div className="flex items-baseline justify-between gap-2 border-b border-lavender-border/10 pb-1 mb-1.5">
                  <span className="text-xs font-black text-lavender-accent uppercase tracking-wide">
                    {activeInnuendoStep.label}
                  </span>
                  <span className="text-[9px] font-mono text-lavender-text/45 shrink-0 uppercase tracking-widest font-bold">
                    {dialogInnuendoLevel === 0 ? 'Absolutely None' : dialogInnuendoLevel === 23 ? 'Purely Sexual' : dialogInnuendoLevel <= 11 ? 'Sensual tones' : 'Highly physical / passionate'}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-lavender-text/75 leading-relaxed">
                  {activeInnuendoStep.description}
                </p>
              </div>

              {/* Slider Input with Tailwind styling */}
              <div className="space-y-1.5 pt-1">
                <input 
                  type="range"
                  min="0"
                  max="23"
                  value={dialogInnuendoLevel}
                  onChange={(e) => setDialogInnuendoLevel(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-lavender-surface border border-lavender-border/30 rounded-lg appearance-none cursor-pointer accent-lavender-accent hover:border-lavender-accent/40"
                />
                <div className="flex justify-between text-[9px] text-lavender-text/40 font-extrabold px-1 font-mono uppercase tracking-wide">
                  <span>Absolutely None (0)</span>
                  <span>More Sensual (12)</span>
                  <span>Absolutely Sexual (24)</span>
                </div>
              </div>

              {/* Safety Constraint Active Indicator */}
              {((dialogRating === 'G' && dialogInnuendoLevel > 0) || 
                (dialogRating === 'PG' && dialogInnuendoLevel > 6) || 
                (dialogRating === 'PG-13' && dialogInnuendoLevel > 14)) && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 text-yellow-500/80 rounded-lg px-2.5 py-1.5 text-[10px] font-bold leading-relaxed flex items-start gap-1.5">
                  <span className="text-yellow-500 font-extrabold text-xs leading-none shrink-0 pt-0.5">⚠️</span>
                  <span>
                    Warning: Safety Rating ({dialogRating}) enforces strict safety boundaries. The generator will automatically override, mute, or tone down intense {activeInnuendoStep.label.toLowerCase()} subtext to remain absolutely compliant with rating limits.
                  </span>
                </div>
              )}
            </div>

            {/* Prompt Instructions */}
            <TextArea 
              label="Lyric Instructions & Song Prompt" 
              placeholder="e.g. Write a song about a rainy day in Utrecht, focusing on the beautiful bond between Miranda and Annelies..." 
              rows={12}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="flex-1 min-h-[250px]"
            />

            {/* Total Summary (Unified options summary list) - NEW POSITION (BELOW INSTRUCTIONS) */}
            <div className="bg-lavender-surface/15 border border-lavender-border/30 rounded-xl p-4.5 space-y-4 shrink-0">
              <span className="text-[11px] font-extrabold text-lavender-accent uppercase tracking-widest block border-b border-lavender-border/40 pb-1.5 mb-1.5">
                Active Selection Summary
              </span>

              {/* Accent, Emotion, Epic & Rhyme values */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-lavender-surface/40 p-2.5 rounded-lg border border-lavender-border/20">
                <div>
                  <span className="text-[10px] text-lavender-text/50 font-bold block uppercase tracking-wider mb-0.5">Vocal Accent</span>
                  <span className="font-extrabold text-lavender-accent/90 block truncate" title={dialogDialectId ? dialogDialectId.split(',').map(id => findDialectById(id).name).join(', ') : 'Default English'}>
                    {dialogDialectId ? dialogDialectId.split(',').map(id => findDialectById(id).name).join(' + ') : 'Default English'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-lavender-text/50 font-bold block uppercase tracking-wider mb-0.5">Tune Vibe</span>
                  <span className="font-extrabold text-lavender-accent/90 block truncate">{dialogEmotionName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-lavender-text/50 font-bold block uppercase tracking-wider mb-0.5">Epic Drama</span>
                  <span className="font-extrabold text-lavender-accent/90 block truncate" title={`${activeEpicStep.label}: ${activeEpicStep.description}`}>{activeEpicStep.label}</span>
                </div>
                <div>
                  <span className="text-[10px] text-lavender-text/50 font-bold block uppercase tracking-wider mb-0.5">Rhyme Scheme</span>
                  <span className="font-extrabold text-lavender-accent/90 block truncate" title={findRhymeTypeById(dialogRhymeId).name}>{findRhymeTypeById(dialogRhymeId).name}</span>
                </div>
              </div>

              {/* Tag Overviews */}
              <div className="space-y-3.5 text-xs">
                {/* Style subgenres chosen */}
                {tempSelectedStyles.length > 0 && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Styles ({tempSelectedStyles.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tempSelectedStyles.map(s => (
                        <span key={s} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-lavender-accent/15 text-lavender-accent border border-lavender-accent/25 rounded text-[10px] font-extrabold">
                          {s}
                          <button type="button" onClick={() => setTempSelectedStyles(prev => prev.filter(style => style !== s))} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instruments chosen */}
                {tempSelectedInstruments.length > 0 && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Instruments & Vocals ({tempSelectedInstruments.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tempSelectedInstruments.map(i => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-lavender-surface/80 border border-lavender-border rounded text-[10px] font-bold text-lavender-text/80">
                          {i}
                          <button type="button" onClick={() => setTempSelectedInstruments(prev => prev.filter(inst => inst !== i))} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Grooves chosen */}
                {selectedGrooves.length > 0 && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Core Beats & Grooves ({selectedGrooves.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGrooves.map(g => (
                        <span key={g} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-lavender-accent/10 text-lavender-accent border border-lavender-accent/20 rounded text-[10px] font-bold font-mono">
                          {g}
                          <button type="button" onClick={() => setSelectedGrooves(prev => prev.filter(groove => groove !== g))} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sound Effects chosen */}
                {selectedSfx.length > 0 && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Sound Effects ({selectedSfx.length})</span>
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {selectedSfx.map(fx => (
                        <span key={fx} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-bold">
                          {fx}
                          <button type="button" onClick={() => setSelectedSfx(prev => prev.filter(item => item !== fx))} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Child Voice indication */}
                {dialogChildVoice && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Vocal Profile</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                        Child Voice Enabled
                      </span>
                    </div>
                  </div>
                )}

                {/* Intro Config summary */}
                {dialogIntroConfig.enabled && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Instrumental Intro</span>
                    <div className="flex flex-col gap-1.5 bg-lavender-surface/30 p-2.5 rounded border border-lavender-border/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-lavender-accent">Active segment</span>
                        <span className="text-[10px] font-mono text-lavender-text/60">{dialogIntroConfig.duration} seconds</span>
                      </div>
                      {dialogIntroConfig.instruments.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dialogIntroConfig.instruments.map(inst => (
                            <span key={inst} className="bg-lavender-accent/10 border border-lavender-accent/25 text-[9px] text-lavender-accent font-bold px-1.5 py-0.5 rounded">
                              {inst}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-lavender-text/40 italic">Using standard instrumentation</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Outro Config summary */}
                {dialogOutroConfig.enabled && (
                  <div>
                    <span className="text-[10px] text-lavender-text/50 font-semibold block uppercase tracking-wider mb-1.5">Instrumental Outro</span>
                    <div className="flex flex-col gap-1.5 bg-lavender-surface/30 p-2.5 rounded border border-lavender-border/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-lavender-accent">Active segment</span>
                        <span className="text-[10px] font-mono text-lavender-text/60">{dialogOutroConfig.duration} seconds</span>
                      </div>
                      {dialogOutroConfig.instruments.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dialogOutroConfig.instruments.map(inst => (
                            <span key={inst} className="bg-lavender-accent/10 border border-lavender-accent/25 text-[9px] text-lavender-accent font-bold px-1.5 py-0.5 rounded">
                              {inst}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-lavender-text/40 italic">Using standard instrumentation</span>
                      )}
                    </div>
                  </div>
                )}

                {tempSelectedStyles.length === 0 && tempSelectedInstruments.length === 0 && selectedGrooves.length === 0 && selectedSfx.length === 0 && !dialogChildVoice && !dialogIntroConfig.enabled && !dialogOutroConfig.enabled && (
                  <div className="text-center py-4 bg-lavender-surface/5 rounded border border-dashed border-lavender-border/20">
                    <span className="text-[10px] text-lavender-text/40 italic">No styles, instruments, or grooves selected. Katje's AI will generate lyrics based on standard quartet setting.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StylesAndGroovesDialog
        isOpen={showStylesAndGroovesSelector}
        onClose={() => setShowStylesAndGroovesSelector(false)}
        onConfirm={(styles, grooves) => {
          setTempSelectedStyles(styles);
          setSelectedGrooves(grooves);
        }}
        initialStyles={tempSelectedStyles}
        initialGrooves={selectedGrooves}
      />

      <LanguageSelectionDialog
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onSelect={setDialogDialectId}
        currentDialectId={dialogDialectId}
      />

      <EmotionSelectionDialog
        isOpen={showEmotionSelector}
        onClose={() => setShowEmotionSelector(false)}
        onSelect={setDialogEmotionName}
        currentEmotionName={dialogEmotionName}
      />

      <InstrumentsSelectionDialog
        isOpen={showInstrumentsSelector}
        onClose={() => setShowInstrumentsSelector(false)}
        onSelect={setTempSelectedInstruments}
        initialSelected={tempSelectedInstruments}
      />

      <SfxSelectionDialog
        isOpen={showSfxSelector}
        onClose={() => setShowSfxSelector(false)}
        onSelect={setSelectedSfx}
        initialSelected={selectedSfx}
      />

      <IntroOutroDialog
        isOpen={showIntroSelector}
        onClose={() => setShowIntroSelector(false)}
        title="Configure Instrumental Intro"
        onConfirm={setDialogIntroConfig}
        initialConfig={dialogIntroConfig}
      />

      <IntroOutroDialog
        isOpen={showOutroSelector}
        onClose={() => setShowOutroSelector(false)}
        title="Configure Instrumental Outro"
        onConfirm={setDialogOutroConfig}
        initialConfig={dialogOutroConfig}
      />

      <RhymeSelectionDialog
        isOpen={showRhymeSelector}
        onClose={() => setShowRhymeSelector(false)}
        onSelect={setDialogRhymeId}
        currentRhymeId={dialogRhymeId}
      />
    </Dialog>
  );
};
