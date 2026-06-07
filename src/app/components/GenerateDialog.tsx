import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from './Dialog';
import { 
  Globe, Smile, Music, ShieldAlert, Badge, Radio, Play, Square, 
  RotateCcw, Flame, Trophy, Heart, Coffee, Frown, Sparkles, Zap, Quote,
  ArrowUp, ArrowDown, X, Check, Search, Trash2, CheckCircle, Sliders, Volume2, AlignLeft,
  Mic2, Users
} from 'lucide-react';
import { LANGUAGE_GROUPS, findDialectById, findGroupByDialectId } from '../utils/languages';
import { SONG_EMOTIONS } from '../utils/emotions';
import { evaluateAttributes } from './StylesAndGroovesDialog'; // Reuse attribute evaluator helper if exported, or re-implement below for self-containment
import { STYLES } from '../../constants/styles';
import { GROOVE_CATEGORIES, getGroupedAndSortedGrooves } from '../utils/grooves';
import { GROOVE_TOOLTIPS } from '../utils/tooltipsData';
import { INSTRUMENTS } from '../../constants/instruments';
import { SOUND_EFFECTS } from '../../constants/sfx';
import { RHYME_TYPES, RHYME_CATEGORIES, findRhymeCategoryOfId, findRhymeTypeById } from '../utils/rhymes';
import { getInnuendoStep, INNUENDO_STEPS } from '../utils/innuendoLevels';
import { getEpicStep } from '../utils/epicLevels';
import { SILLY_STEPS, getSillyStep } from '../utils/sillyLevels';
import { getSapphicStep, SAPPHIC_STEPS } from '../utils/sapphicLevels';
import { findKeyByIndex, findKeyIndexByName, findTimeSignatureByFraction, TIME_SIGNATURES, MUSICAL_KEYS, getTempoName } from '../utils/musicParams';

// Reimplement evaluateAttributes locally for self-containment/robustness
const getLocalAttributes = (name: string, description: string, type: 'style' | 'groove') => {
  const text = `${name} ${description}`.toLowerCase();
  
  // Loudness
  let loudness: 'high' | 'medium' | 'low' = 'medium';
  if (
    /high-octane|aggressive|metal|blastbeat|heavy|loud|thunderous|clash|gong|snare|piston|strike|distortion|drum\s+&\s+bass|shout|opera|screaming|hard\s+rock|punk|noise|hyperpop|deathcore|hellfire|industrial|epic|taiko|explosive|power/i.test(text)
  ) {
    loudness = 'high';
  } else if (
    /ambient|minimalist|lowercase|lullaby|whisper|comfort|bedroom|dreamy|mellow|slow-jam|acoustic|soft|calm|drip|space-dust|soothe|lull|gently|peaceful|quiet|sparse|tender|softly/i.test(text)
  ) {
    loudness = 'low';
  }

  // Bass & Drums
  let bass: 'heavy' | 'medium' | 'none' = 'medium';
  if (
    /bass|sub-bass|subbass|kick|roots\s+reggae|dubwise|soca|reggae|trap|boom-bap|hip-hop|synth-pop|cyberpunk|groove|house|techno|electronic|beat|4-on-the-floor|industrial|piston/i.test(text)
  ) {
    bass = 'heavy';
  } else if (
    /acoustic|folk|choir|vocal|gregorian|sacred|chant|didgeridoo|harp|chime|violin|classical|harpsichord|whistle|organum|lute|corroboree|poetry|spoken|acapella|ambient|piano/i.test(text)
  ) {
    bass = 'none';
  }

  // Tempo & Energy
  let tempo: 'fast' | 'medium' | 'slow' = 'medium';
  if (
    /fast|speedcore|high-tempo|extratone|bounce|high-octane|soca|carnival|rapid|hyperpop|blastbeat|dynamic|upbeat|jig|dance|drum\s+&\s+bass|sprints|rush|tempo/i.test(text)
  ) {
    tempo = 'fast';
  } else if (
    /slow|delay|relax|room|mellow|ambient|calm|lullaby|soothe|dreamy|ballad|doom\s+metal|laidback|lo-fi|chill|downbeat|drone|bedroom|candle|plod|isokratima/i.test(text)
  ) {
    tempo = 'slow';
  }

  // Vibe / Mood
  let vibe: 'dark' | 'bright' | 'weird' | 'neutral' = 'neutral';
  if (
    /dark|moody|sad|melancholy|gothic|doom|black\s+metal|abyssal|deathcore|hellfire|cave|underworld|ominous|haunting|shadow|ghost|dramatic|menacing|dread|satanic|grave|vampire/i.test(text)
  ) {
    vibe = 'dark';
  } else if (
    /bright|uplifting|happy|joyful|seraphic|angelic|heavenly|celestial|cherub|sun|sunrise|sunset|bubblegum|sweet|celebration|innocent|playful|bouncy|love|romance|passionate|serenade/i.test(text)
  ) {
    vibe = 'bright';
  } else if (
    /weird|uncommon|wonky|danger|avant-garde|glitch|lowercase|black\s+midi|noise|experimental|off-kilter|complex|ringtone|seapunk|cyber|binary/i.test(text)
  ) {
    vibe = 'weird';
  }

  return { loudness, bass, tempo, vibe };
};

export interface IntroOutroConfig {
  enabled: boolean;
  duration: number;
  instruments: string[];
}

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
    rhymeId?: string,
    sillyLevel?: number,
    sapphicLevel?: number,
    musicalKey?: string,
    bpm?: number,
    timeSignature?: string,
    targetSingerChildVoices?: Record<string, boolean>,
    targetSingerEmotions?: Record<string, string>,
    targetSingerPrompts?: Record<string, string>,
    targetSingerInstruments?: Record<string, string[]>,
    targetSingerPartnerUps?: Record<string, boolean>,
    targetEnabledTabs?: Record<string, boolean>
  ) => void;
  selectedInstruments: string[];
  selectedStyles: string[];
  currentDialectId: string;
  currentRating: string;
  selfReflect: boolean;
  currentInnuendoLevel?: number;
  reverseLyrics?: boolean;
  currentEpicLevel?: number;
  currentRhymeId?: string;
  currentSillyLevel?: number;
  currentSapphicLevel?: number;
  currentMusicalKey?: string;
  currentBpm?: number;
  currentTimeSignature?: string;
  initialSingerChildVoices?: Record<string, boolean>;
  initialSingerEmotions?: Record<string, string>;
  initialSingerPrompts?: Record<string, string>;
  initialSingerInstruments?: Record<string, string[]>;
  initialSingerPartnerUps?: Record<string, boolean>;
  onClear?: () => void;
  currentTitle?: string;
}

type TabId = 
  | 'prompt'
  | 'vocalAccentTone'
  | 'composer'
  | 'singers'
  | 'musicTheory'
  | 'structure'
  | 'poetics'
  | 'sliders';

export const singersMeta = [
  { id: 'miranda', name: 'Miranda', voice: 'Adult Soprano / Child Soprano' },
  { id: 'annelies', name: 'Annelies', voice: 'Adult Alto / Child Alto' },
  { id: 'fannie', name: 'Fannie', voice: 'Adult Tenor / Child Soprano' },
  { id: 'emma', name: 'Emma', voice: 'Adult Mezzo / Child Alto' }
];

export const SINGLE_SINGER_INSTRUMENTS = [
  // Ancient & Exotic
  { name: "Crwth", description: "Ancient Celtic six-string bowed lyre from Wales.", group: "Ancient & Exotic" },
  { name: "Lyre", description: "Ancient Greek classical plucked string instrument.", group: "Ancient & Exotic" },
  { name: "Kithara", description: "Professional heavy-wooden string instrument of antiquity.", group: "Ancient & Exotic" },
  { name: "Lituus", description: "Ancient Roman long bronze trumpet with curved end.", group: "Ancient & Exotic" },
  { name: "Carnyx", description: "Iron Age Celtic bronze war trumpet with boar-shaped bell.", group: "Ancient & Exotic" },
  { name: "Hurdy-Gurdy", description: "Medieval mechanical wheel-rubbed cranked string instrument.", group: "Ancient & Exotic" },
  { name: "Glass Harmonica", description: "Friction-played spinning glass bowls.", group: "Ancient & Exotic" },

  // Brass
  { name: "Trumpet", description: "High-pitched brilliant metal brass instrument with valve play.", group: "Brass" },
  { name: "Trombone", description: "Slide-sliding low register brass bell.", group: "Brass" },
  { name: "Tuba", description: "Deepest low-end brass foundational valve horn.", group: "Brass" },
  { name: "French Horn", description: "Warm conical coiled brass valve instrument.", group: "Brass" },
  { name: "Bugle", description: "Simple keyless military signaling brass horn.", group: "Brass" },

  // Drums & Snare
  { name: "Snare Drum", description: "Rattling wire-bottom high-impact military snare.", group: "Drums & Snare" },
  { name: "Side Drum", description: "Historically styled deep-frame marching field drum.", group: "Drums & Snare" },
  { name: "Bass Drum", description: "Deep booming resonant low-frequency percussion.", group: "Drums & Snare" },
  { name: "Bodhrán", description: "Traditional Irish hand-held frame drum beaten with a tipper.", group: "Drums & Snare" },
  { name: "Timpani", description: "Large orchestral copper-pot pitched kettledrums.", group: "Drums & Snare" },
  { name: "Djembe", description: "Goblet-shaped rope-tuned hand drum of West Africa.", group: "Drums & Snare" },

  // Percussion & Metal
  { name: "Tambourine", description: "Handheld frame wood drum with jingles.", group: "Percussion & Metal" },
  { name: "Triangle", description: "High ringing metal bar of high pitch and clarity.", group: "Percussion & Metal" },
  { name: "Wind Chimes", description: "Delicate wind-blown hanging metal rods of high shimmer.", group: "Percussion & Metal" },
  { name: "Glockenspiel", description: "Set of tuned metallic bars played with hard mallets.", group: "Percussion & Metal" },
  { name: "Cymbals", description: "Crashing or riding round thin metal plates.", group: "Percussion & Metal" },
  { name: "Castanets", description: "Clicking wooden rhythmic shells held in fingers.", group: "Percussion & Metal" },
  { name: "Cowbell", description: "Clunky rustic hollow metal percussion vessel.", group: "Percussion & Metal" },

  // Electronic
  { name: "Keytar", description: "Synthesizer worn with a strap like a guitar.", group: "Electronic" },
  { name: "Stylophone", description: "Miniature analog stylus keyboard.", group: "Electronic" },
  { name: "Otamatone", description: "Quirky note-slide japanese toy synth.", group: "Electronic" },
  { name: "Theremin", description: "Non-contact electromagnetic tone slider.", group: "Electronic" },
  { name: "Mellotron", description: "Vintage tape-replay polyphonic keyboard instrument.", group: "Electronic" },

  // Acoustic Strings
  { name: "Acoustic Guitar", description: "Rich, resonance classical plucked string instrument.", group: "Acoustic Strings" },
  { name: "Lute", description: "Plucked string instrument with a rounded body.", group: "Acoustic Strings" },
  { name: "Harp", description: "Plucked multi-string frame instrument.", group: "Acoustic Strings" },
  { name: "Mandolin", description: "High-pitched plucked string instrument.", group: "Acoustic Strings" },
  { name: "Banjo", description: "Twangy plucked string instrument with a drum-like body.", group: "Acoustic Strings" },
  { name: "Dulcimer", description: "Zither-like folk strings beaten with tiny mallets.", group: "Acoustic Strings" },

  // Bowed Strings
  { name: "Violin", description: "Bowed high-register classical string instrument.", group: "Bowed Strings" },
  { name: "Viola", description: "Warm, medium register bowed stringed companion.", group: "Bowed Strings" },
  { name: "Cello", description: "Deep and highly resonant bowed classical string instrument.", group: "Bowed Strings" },
  { name: "Double Bass", description: "Lowest register heavy-timber orchestral bowed strings.", group: "Bowed Strings" },

  // Woodwinds & Reeds
  { name: "Bagpipes", description: "Scottish bellows-blown bladder and drone pipes.", group: "Woodwinds & Reeds" },
  { name: "Flute", description: "Woodwind instrument with a sweet, airy voice.", group: "Woodwinds & Reeds" },
  { name: "Panpipes", description: "Multi-pipe wind instrument of antiquity.", group: "Woodwinds & Reeds" },
  { name: "Recorder", description: "Simple wooden internal duct flute.", group: "Woodwinds & Reeds" },
  { name: "Accordion", description: "Box bellows-driven reed instrument.", group: "Woodwinds & Reeds" }
];

export const GenerateDialog: React.FC<GenerateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedInstruments,
  selectedStyles,
  currentDialectId,
  currentRating,
  selfReflect,
  currentInnuendoLevel = 0,
  reverseLyrics = false,
  currentEpicLevel = 0,
  currentRhymeId = 'perfect',
  currentSillyLevel = 0,
  currentSapphicLevel = 0,
  currentMusicalKey = 'C Major',
  currentBpm = 120,
  currentTimeSignature = '4/4',
  initialSingerChildVoices,
  initialSingerEmotions,
  initialSingerPrompts,
  initialSingerInstruments,
  initialSingerPartnerUps,
  onClear,
  currentTitle = 'Untitled'
}) => {
  // Tabs config
  const tabsList: { id: TabId; label: string; details: string; icon: React.ReactNode }[] = [
    { id: 'prompt', label: '1. Lyrics Instructions & Prompt', details: 'Base lyrics instructions & song ideas.', icon: <Quote size={13} /> },
    { id: 'vocalAccentTone', label: '2. Accent & Track Emotion', details: 'Choose regional dialects & vocal performance feeling.', icon: <Globe size={13} /> },
    { id: 'composer', label: '3. Genre Styles & Backing Band', details: 'Set styles, tempos, grooves & instrument tracks.', icon: <Flame size={13} /> },
    { id: 'singers', label: '4. Singer Casting & duets', details: 'Casting prompts, child pitch toggles, & duet pairings.', icon: <Mic2 size={13} /> },
    { id: 'musicTheory', label: '5. Tempo, Key & Rhythm', details: 'BPM speed, musical scale, & time signatures.', icon: <Music size={13} /> },
    { id: 'structure', label: '6. Song Structure & Sound FX', details: 'Intro/outro controls and bracket sound FX.', icon: <Play size={13} /> },
    { id: 'poetics', label: '7. Poetics & Safeties', details: 'Lyric rhyme structures & content warnings.', icon: <AlignLeft size={13} /> },
    { id: 'sliders', label: '8. Aesthetic Sliders', details: 'Creative playfulness, silliness, & innuendo scales.', icon: <Sliders size={13} /> }
  ];

  // Active Tab
  const [activeTabId, setActiveTabId] = useState<TabId>('prompt');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Enabled Tab map (maintains individual keys for precise setting checks)
  const [enabledTabs, setEnabledTabs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor-enabled-tabs-v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...parsed, 
          prompt: true,
          singers: parsed.singers || false,
          singerInstruments: parsed.singerInstruments || false,
          partnerUp: parsed.partnerUp || false,
          musicalKey: parsed.musicalKey || false,
          beatsPerMinute: parsed.beatsPerMinute || false,
          timeSignature: parsed.timeSignature || false,
          sapphicLevel: parsed.sapphicLevel || false,
        }; // Prompt is always true
      } catch (e) {}
    }
    return {
      prompt: true,
      accent: false,
      emotion: false,
      styles: false,
      instruments: false,
      rating: false,
      childVoice: false,
      singers: false,
      singerInstruments: false,
      partnerUp: false,
      selfReflecting: false,
      sfx: false,
      intro: false,
      outro: false,
      lyricsReversal: false,
      innuendoLevel: false,
      epicLevel: false,
      sillyLevel: false,
      sapphicLevel: false,
      rhymeScheme: false,
      musicalKey: false,
      beatsPerMinute: false,
      timeSignature: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('noor-enabled-tabs-v3', JSON.stringify(enabledTabs));
  }, [enabledTabs]);

  const toggleTabEnabled = (id: string) => {
    if (id === 'prompt') return; // Cannot disable prompt
    setEnabledTabs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Values states (synchronized with localStorage like previous code)
  const [instructions, setInstructions] = useState(() => localStorage.getItem('noor-instructions') || '');
  const [musicInspiration, setMusicInspiration] = useState(() => localStorage.getItem('noor-music-inspiration') || '');
  const [dialogDialectId, setDialogDialectId] = useState(() => localStorage.getItem('noor-dialect-id') || currentDialectId || 'en-GB');
  const [dialogRating, setDialogRating] = useState(() => localStorage.getItem('noor-rating') || currentRating || 'PG');
  const [selectedGrooves, setSelectedGrooves] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-grooves');
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogInnuendoLevel, setDialogInnuendoLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-innuendo-level');
    return saved ? parseInt(saved, 10) : currentInnuendoLevel || 0;
  });
  const [dialogEmotionName, setDialogEmotionName] = useState(() => localStorage.getItem('noor-emotion-name') || 'Joyful');
  const [tempSelectedInstruments, setTempSelectedInstruments] = useState<string[]>([]);
  const [tempSelectedStyles, setTempSelectedStyles] = useState<string[]>([]);
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
  const [dialogSillyLevel, setDialogSillyLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-silly-level');
    return saved ? parseInt(saved, 10) : currentSillyLevel || 0;
  });
  const [dialogSapphicLevel, setDialogSapphicLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-sapphic-level');
    return saved ? parseInt(saved, 10) : currentSapphicLevel || 0;
  });
  const [dialogRhymeId, setDialogRhymeId] = useState<string>(() => {
    return localStorage.getItem('noor-rhyme-id') || currentRhymeId || 'perfect';
  });
  const [selectedSfx, setSelectedSfx] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-sound-effects');
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogIntroConfig, setDialogIntroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-intro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });
  const [dialogOutroConfig, setDialogOutroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-outro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });
  const [dialogMusicalKey, setDialogMusicalKey] = useState<string>(() => {
    const saved = localStorage.getItem('noor-musical-key');
    return saved || currentMusicalKey || 'C Major';
  });
  const [dialogBpm, setDialogBpm] = useState<number>(() => {
    const saved = localStorage.getItem('noor-bpm');
    return saved ? parseInt(saved, 10) : currentBpm || 120;
  });
  const [dialogTimeSignature, setDialogTimeSignature] = useState<string>(() => {
    const saved = localStorage.getItem('noor-time-signature');
    return saved || currentTimeSignature || '4/4';
  });

  const [activeEmotionSinger, setActiveEmotionSinger] = useState<'miranda' | 'annelies' | 'fannie' | 'emma'>('miranda');
  const [activeInstrumentSinger, setActiveInstrumentSinger] = useState<'miranda' | 'annelies' | 'fannie' | 'emma'>('miranda');
  const [activeSingerCastingId, setActiveSingerCastingId] = useState<'miranda' | 'annelies' | 'fannie' | 'emma'>('miranda');
  const [activeSingerInstrumentGroup, setActiveSingerInstrumentGroup] = useState<string>('All');

  // Consolidated sub-tabs states
  const [accentToneSubTab, setAccentToneSubTab] = useState<'accent' | 'emotion'>('accent');
  const [composerSubTab, setComposerSubTab] = useState<'styles' | 'instruments'>('styles');
  const [singersSubTab, setSingersSubTab] = useState<'casting' | 'profile' | 'instruments' | 'partnerUp'>('casting');
  const [musicTheorySubTab, setMusicTheorySubTab] = useState<'bpm' | 'key' | 'timeSig'>('bpm');
  const [structureSubTab, setStructureSubTab] = useState<'intro' | 'outro' | 'sfx'>('intro');
  const [poeticsSubTab, setPoeticsSubTab] = useState<'rhyme' | 'reversal' | 'reflection' | 'safety'>('rhyme');
  const [slidersSubTab, setSlidersSubTab] = useState<'innuendo' | 'epic' | 'silly' | 'sapphic'>('innuendo');

  const [singerChildVoices, setSingerChildVoices] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor-singer-child-voices');
    return saved ? JSON.parse(saved) : (initialSingerChildVoices || { miranda: false, annelies: false, fannie: false, emma: false });
  });

  const [singerEmotions, setSingerEmotions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('noor-singer-emotions');
    return saved ? JSON.parse(saved) : (initialSingerEmotions || { miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' });
  });

  const [singerPrompts, setSingerPrompts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('noor-singer-prompts');
    return saved ? JSON.parse(saved) : (initialSingerPrompts || { miranda: '', annelies: '', fannie: '', emma: '' });
  });

  const [singerInstruments, setSingerInstruments] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('noor-singer-instruments');
    return saved ? JSON.parse(saved) : (initialSingerInstruments || { miranda: [], annelies: [], fannie: [], emma: [] });
  });

  const [singerPartnerUps, setSingerPartnerUps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor-singer-partner-ups');
    return saved ? JSON.parse(saved) : (initialSingerPartnerUps || { miranda: false, annelies: false, fannie: false, emma: false });
  });

  const [allowFastBpm, setAllowFastBpm] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor-allow-fast-bpm');
    return saved !== null ? saved === 'true' : false;
  });

  // Watch content changes and update localstorage
  useEffect(() => { localStorage.setItem('noor-singer-child-voices', JSON.stringify(singerChildVoices)); }, [singerChildVoices]);
  useEffect(() => { localStorage.setItem('noor-singer-emotions', JSON.stringify(singerEmotions)); }, [singerEmotions]);
  useEffect(() => { localStorage.setItem('noor-singer-prompts', JSON.stringify(singerPrompts)); }, [singerPrompts]);
  useEffect(() => { localStorage.setItem('noor-singer-instruments', JSON.stringify(singerInstruments)); }, [singerInstruments]);
  useEffect(() => { localStorage.setItem('noor-singer-partner-ups', JSON.stringify(singerPartnerUps)); }, [singerPartnerUps]);
  useEffect(() => { localStorage.setItem('noor-allow-fast-bpm', allowFastBpm ? 'true' : 'false'); }, [allowFastBpm]);
  useEffect(() => { localStorage.setItem('noor-instructions', instructions); }, [instructions]);
  useEffect(() => { localStorage.setItem('noor-music-inspiration', musicInspiration); }, [musicInspiration]);
  useEffect(() => { localStorage.setItem('noor-selected-grooves', JSON.stringify(selectedGrooves)); }, [selectedGrooves]);
  useEffect(() => { localStorage.setItem('noor-emotion-name', dialogEmotionName); }, [dialogEmotionName]);
  useEffect(() => { localStorage.setItem('noor-dialect-id', dialogDialectId); }, [dialogDialectId]);
  useEffect(() => { localStorage.setItem('noor-rating', dialogRating); }, [dialogRating]);
  useEffect(() => { localStorage.setItem('noor-child-voice', dialogChildVoice ? 'true' : 'false'); }, [dialogChildVoice]);
  useEffect(() => { localStorage.setItem('noor-self-reflect', dialogSelfReflect ? 'true' : 'false'); }, [dialogSelfReflect]);
  useEffect(() => { localStorage.setItem('noor-reverse-lyrics', dialogReverseLyrics ? 'true' : 'false'); }, [dialogReverseLyrics]);
  useEffect(() => { localStorage.setItem('noor-selected-sound-effects', JSON.stringify(selectedSfx)); }, [selectedSfx]);
  useEffect(() => { localStorage.setItem('noor-intro-config', JSON.stringify(dialogIntroConfig)); }, [dialogIntroConfig]);
  useEffect(() => { localStorage.setItem('noor-outro-config', JSON.stringify(dialogOutroConfig)); }, [dialogOutroConfig]);
  useEffect(() => { localStorage.setItem('noor-innuendo-level', dialogInnuendoLevel.toString()); }, [dialogInnuendoLevel]);
  useEffect(() => { localStorage.setItem('noor-epic-level', dialogEpicLevel.toString()); }, [dialogEpicLevel]);
  useEffect(() => { localStorage.setItem('noor-silly-level', dialogSillyLevel.toString()); }, [dialogSillyLevel]);
  useEffect(() => { localStorage.setItem('noor-sapphic-level', dialogSapphicLevel.toString()); }, [dialogSapphicLevel]);
  useEffect(() => { localStorage.setItem('noor-rhyme-id', dialogRhymeId); }, [dialogRhymeId]);
  useEffect(() => { localStorage.setItem('noor-musical-key', dialogMusicalKey); }, [dialogMusicalKey]);
  useEffect(() => { localStorage.setItem('noor-bpm', dialogBpm.toString()); }, [dialogBpm]);
  useEffect(() => { localStorage.setItem('noor-time-signature', dialogTimeSignature); }, [dialogTimeSignature]);

  // Sync prop changes directly
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
      setInstructions(savedInstructions || '');

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

      const savedSilly = localStorage.getItem('noor-silly-level');
      setDialogSillyLevel(savedSilly ? parseInt(savedSilly, 10) : currentSillyLevel || 0);

      const savedRhyme = localStorage.getItem('noor-rhyme-id');
      setDialogRhymeId(savedRhyme || currentRhymeId || 'perfect');

      const savedKey = localStorage.getItem('noor-musical-key');
      setDialogMusicalKey(savedKey || currentMusicalKey || 'C Major');

      const savedBpm = localStorage.getItem('noor-bpm');
      setDialogBpm(savedBpm ? parseInt(savedBpm, 10) : currentBpm || 120);

      const savedSig = localStorage.getItem('noor-time-signature');
      setDialogTimeSignature(savedSig || currentTimeSignature || '4/4');

      const savedSingerChildVoices = localStorage.getItem('noor-singer-child-voices');
      setSingerChildVoices(savedSingerChildVoices ? JSON.parse(savedSingerChildVoices) : (initialSingerChildVoices || { miranda: false, annelies: false, fannie: false, emma: false }));

      const savedSingerEmotions = localStorage.getItem('noor-singer-emotions');
      setSingerEmotions(savedSingerEmotions ? JSON.parse(savedSingerEmotions) : (initialSingerEmotions || { miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' }));

      const savedSingerPrompts = localStorage.getItem('noor-singer-prompts');
      setSingerPrompts(savedSingerPrompts ? JSON.parse(savedSingerPrompts) : (initialSingerPrompts || { miranda: '', annelies: '', fannie: '', emma: '' }));

      const savedSingerInstruments = localStorage.getItem('noor-singer-instruments');
      setSingerInstruments(savedSingerInstruments ? JSON.parse(savedSingerInstruments) : (initialSingerInstruments || { miranda: [], annelies: [], fannie: [], emma: [] }));

      const savedSingerPartnerUps = localStorage.getItem('noor-singer-partner-ups');
      setSingerPartnerUps(savedSingerPartnerUps ? JSON.parse(savedSingerPartnerUps) : (initialSingerPartnerUps || { miranda: false, annelies: false, fannie: false, emma: false }));

      const savedAllowFastBpm = localStorage.getItem('noor-allow-fast-bpm');
      setAllowFastBpm(savedAllowFastBpm !== null ? savedAllowFastBpm === 'true' : false);

      setTempSelectedInstruments([...selectedInstruments]);
      setTempSelectedStyles([...selectedStyles]);
    }
  }, [isOpen, currentDialectId, currentRating, selectedInstruments, selectedStyles, selfReflect, currentInnuendoLevel, currentEpicLevel, currentRhymeId, currentSillyLevel, currentMusicalKey, currentBpm, currentTimeSignature, initialSingerChildVoices, initialSingerEmotions, initialSingerPrompts, initialSingerInstruments, initialSingerPartnerUps]);

  // Clear parameter triggers
  const handleClearAllOptions = () => {
    setInstructions('');
    setMusicInspiration('');
    setDialogDialectId('');
    setDialogRating('PG');
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
    setDialogSillyLevel(0);
    setDialogRhymeId('perfect');
    setDialogMusicalKey('C Major');
    setDialogBpm(120);
    setDialogTimeSignature('4/4');
    setSingerChildVoices({ miranda: false, annelies: false, fannie: false, emma: false });
    setSingerEmotions({ miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' });
    setSingerPrompts({ miranda: '', annelies: '', fannie: '', emma: '' });
    setSingerInstruments({ miranda: [], annelies: [], fannie: [], emma: [] });
    setSingerPartnerUps({ miranda: false, annelies: false, fannie: false, emma: false });
    setAllowFastBpm(false);

    // Also disable all tabs
    setEnabledTabs({
      prompt: true,
      accent: false,
      emotion: false,
      styles: false,
      instruments: false,
      rating: false,
      childVoice: false,
      singers: false,
      singerInstruments: false,
      partnerUp: false,
      selfReflecting: false,
      sfx: false,
      intro: false,
      outro: false,
      lyricsReversal: false,
      innuendoLevel: false,
      epicLevel: false,
      sillyLevel: false,
      rhymeScheme: false,
      musicalKey: false,
      beatsPerMinute: false,
      timeSignature: false,
    });

    if (onClear) {
      onClear();
    }
  };

  const handleConfirmAction = () => {
    setShowSummaryModal(true);
  };
  const executeGeneration = () => {
    onConfirm(
      instructions,
      musicInspiration,
      enabledTabs.accent ? dialogDialectId : '',
      enabledTabs.rating ? dialogRating : 'PG',
      enabledTabs.styles ? selectedGrooves : [],
      enabledTabs.emotion ? dialogEmotionName : '',
      enabledTabs.instruments ? tempSelectedInstruments : [],
      enabledTabs.styles ? tempSelectedStyles : [],
      enabledTabs.childVoice ? dialogChildVoice : false,
      enabledTabs.sfx ? selectedSfx : [],
      enabledTabs.intro ? dialogIntroConfig : { enabled: false, duration: 15, instruments: [] },
      enabledTabs.outro ? dialogOutroConfig : { enabled: false, duration: 15, instruments: [] },
      enabledTabs.selfReflecting ? dialogSelfReflect : false,
      enabledTabs.innuendoLevel ? dialogInnuendoLevel : 0,
      enabledTabs.lyricsReversal ? dialogReverseLyrics : false,
      enabledTabs.epicLevel ? dialogEpicLevel : 0,
      enabledTabs.rhymeScheme ? dialogRhymeId : 'perfect',
      enabledTabs.sillyLevel ? dialogSillyLevel : 0,
      enabledTabs.sapphicLevel ? dialogSapphicLevel : 0,
      enabledTabs.musicalKey ? dialogMusicalKey : 'C Major',
      enabledTabs.beatsPerMinute ? dialogBpm : 120,
      enabledTabs.timeSignature ? dialogTimeSignature : '4/4',
      enabledTabs.childVoice ? singerChildVoices : { miranda: false, annelies: false, fannie: false, emma: false },
      enabledTabs.emotion ? singerEmotions : { miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' },
      enabledTabs.singers ? singerPrompts : { miranda: '', annelies: '', fannie: '', emma: '' },
      enabledTabs.singerInstruments ? singerInstruments : { miranda: [], annelies: [], fannie: [], emma: [] },
      enabledTabs.partnerUp ? singerPartnerUps : { miranda: false, annelies: false, fannie: false, emma: false },
      enabledTabs
    );
    setShowSummaryModal(false);
    onClose();
  };;

  const renderSummaryContent = () => {
    const activeAccentNames = enabledTabs.accent
      ? dialogDialectId.split(',').filter(Boolean).map(id => findDialectById(id)?.name || id).join(', ')
      : null;

    const rhymeName = enabledTabs.rhymeScheme
      ? findRhymeTypeById(dialogRhymeId)?.name || dialogRhymeId
      : null;

    const innuendoStepObj = enabledTabs.innuendoLevel ? getInnuendoStep(dialogInnuendoLevel) : null;
    const epicStepObj = enabledTabs.epicLevel ? getEpicStep(dialogEpicLevel) : null;
    const sillyStepObj = enabledTabs.sillyLevel ? getSillyStep(dialogSillyLevel) : null;
    const sapphicStepObj = enabledTabs.sapphicLevel ? getSapphicStep(dialogSapphicLevel) : null;

    return (
      <div className="flex flex-col h-[74vh] overflow-hidden p-6 font-sans text-lavender-text font-medium select-none bg-black/40 rounded-lg">
        <div className="text-center mb-6 border-b border-lavender-border/40 pb-4 shrink-0">
          <h3 className="text-2xl font-extrabold text-lavender-accent uppercase tracking-wider mb-2">Song Parameters Pre-Generation Review</h3>
          <p className="text-sm text-lavender-text/70">
            Please review the active parameter configurations compiled below. Non-enabled rules and parameters are ignored.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 text-base">
          {/* Main prompt section */}
          <div className="bg-lavender-surface/50 border border-lavender-border/30 rounded-lg p-5 space-y-3">
            <h4 className="text-lg font-extrabold text-lavender-accent border-b border-lavender-border/20 pb-1.5 flex items-center gap-2">
              <Quote size={18} /> Base Song Generation Instructions
            </h4>
            <div>
              <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-1">Instruction Text:</span>
              <p className="p-3 bg-black/40 rounded border border-lavender-border/20 text-md whitespace-pre-wrap leading-relaxed max-h-32 overflow-auto font-sans text-white">
                {instructions || "Empty standard lyrics generation prompt"}
              </p>
            </div>
            {musicInspiration && (
              <div>
                <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5">Musical Artist Inspiration:</span>
                <p className="font-extrabold text-white text-md">"{musicInspiration}"</p>
              </div>
            )}
          </div>

          {/* Grid of enabled parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: Audio & Styles */}
            <div className="bg-lavender-surface/30 border border-lavender-border/20 rounded-lg p-5 space-y-4">
              <h4 className="text-md font-bold text-lavender-accent uppercase tracking-wider border-b border-lavender-border/20 pb-1 flex items-center gap-2">
                <Flame size={16} /> Genre, Styles & Instrumentation
              </h4>

              {enabledTabs.styles && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5">Selected Styles / Genres:</span>
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {tempSelectedStyles.length > 0 ? (
                      tempSelectedStyles.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-lavender-accent/10 border border-lavender-accent/30 text-lavender-accent rounded text-sm font-black">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-lavender-text/50">None selected (using folk acoustic style by default)</span>
                    )}
                  </div>
                </div>
              )}

              {enabledTabs.styles && selectedGrooves.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5">Selected Core Rhythmic Grooves:</span>
                  <div className="flex flex-wrap gap-1 py-1">
                    {selectedGrooves.map((g, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded text-xs font-bold">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {enabledTabs.instruments && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5 font-bold font-sans">Selected Instrumental Tracks:</span>
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {tempSelectedInstruments.length > 0 ? (
                      tempSelectedInstruments.map((inst, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-lavender-accent/10 border border-lavender-accent/30 text-lavender-accent rounded text-sm font-black">
                          {inst}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-lavender-text/50">None selected</span>
                    )}
                  </div>
                </div>
              )}

              {enabledTabs.sfx && selectedSfx.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5">Cinematic Sound Effects:</span>
                  <div className="flex flex-wrap gap-1 py-1">
                    {selectedSfx.map((sfx, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded text-xs font-bold">
                        {sfx}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(!enabledTabs.styles && !enabledTabs.instruments && !enabledTabs.sfx) && (
                <p className="text-sm italic text-lavender-text/40">No instruments, backing tracks, sound effects, or styles enabled.</p>
              )}
            </div>

            {/* Column 2: Cast & Vocals */}
            <div className="bg-lavender-surface/30 border border-lavender-border/20 rounded-lg p-5 space-y-4">
              <h4 className="text-md font-bold text-lavender-accent uppercase tracking-wider border-b border-lavender-border/20 pb-1 flex items-center gap-2">
                <Mic2 size={16} /> Singer Cast, Dialect & Emotion
              </h4>

              {enabledTabs.accent && activeAccentNames && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-0.5">Active Dialects & Accents:</span>
                  <p className="text-md font-bold text-white">{activeAccentNames}</p>
                </div>
              )}

              {enabledTabs.emotion && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block">Core Track Emotion:</span>
                  <p className="text-md font-bold text-white capitalize">{dialogEmotionName}</p>
                  
                  <div className="mt-2 pl-3 border-l-2 border-lavender-accent/30 space-y-1">
                    {Object.entries(singerEmotions).map(([singer, emo]) => (
                      <div key={singer} className="text-xs flex justify-between">
                        <span className="capitalize text-lavender-text/60 font-medium">{singer}:</span>
                        <span className="font-extrabold text-lavender-accent">{emo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {enabledTabs.childVoice && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block">Juvenile Kid Pitch Filter:</span>
                  <p className="text-sm font-bold text-green-400">Enabled (Vocal quartet tuned down to child pitch)</p>
                  <div className="mt-1 pl-3 border-l-2 border-green-500/30 space-y-0.5">
                    {Object.entries(singerChildVoices).map(([singer, isChild]) => (
                      <div key={singer} className="text-xs flex justify-between">
                        <span className="capitalize text-lavender-text/60">{singer}:</span>
                        <span className={`font-bold ${isChild ? 'text-green-400' : 'text-lavender-text/40'}`}>
                          {isChild ? 'Sweet Infant' : 'Adult Soprano'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {enabledTabs.partnerUp && (
                <div>
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase tracking-widest block mb-1">Duet & Harmony Partnering:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(singerPartnerUps).filter(([_, v]) => v).map(([singer]) => (
                      <span key={singer} className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded text-xs capitalize font-bold">
                        {singer}
                      </span>
                    )) || "None Partnered"}
                  </div>
                </div>
              )}

              {(!enabledTabs.accent && !enabledTabs.emotion && !enabledTabs.childVoice && !enabledTabs.partnerUp) && (
                <p className="text-sm italic text-lavender-text/40">No regional dialects, emotions, kid voice, or partnering casting rules active.</p>
              )}
            </div>
          </div>

          {/* Row 3: Structure, Keys, Safeties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left box */}
            <div className="bg-lavender-surface/30 border border-lavender-border/20 rounded-lg p-5 space-y-4">
              <h4 className="text-md font-bold text-lavender-accent uppercase tracking-wider border-b border-lavender-border/20 pb-1 flex items-center gap-2">
                <Music size={16} /> Tempo, Key & Rhythms
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-lavender-text/50 uppercase block">Scale Key</span>
                  <span className="text-sm font-black text-white">{enabledTabs.musicalKey ? dialogMusicalKey : "Disabled"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-lavender-text/50 uppercase block">Beats (BPM)</span>
                  <span className="text-sm font-black text-white">{enabledTabs.beatsPerMinute ? `${dialogBpm} BPM` : "Disabled"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-lavender-text/50 uppercase block">Time Meter</span>
                  <span className="text-sm font-black text-white">{enabledTabs.timeSignature ? dialogTimeSignature : "Disabled"}</span>
                </div>
              </div>

              {/* Intro Configuration */}
              {enabledTabs.intro && dialogIntroConfig.enabled && (
                <div className="border-t border-lavender-border/20 pt-2 text-sm">
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase block">Instrumental Intro:</span>
                  <p className="text-xs text-white leading-relaxed">
                    Duration: <span className="font-bold">{dialogIntroConfig.duration}s</span> | Featured: <span className="text-lavender-accent font-black">
                      {dialogIntroConfig.instruments.length > 0 ? dialogIntroConfig.instruments.join(', ') : 'Theme ensemble'}
                    </span>
                  </p>
                </div>
              )}

              {/* Outro Configuration */}
              {enabledTabs.outro && dialogOutroConfig.enabled && (
                <div className="border-t border-lavender-border/20 pt-2 text-sm">
                  <span className="text-xs font-bold text-lavender-accent/60 uppercase block">Instrumental Outro:</span>
                  <p className="text-xs text-white leading-relaxed">
                    Duration: <span className="font-bold">{dialogOutroConfig.duration}s</span> | Featured: <span className="text-lavender-accent font-black">
                      {dialogOutroConfig.instruments.length > 0 ? dialogIntroConfig.instruments.join(', ') : 'Theme ensemble'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Right box */}
            <div className="bg-lavender-surface/30 border border-lavender-border/20 rounded-lg p-5 space-y-4">
              <h4 className="text-md font-bold text-lavender-accent uppercase tracking-wider border-b border-lavender-border/20 pb-1 flex items-center gap-2">
                <Sliders size={16} /> Creative Sliders, Safety & Poetics
              </h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {enabledTabs.innuendoLevel && innuendoStepObj && (
                  <div>
                    <span className="text-xs font-bold text-lavender-text/50 uppercase block">Sensual Innuendo</span>
                    <span className="text-sm font-black text-lavender-accent capitalize">{innuendoStepObj.label}</span>
                  </div>
                )}
                {enabledTabs.epicLevel && epicStepObj && (
                  <div>
                    <span className="text-xs font-bold text-lavender-text/50 uppercase block">Drama Epicness</span>
                    <span className="text-sm font-black text-lavender-accent capitalize">{epicStepObj.label}</span>
                  </div>
                )}
                {enabledTabs.sillyLevel && sillyStepObj && (
                  <div>
                    <span className="text-xs font-bold text-lavender-text/50 uppercase block">Silly Whimsicality</span>
                    <span className="text-sm font-black text-lavender-accent capitalize">{sillyStepObj.label}</span>
                  </div>
                )}
                {enabledTabs.sapphicLevel && sapphicStepObj && (
                  <div>
                    <span className="text-xs font-bold text-lavender-text/50 uppercase block">Sapphic & Lesbian Focus</span>
                    <span className="text-sm font-black text-lavender-accent capitalize">{sapphicStepObj.label}</span>
                  </div>
                )}
                {enabledTabs.rhymeScheme && rhymeName && (
                  <div>
                    <span className="text-xs font-bold text-lavender-text/50 uppercase block">Rhyme Poetic Rule</span>
                    <span className="text-sm font-black text-lavender-accent capitalize">{rhymeName}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-lavender-border/20 pt-2 text-sm grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-bold text-lavender-text/50 uppercase block">Active Safety Rating</span>
                  <span className="text-sm font-bold text-white capitalize">{enabledTabs.rating ? dialogRating : "PG Defaults"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-lavender-text/50 uppercase block">Self-Reflective Lyrics</span>
                  <span className={`text-sm font-bold ${dialogSelfReflect ? 'text-green-400' : 'text-red-400'}`}>
                    {enabledTabs.selfReflecting ? (dialogSelfReflect ? "Allowed" : "Blocked") : "PG Default (Yes)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // INNER TABS CONFIGURATION LOGIC

  // 1. Accent Search/Groups
  const [accentGroupId, setAccentGroupId] = useState('english');
  const [accentSearch, setAccentSearch] = useState('');
  const accentParsedIds = useMemo(() => dialogDialectId ? dialogDialectId.split(',').filter(Boolean) : [], [dialogDialectId]);
  
  const activeAccentGroup = LANGUAGE_GROUPS.find(g => g.id === accentGroupId) || LANGUAGE_GROUPS[0];
  const filteredAccents = useMemo(() => {
    if (accentSearch.trim() !== '') {
      return LANGUAGE_GROUPS.flatMap(g => g.dialects).filter(d => 
        d.name.toLowerCase().includes(accentSearch.toLowerCase()) || d.description.toLowerCase().includes(accentSearch.toLowerCase())
      );
    }
    return activeAccentGroup?.dialects || [];
  }, [accentSearch, activeAccentGroup]);

  const handleToggleAccent = (dialectId: string) => {
    if (accentParsedIds.includes(dialectId)) {
      const next = accentParsedIds.filter(id => id !== dialectId);
      setDialogDialectId(next.join(','));
    } else {
      if (accentParsedIds.length >= 4) return;
      const next = [...accentParsedIds, dialectId];
      setDialogDialectId(next.join(','));
    }
  };

  const handleMoveAccentUp = (index: number) => {
    if (index === 0) return;
    const next = [...accentParsedIds];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setDialogDialectId(next.join(','));
  };

  const handleMoveAccentDown = (index: number) => {
    if (index === accentParsedIds.length - 1) return;
    const next = [...accentParsedIds];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setDialogDialectId(next.join(','));
  };

  // 2. Emotion Categories
  const EMOTION_CATEGORIES = [
    { id: 'happy', name: 'Happy & Uplifting', icon: <Smile size={13} />, emotionIds: ['joyful', 'ecstatic', 'euphoric', 'energetic', 'excited', 'playful', 'proud', 'whimsical', 'inspired'] },
    { id: 'triumph', name: 'Triumph & Conquest', icon: <Trophy size={13} />, emotionIds: ['victory', 'triumphant', 'glorious', 'heroic'] },
    { id: 'sensual', name: 'Sensual & Passion', icon: <Heart size={13} />, emotionIds: ['sensual', 'erotic', 'seductive', 'passionate', 'romantic'] },
    { id: 'calm', name: 'Peaceful & Serene', icon: <Globe size={13} />, emotionIds: ['peaceful', 'hopeful', 'serene', 'dreamy', 'compassionate', 'grateful', 'relieved', 'content', 'empathetic'] },
    { id: 'sad', name: 'Sad & Nostalgic', icon: <Coffee size={13} />, emotionIds: ['sad', 'melancholic', 'nostalgic', 'despondent', 'gloomy', 'lonely', 'somber', 'heartbroken', 'vulnerable'] },
    { id: 'defeat', name: 'Defeat & Loss', icon: <Frown size={13} />, emotionIds: ['defeat', 'mournful', 'crushed', 'desolate', 'disillusioned'] },
    { id: 'angry', name: 'Angry & Hostile', icon: <Flame size={13} />, emotionIds: ['angry', 'annoyed', 'resentful', 'hostile', 'frustrated', 'bitter', 'melodramatic', 'nostalgic_bitter', 'cynical', 'skeptical', 'jealous'] },
    { id: 'intense', name: 'Anxious & Mystical', icon: <Sparkles size={13} />, emotionIds: ['anxious', 'terrified', 'overwhelmed', 'mystical', 'cosmic', 'transcendent', 'haunting'] },
    { id: 'neutral', name: 'Flat & Patient', icon: <Zap size={13} />, emotionIds: ['bored', 'apathetic'] }
  ];

  const [emotionGroupId, setEmotionGroupId] = useState('happy');
  const [emotionSearch, setEmotionSearch] = useState('');
  const activeEmotionCategory = EMOTION_CATEGORIES.find(c => c.id === emotionGroupId) || EMOTION_CATEGORIES[0];
  const filteredEmotions = useMemo(() => {
    if (emotionSearch.trim() !== '') {
      return SONG_EMOTIONS.filter(e => e.name.toLowerCase().includes(emotionSearch.toLowerCase()) || e.description.toLowerCase().includes(emotionSearch.toLowerCase()));
    }
    return SONG_EMOTIONS.filter(e => activeEmotionCategory.emotionIds.includes(e.id));
  }, [emotionSearch, activeEmotionCategory]);

  // 3. Styles & Grooves Unified Filter layout
  const [styleGroupId, setStyleGroupId] = useState('');
  const [styleSearch, setStyleSearch] = useState('');
  // Attribute Filters State
  const [loudnessFilter, setLoudnessFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [bassFilter, setBassFilter] = useState<'all' | 'heavy' | 'medium' | 'none'>('all');
  const [tempoFilter, setTempoFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all');
  const [vibeFilter, setVibeFilter] = useState<'all' | 'dark' | 'bright' | 'weird' | 'neutral'>('all');

  const unifiedStyleGroups = useMemo(() => {
    const styleGroups = STYLES.map(s => ({
      id: `style-${s.type}`,
      name: s.type,
      type: 'style',
      description: 'Select one or more genre-specific style settings.',
      items: [...s.substyles].map(sub => ({ name: sub.name, description: sub.description })).sort((a, b) => a.name.localeCompare(b.name))
    }));

    const grooveData = getGroupedAndSortedGrooves();
    const grooveGroups = GROOVE_CATEGORIES.map(cat => ({
      id: `groove-${cat.id}`,
      name: cat.name,
      type: 'groove',
      description: cat.description,
      items: (grooveData[cat.id] || []).map(name => {
        const tooltip = GROOVE_TOOLTIPS[name] || { desc: 'Dynamic beat and delivery style.', vibe: 'Creative' };
        return { name, description: tooltip.desc, vibe: tooltip.vibe };
      }).sort((a, b) => a.name.localeCompare(b.name))
    }));

    return [...styleGroups, ...grooveGroups].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    if (unifiedStyleGroups.length > 0 && !styleGroupId) {
      setStyleGroupId(unifiedStyleGroups[0].id);
    }
  }, [unifiedStyleGroups, styleGroupId]);

  const activeStyleGroup = unifiedStyleGroups.find(g => g.id === styleGroupId) || unifiedStyleGroups[0];

  const styleCandidates = useMemo(() => {
    if (styleSearch.trim() === '') {
      if (!activeStyleGroup) return [];
      return activeStyleGroup.items.map(item => ({ ...item, type: activeStyleGroup.type }));
    }
    const results: any[] = [];
    unifiedStyleGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.name.toLowerCase().includes(styleSearch.toLowerCase()) || item.description.toLowerCase().includes(styleSearch.toLowerCase())) {
          results.push({ ...item, groupName: group.name, type: group.type });
        }
      });
    });
    return results;
  }, [styleSearch, activeStyleGroup, unifiedStyleGroups]);

  const filteredStyleItems = useMemo(() => {
    return styleCandidates.filter(item => {
      const attrs = getLocalAttributes(item.name, item.description, item.type);
      if (loudnessFilter !== 'all' && attrs.loudness !== loudnessFilter) return false;
      if (bassFilter !== 'all' && attrs.bass !== bassFilter) return false;
      if (tempoFilter !== 'all' && attrs.tempo !== tempoFilter) return false;
      if (vibeFilter !== 'all' && attrs.vibe !== vibeFilter) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [styleCandidates, loudnessFilter, bassFilter, tempoFilter, vibeFilter]);

  const handleToggleStyleItem = (name: string, itemType: 'style' | 'groove') => {
    if (itemType === 'style') {
      setTempSelectedStyles(prev =>
        prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
      );
    } else {
      if (selectedGrooves.includes(name)) {
        setSelectedGrooves(prev => prev.filter(g => g !== name));
      } else {
        if (selectedGrooves.length >= 5) return;
        setSelectedGrooves(prev => [...prev, name]);
      }
    }
  };

  const renderStyleBadges = (name: string, description: string, itemType: 'style' | 'groove') => {
    const attrs = getLocalAttributes(name, description, itemType);
    const badges = [];
    if (attrs.loudness === 'high') badges.push({ text: 'Loud', bg: 'bg-red-500/10 text-red-400 border-red-500/20' });
    else if (attrs.loudness === 'low') badges.push({ text: 'Quiet', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' });
    if (attrs.bass === 'heavy') badges.push({ text: 'Heavy Bass', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' });
    else if (attrs.bass === 'none') badges.push({ text: 'Acoustic', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' });
    if (attrs.tempo === 'fast') badges.push({ text: 'Fast Tempo', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' });
    else if (attrs.tempo === 'slow') badges.push({ text: 'Slow Space', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' });
    if (attrs.vibe === 'dark') badges.push({ text: 'Dark Vibe', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' });
    else if (attrs.vibe === 'bright') badges.push({ text: 'Bright Vibe', bg: 'bg-yellow-500/10 text-yellow-500/90 border-yellow-500/20' });
    else if (attrs.vibe === 'weird') badges.push({ text: 'Avant-Garde', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' });

    if (badges.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-lavender-border/10">
        {badges.map((b, idx) => (
          <span key={idx} className={`text-[8.5px] font-black px-1 py-0.2 rounded border uppercase tracking-wide ${b.bg}`}>{b.text}</span>
        ))}
      </div>
    );
  };


  // 4. Instruments Search/Categories
  const [instrumentGroupId, setInstrumentGroupId] = useState('');
  const [instrumentSearch, setInstrumentSearch] = useState('');
  const sortedInstrumentGroups = useMemo(() => {
    return [...INSTRUMENTS]
      .sort((a, b) => a.type.localeCompare(b.type))
      .map(group => ({
        ...group,
        instruments: [...group.instruments].sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, []);

  useEffect(() => {
    if (sortedInstrumentGroups.length > 0 && !instrumentGroupId) {
      setInstrumentGroupId(sortedInstrumentGroups[0].type);
    }
  }, [sortedInstrumentGroups, instrumentGroupId]);

  const activeInstrumentGroup = sortedInstrumentGroups.find(g => g.type === instrumentGroupId) || sortedInstrumentGroups[0];
  const filteredInstruments = useMemo(() => {
    if (instrumentSearch.trim() === '') {
      return activeInstrumentGroup?.instruments || [];
    }
    const results: any[] = [];
    sortedInstrumentGroups.forEach(g => {
      g.instruments.forEach(inst => {
        if (inst.name.toLowerCase().includes(instrumentSearch.toLowerCase()) || inst.description.toLowerCase().includes(instrumentSearch.toLowerCase())) {
          results.push({ ...inst, groupName: g.type });
        }
      });
    });
    return results;
  }, [instrumentSearch, activeInstrumentGroup, sortedInstrumentGroups]);


  // 5. Sound Effects Search/Categories
  const [sfxGroupId, setSfxGroupId] = useState('');
  const [sfxSearch, setSfxSearch] = useState('');
  const processedSfxGroups = useMemo(() => {
    return [...SOUND_EFFECTS].map(group => ({
      ...group,
      effects: [...group.effects].sort((a, b) => a.name.localeCompare(b.name))
    }));
  }, []);

  useEffect(() => {
    if (processedSfxGroups.length > 0 && !sfxGroupId) {
      setSfxGroupId(processedSfxGroups[0].type);
    }
  }, [processedSfxGroups, sfxGroupId]);

  const activeSfxGroup = processedSfxGroups.find(g => g.type === sfxGroupId) || processedSfxGroups[0];
  const filteredSfx = useMemo(() => {
    if (sfxSearch.trim() === '') {
      return activeSfxGroup?.effects || [];
    }
    const results: any[] = [];
    processedSfxGroups.forEach(g => {
      g.effects.forEach(eff => {
        if (eff.name.toLowerCase().includes(sfxSearch.toLowerCase()) || eff.description.toLowerCase().includes(sfxSearch.toLowerCase())) {
          results.push({ ...eff, groupName: g.type });
        }
      });
    });
    return results;
  }, [sfxSearch, activeSfxGroup, processedSfxGroups]);


  // 6. INTRO / OUTRO SEGMENTS INSTRUMENT CATS
  const INTRO_OUTRO_INSTRUMENTS = [
    { category: "Strings & Harps", instruments: ["Crwth", "Violin", "Cello", "Acoustic Guitar", "Harp", "Lute", "Viola", "Mandolin", "Double Bass", "Guitarrón", "Balalaika", "Bouzouki", "Banjo", "Sitar", "Shamisen", "Guzheng"] },
    { category: "Brass", instruments: ["Trumpet", "Trombone", "French Horn", "Tuba", "Bugle", "Cornet", "Euphonium", "Mellophone", "Sousaphone", "Sackbut", "Shofar", "Didgeridoo"] },
    { category: "Bagpipes & Reeds", instruments: ["Bagpipes", "Uilleann Pipes", "Accordion", "Harmonica", "Clarinet", "Great Highland Bagpipe", "Northumbrian Smallpipes", "Sheng", "Kena", "Oboe", "English Horn", "Bassoon"] },
    { category: "Drums & Percussion", instruments: ["Drums", "Snare Drum", "Bass Drum", "Timpani", "Hand Drums", "Tambourine", "Taiko", "Cajón", "Congas", "Bongos", "Djembe", "Tabla", "Darabuka", "Frame Drum", "Bodhrán", "Shakers"] },
    { category: "Woodwinds & Keys", instruments: ["Flute", "Recorder", "Piano", "Harpsichord", "Synthesizer", "Organ", "Fife", "Ocarina", "Pan Flute", "Xiao", "Shakuhachi", "Ney", "Celesta", "Clavinet", "Mellotron"] },
    { category: "Ethnic & Folk Winds", instruments: ["Kaval", "Surna", "Bawu", "Native American Flute", "Duduk", "Tin Whistle", "Fujara", "Mijwiz", "Siku"] },
    { category: "Modern & Cinematic FX", instruments: ["Ambient Drone Synth", "Sub-Bass Drop", "Cinematic Strings Rise", "Analog White Noise", "808 Sub Boom", "Glitch Plucks", "Granular Textures", "Tape Lo-fi Crackle"] },
    { category: "Orchestral Mallets", instruments: ["Marimba", "Xylophone", "Vibraphone", "Glockenspiel", "Tubular Bells", "Crotales", "Steel Drums", "Kalimba", "Music Box"] }
  ];

  const [introSfxGroup, setIntroSfxGroup] = useState('Strings & Harps');
  const [outroSfxGroup, setOutroSfxGroup] = useState('Strings & Harps');


  // 7. Rhyme Scheme Groups
  const [rhymeGroupId, setRhymeGroupId] = useState('classical');
  const [rhymeSearch, setRhymeSearch] = useState('');
  const activeRhymeGroup = RHYME_CATEGORIES.find(c => c.id === rhymeGroupId) || RHYME_CATEGORIES[0];
  const filteredRhyming = useMemo(() => {
    if (rhymeSearch.trim() !== '') {
      return RHYME_TYPES.filter(r => r.name.toLowerCase().includes(rhymeSearch.toLowerCase()) || r.description.toLowerCase().includes(rhymeSearch.toLowerCase()));
    }
    return RHYME_TYPES.filter(r => activeRhymeGroup.rhymeIds.includes(r.id));
  }, [rhymeSearch, activeRhymeGroup]);


  // RENDERING COMPONENT HELPERS BASED ON ACTIVE TAB KEY
  const renderRightPanelContent = () => {
    const isCurrentTabEnabled = enabledTabs[activeTabId];

    // Check enable/disable helper banner for active tab (if tab is disableable)
    const renderEnableHeader = (title: string, desc: string, targetId: string) => {
      const isEnabled = enabledTabs[targetId];
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-lavender-surface/20 border border-lavender-border/40 rounded-xl mb-4 shrink-0 shadow-sm relative">
          <div>
            <h3 className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider flex items-center gap-2">
              {title}
            </h3>
            <p className="text-[11px] text-lavender-text/50 font-medium tracking-tight mt-0.5">{desc}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleTabEnabled(targetId)}
            className={`px-4 py-2 text-xs font-black rounded-lg border transition-all cursor-pointer shadow flex items-center gap-1.5 ${
              isEnabled 
                ? 'bg-green-500/15 border-green-500 text-green-400' 
                : 'bg-lavender-surface border-lavender-border/40 text-lavender-text/55 hover:border-lavender-accent/40'
            }`}
          >
            {isEnabled ? <CheckCircle size={13} /> : <div className="w-3 h-3 rounded-full border border-lavender-text/50 shrink-0" />}
            {isEnabled ? 'Enabled & Injecting' : 'Disabled (Will be ignored)'}
          </button>
        </div>
      );
    };

    const maybeOverlayDisabled = (children: React.ReactNode, id: string) => {
      if (id === 'prompt') return children;
      const isEnabled = enabledTabs[id];
      if (!isEnabled) {
        return (
          <div className="relative flex-1 flex flex-col h-full min-h-[30vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col justify-center items-center p-6 text-center rounded-xl border border-lavender-border/10">
              <Sparkles size={36} className="text-lavender-accent/40 mb-3 animate-pulse-subtle" />
              <h4 className="text-sm font-extrabold text-lavender-accent uppercase tracking-widest mb-1">Setting is Turned Off</h4>
              <p className="text-[11px] text-lavender-text/50 max-w-sm font-medium leading-relaxed mb-4">
                This configuration option is currently ignored. Turn it on to configure and inject it into your generated lyrics!
              </p>
              <button
                type="button"
                onClick={() => toggleTabEnabled(id)}
                className="px-4 py-2 bg-lavender-accent text-black font-black text-xs rounded-lg shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                Enable setting now
              </button>
            </div>
            <div className="flex-1 opacity-25 pointer-events-none select-none overflow-hidden h-full">
              {children}
            </div>
          </div>
        );
      }
      return children;
    };

    switch (activeTabId) {
      case 'prompt':
        return (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-1 b-2">
              <h3 className="text-sm font-extrabold text-lavender-accent uppercase tracking-widest flex items-center gap-1.5">
                1. Lyrics Instructions & Prompt
              </h3>
              <p className="text-[11px] text-lavender-text/50 font-semibold italic">Topic, structure, prompt directives inside a custom single view. Always active.</p>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-[40vh]">
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-1">
                  Lyrics Guidelines & Song Instructions
                </span>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="E.g. Compose an uplifting heavy-metal ballad about a software developer fixing memory leaks at 3:00 AM on a Friday night..."
                  className="w-full flex-1 min-h-[22vh] p-3.5 bg-lavender-surface border border-lavender-border text-lavender-text text-xs focus:outline-none focus:border-lavender-accent rounded-lg font-bold placeholder:text-lavender-text/25 font-mono leading-relaxed"
                />
              </div>

              <div className="shrink-0 flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">
                  Musical / Artist Inspiration Reference
                </span>
                <input
                  type="text"
                  value={musicInspiration}
                  onChange={(e) => setMusicInspiration(e.target.value)}
                  placeholder="E.g. Evanescence, Nightwish, Avenged Sevenfold, melodic symphonic metal keys"
                  className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2.5 px-3.5 text-xs focus:outline-none focus:border-lavender-accent font-bold placeholder:text-lavender-text/25 font-mono"
                />
              </div>
            </div>
          </div>
        );
      case 'vocalAccentTone':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg">
              <button
                type="button"
                onClick={() => setAccentToneSubTab('accent')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer ${accentToneSubTab === 'accent' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Vocal regional accents
              </button>
              <button
                type="button"
                onClick={() => setAccentToneSubTab('emotion')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer ${accentToneSubTab === 'emotion' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Singer performance emotions
              </button>
            </div>

            {accentToneSubTab === 'accent' ? (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Vocal Accent regional dialect constraints", "Enable up to 4 priority regional accents or fictional languages", "accent")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                    {/* Accent Groups Sidebar */}
                    {accentSearch.trim() === '' && (
                      <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[14vh] lg:max-h-none space-y-1">
                        <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-wider block mb-1">Groups</span>
                        {LANGUAGE_GROUPS.map((group) => (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => setAccentGroupId(group.id)}
                            className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                              group.id === accentGroupId ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                            }`}
                          >
                            <span className="truncate">{group.name}</span>
                            <span className="text-[8px] font-mono opacity-65">{group.dialects.length}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Dialects Grid Selection */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="relative mb-3 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                        <input
                          type="text"
                          placeholder="Search accents (e.g. Dutch, Singlish, Viking, Angelic)..."
                          value={accentSearch}
                          onChange={(e) => setAccentSearch(e.target.value)}
                          className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-lavender-accent font-bold"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1">
                        {filteredAccents.map((dialect) => {
                          const idx = accentParsedIds.indexOf(dialect.id);
                          const isSel = idx !== -1;
                          return (
                            <button
                              key={dialect.id}
                              type="button"
                              onClick={() => handleToggleAccent(dialect.id)}
                              className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                isSel ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent' : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2.5 w-full">
                                <span className="font-extrabold text-xs truncate">{dialect.name}</span>
                                {isSel && (
                                  <span className="bg-lavender-accent text-black rounded-full font-mono font-black text-[10px] w-5 h-5 flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-lavender-text/65 mt-1 line-clamp-2 leading-relaxed">{dialect.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Priority Selection Sidepanel */}
                    <div className="w-full lg:w-60 shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-lavender-border/20 pt-3 lg:pt-0 lg:pl-3 overflow-y-auto">
                      <span className="text-xs font-extrabold text-lavender-accent tracking-wider block mb-1">Selected Accents ({accentParsedIds.length}/4)</span>
                      <p className="text-[10px] text-lavender-text/50 leading-relaxed mb-3">Re-order accents with arrows. The 1st is the primary language.</p>
                      
                      <div className="space-y-1.5 flex-1 h-[20vh] min-h-[15vh]">
                        {accentParsedIds.map((id, index) => {
                          const dialect = findDialectById(id);
                          return (
                            <div key={id} className={`flex items-center justify-between gap-1.5 p-2 bg-lavender-surface/55 border border-lavender-border/30 rounded-lg ${index === 0 ? 'border-lavender-accent bg-lavender-accent/5' : ''}`}>
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-black tracking-widest text-lavender-accent">#{index + 1}</span>
                                <span className="text-[11px] font-black text-lavender-text truncate block">{dialect.name}</span>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <button type="button" disabled={index === 0} onClick={() => handleMoveAccentUp(index)} className="p-1 rounded hover:bg-lavender-surface text-lavender-text/60 disabled:opacity-20"><ArrowUp size={11} /></button>
                                <button type="button" disabled={index === accentParsedIds.length - 1} onClick={() => handleMoveAccentDown(index)} className="p-1 rounded hover:bg-lavender-surface text-lavender-text/60 disabled:opacity-20"><ArrowDown size={11} /></button>
                                <button type="button" onClick={() => handleToggleAccent(id)} className="p-1 rounded hover:bg-red-500/10 text-red-400"><X size={11} /></button>
                              </div>
                            </div>
                          );
                        })}
                        {accentParsedIds.length === 0 && <p className="text-xs italic text-lavender-text/30 text-center py-6">No accent selected.</p>}
                      </div>
                    </div>
                  </div>,
                  'accent'
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Track Emotion Coloring", "Colors singing performance and vocal speed styling, tailored for each singer.", "emotion")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                    {/* Singers selection for emotion */}
                    <div className="flex flex-wrap gap-2.5 shrink-0">
                      {singersMeta.map((s) => {
                        const isCurrent = s.id === activeEmotionSinger;
                        const singerEmotion = singerEmotions[s.id] || 'Joyful';
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveEmotionSinger(s.id as any)}
                            className={`flex-1 min-w-[124px] p-2.5 rounded-xl border text-left transition-all ${
                              isCurrent 
                                ? 'bg-lavender-accent text-black border-lavender-accent font-extrabold shadow-md' 
                                : 'bg-lavender-surface/40 hover:bg-lavender-surface border-lavender-border text-lavender-text font-bold'
                            }`}
                          >
                            <div className="text-[10px] opacity-75 uppercase tracking-wider">{s.name} ({s.voice})</div>
                            <div className="text-xs mt-1 truncate font-extrabold text-black/90">
                              {isCurrent ? <span className="text-black font-extrabold">{singerEmotion}</span> : <span className="text-lavender-accent font-extrabold">{singerEmotion}</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-0">
                      {/* Categories */}
                      {emotionSearch.trim() === '' && (
                        <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[14vh] lg:max-h-none space-y-1">
                          <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-wider block mb-1">Emotion Types</span>
                          {EMOTION_CATEGORIES.map(category => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => setEmotionGroupId(category.id)}
                              className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                category.id === emotionGroupId ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                              }`}
                            >
                              <span className="flex items-center gap-1.5 truncate">{category.icon} {category.name}</span>
                              <span className="text-[8px] font-bold opacity-65">{category.emotionIds.length}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Emotions Selection Area */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="relative mb-3 shrink-0">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                          <input
                            type="text"
                            placeholder="Search emotions (e.g. ecstatic, melancholy, somber, cynical)..."
                            value={emotionSearch}
                            onChange={(e) => setEmotionSearch(e.target.value)}
                            className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-lavender-accent font-bold"
                          />
                        </div>

                        <div className="flex text-xs font-extrabold text-lavender-accent uppercase tracking-widest px-1 mb-2">
                          Active Emotion for <strong className="text-white ml-1.5 mx-1">{singersMeta.find(s => s.id === activeEmotionSinger)?.name}</strong>: 
                          <strong className="text-white ml-1.5">{singerEmotions[activeEmotionSinger] || 'Joyful'}</strong>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1">
                          {filteredEmotions.map((emotion) => {
                            const currentSingerEmotion = singerEmotions[activeEmotionSinger] || 'Joyful';
                            const isSelected = emotion.name.toLowerCase() === currentSingerEmotion.toLowerCase();
                            return (
                              <button
                                key={emotion.id}
                                type="button"
                                onClick={() => {
                                  setSingerEmotions(prev => ({ ...prev, [activeEmotionSinger]: emotion.name }));
                                  if (activeEmotionSinger === 'miranda') {
                                    setDialogEmotionName(emotion.name);
                                  }
                                }}
                                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                  isSelected ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                                }`}
                              >
                                <span className="font-extrabold text-xs flex items-center gap-1 mt-0.5 truncate">{emotion.name}</span>
                                <p className="text-[10px] text-lavender-text/65 mt-1 line-clamp-2 leading-relaxed font-semibold">{emotion.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>,
                  'emotion'
                )}
              </div>
            )}
          </div>
        );

      case 'composer':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg">
              <button
                type="button"
                onClick={() => setComposerSubTab('styles')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer ${composerSubTab === 'styles' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Genre Styles & Grooves
              </button>
              <button
                type="button"
                onClick={() => setComposerSubTab('instruments')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer ${composerSubTab === 'instruments' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Band Instruments
              </button>
            </div>

            {composerSubTab === 'styles' ? (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Genre Styles & Core Grooves Configuration", "Apply genres and rhythms with high contrast attribute filters", "styles")}
                {maybeOverlayDisabled(
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Attributes filter block */}
                    <div className="flex flex-wrap items-center gap-3 mb-3 p-3 bg-lavender-surface/25 border border-lavender-border/40 rounded-xl shrink-0">
                      <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest">Filter Attributes:</span>
                      <div className="flex select-none gap-3 flex-wrap">
                        <select value={loudnessFilter} onChange={e => setLoudnessFilter(e.target.value as any)} className="bg-lavender-surface text-[10.5px] border border-lavender-border rounded p-1 font-bold">
                          <option value="all">Loudness (Any)</option>
                          <option value="high">Loud / Metal</option>
                          <option value="low">Quiet / Ambient</option>
                        </select>
                        <select value={bassFilter} onChange={e => setBassFilter(e.target.value as any)} className="bg-lavender-surface text-[10.5px] border border-lavender-border rounded p-1 font-bold">
                          <option value="all">Bass (Any)</option>
                          <option value="heavy">Heavy Beats</option>
                          <option value="none">Acoustic Only</option>
                        </select>
                        <select value={tempoFilter} onChange={e => setTempoFilter(e.target.value as any)} className="bg-lavender-surface text-[10.5px] border border-lavender-border rounded p-1 font-bold">
                          <option value="all">Tempo (Any)</option>
                          <option value="fast">Fast & Live</option>
                          <option value="slow">Slow & Slow</option>
                        </select>
                        <select value={vibeFilter} onChange={e => setVibeFilter(e.target.value as any)} className="bg-lavender-surface text-[10.5px] border border-lavender-border rounded p-1 font-bold">
                          <option value="all">Vibe (Any)</option>
                          <option value="bright">Bright & Light</option>
                          <option value="dark">Dark & Gothic</option>
                          <option value="weird">Experimental</option>
                        </select>
                      </div>
                      {(loudnessFilter !== 'all' || bassFilter !== 'all' || tempoFilter !== 'all' || vibeFilter !== 'all') && (
                        <button type="button" onClick={() => { setLoudnessFilter('all'); setBassFilter('all'); setTempoFilter('all'); setVibeFilter('all'); }} className="px-2 py-0.5 bg-lavender-accent/15 border border-lavender-accent/30 text-lavender-accent rounded text-[10px] font-black uppercase">Clear</button>
                      )}
                    </div>

                    {/* Styles selection flex contents */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
                      {/* Families sidebar */}
                      {styleSearch.trim() === '' && (
                        <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[120px] lg:max-h-none space-y-0.5">
                          <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Families</span>
                          {unifiedStyleGroups.map(group => {
                            const count = group.type === 'style' 
                              ? group.items.filter(item => tempSelectedStyles.includes(item.name)).length
                              : group.items.filter(item => selectedGrooves.includes(item.name)).length;
                            return (
                              <button
                                key={group.id}
                                type="button"
                                onClick={() => setStyleGroupId(group.id)}
                                className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                  group.id === styleGroupId ? 'bg-lavender-accent text-black font-extrabold font-black' : 'hover:bg-lavender-surface text-lavender-text/80'
                                }`}
                              >
                                <span className="truncate">{group.name}</span>
                                {count > 0 && <span className="text-[9px] bg-lavender-accent text-black font-black px-1.5 py-0.2 rounded-full leading-none">{count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* List / Grid items */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="relative mb-2.5 shrink-0">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                          <input
                            type="text"
                            placeholder="Search styles, tempos, grooves (e.g. Synth-Pop, Braggadocio, Techno)..."
                            value={styleSearch}
                            onChange={(e) => setStyleSearch(e.target.value)}
                            className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-lavender-accent"
                          />
                        </div>

                        <div className="flex gap-2 text-[10px] uppercase font-extrabold text-lavender-text/50 tracking-wider mb-2 shrink-0">
                          <span>Genres: <strong className="text-lavender-accent font-black">{tempSelectedStyles.length}</strong></span>
                          <span className="ml-2">Grooves: <strong className="text-lavender-accent font-black">{selectedGrooves.length} / 5</strong></span>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1 pb-2">
                          {filteredStyleItems.map(item => {
                            const isStyle = item.type === 'style';
                            const isSelected = isStyle ? tempSelectedStyles.includes(item.name) : selectedGrooves.includes(item.name);
                            const limitReached = !isStyle && selectedGrooves.length >= 5 && !isSelected;

                            return (
                              <button
                                key={item.name}
                                type="button"
                                disabled={limitReached}
                                onClick={() => handleToggleStyleItem(item.name, item.type)}
                                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' 
                                    : limitReached 
                                    ? 'bg-lavender-surface/10 border-lavender-border/20 text-lavender-text/30 cursor-not-allowed opacity-50' 
                                    : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 w-full shrink-0">
                                  <span className="font-extrabold text-xs flex items-center gap-1.5 truncate">
                                    {isStyle ? <Flame size={12} className="opacity-75" /> : <Music size={12} className="opacity-75" />}
                                    {item.name}
                                  </span>
                                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-lavender-accent border-lavender-accent text-black' : 'border-lavender-border/70'}`}>
                                    {isSelected && <Check size={10} strokeWidth={4} />}
                                  </div>
                                </div>
                                <span className="text-[8px] bg-lavender-surface border border-lavender-border/30 text-lavender-text/50 font-bold px-1.5 py-0.2 rounded font-mono w-max mt-1">{isStyle ? 'GENRE STYLE' : 'CORE BEAT'}</span>
                                {renderStyleBadges(item.name, item.description, item.type)}
                                <p className="text-[10px] text-lavender-text/60 mt-1.5 line-clamp-2 leading-relaxed font-semibold">{item.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>,
                  'styles'
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Band Instruments", "Add explicit instruments and performance solo elements directly", "instruments")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                    {/* Search / Families select list on left */}
                    {instrumentSearch.trim() === '' && (
                      <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[120px] lg:max-h-none space-y-0.5">
                        <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Families</span>
                        {sortedInstrumentGroups.map(g => {
                          const count = g.instruments.filter(x => tempSelectedInstruments.includes(x.name)).length;
                          return (
                            <button
                              key={g.type}
                              type="button"
                              onClick={() => setInstrumentGroupId(g.type)}
                              className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                g.type === instrumentGroupId ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                              }`}
                            >
                              <span className="truncate">{g.type}</span>
                              {count > 0 && <span className="text-[9px] bg-lavender-accent text-black font-black px-1.5 py-0.2 rounded-full leading-none">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Central instruments panel */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="relative mb-2.5 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                        <input
                          type="text"
                          placeholder="Search instruments (e.g. Theremin, Double-kick drums, Bagpipes, Acoustic Harp)..."
                          value={instrumentSearch}
                          onChange={(e) => setInstrumentSearch(e.target.value)}
                          className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-lavender-accent"
                        />
                      </div>

                      <div className="flex text-xs font-extrabold text-lavender-accent uppercase tracking-widest px-1 mb-2">
                        Total Selection: <strong className="text-white ml-1.5">{tempSelectedInstruments.length} selected</strong>
                      </div>

                      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1 pb-2">
                        {filteredInstruments.map(inst => {
                          const isSel = tempSelectedInstruments.includes(inst.name);
                          return (
                            <button
                              key={inst.name}
                              type="button"
                              onClick={() => setTempSelectedInstruments(prev => prev.includes(inst.name) ? prev.filter(x => x !== inst.name) : [...prev, inst.name])}
                              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSel ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                <span className="font-extrabold text-xs truncate">{inst.name}</span>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isSel ? 'bg-lavender-accent border-lavender-accent text-black' : 'border-lavender-border/70'}`}>
                                  {isSel && <Check size={10} strokeWidth={4} />}
                                </div>
                              </div>
                              <p className="text-[10px] text-lavender-text/60 mt-1 line-clamp-2 leading-relaxed font-semibold">{inst.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>,
                  'instruments'
                )}
              </div>
            )}
          </div>
        );

      case 'singers':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setSingersSubTab('casting')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[120px] text-center ${singersSubTab === 'casting' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Casting Prompts
              </button>
              <button
                type="button"
                onClick={() => setSingersSubTab('profile')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[120px] text-center ${singersSubTab === 'profile' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Adult/Child Pitches
              </button>
              <button
                type="button"
                onClick={() => setSingersSubTab('instruments')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[120px] text-center ${singersSubTab === 'instruments' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Solo Instruments
              </button>
              <button
                type="button"
                onClick={() => setSingersSubTab('partnerUp')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[120px] text-center ${singersSubTab === 'partnerUp' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Duet Partner-ups
              </button>
            </div>

            {singersSubTab === 'casting' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Singer Prompt/Role Directives", "Provide additional prompts or behavior guidelines for each of the four singers to specify their style or role in the vocal play.", "singers")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {singersMeta.map((s) => {
                        const value = singerPrompts[s.id] || '';
                        return (
                          <div key={s.id} className="p-4 bg-lavender-surface/30 border border-lavender-border/40 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-black text-lavender-accent block">{s.name}</span>
                                <span className="text-[10px] text-lavender-text/50 font-semibold">{s.voice}</span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(value);
                                }}
                                className="p-1.5 rounded bg-lavender-surface hover:bg-lavender-border/40 text-lavender-text/75 hover:text-lavender-accent transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                                title="Copy prompt text to clipboard"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy
                              </button>
                            </div>
                            <textarea
                              value={value}
                              onChange={(e) => setSingerPrompts(prev => ({ ...prev, [s.id]: e.target.value }))}
                              placeholder={`Enter custom prompt directives explaining ${s.name}'s part in the song (e.g., "Sing with a dramatic opera flair, doing background operatic harmonies during the chorus")...`}
                              className="w-full h-24 p-2.5 bg-lavender-surface border border-lavender-border/50 text-lavender-text text-[11px] font-bold focus:outline-none focus:border-lavender-accent rounded-lg placeholder:text-lavender-text/30 leading-relaxed font-mono resize-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>,
                  'singers'
                )}
              </div>
            )}

            {singersSubTab === 'profile' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Vocal Profile Selection (Child vs. Adult)", "Directs vocal synthesizer to pitch and style individual singers to either childcare/childish structures or adult heights.", "childVoice")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-4 max-w-xl overflow-y-auto">
                    <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-1">Singer Profiles</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {singersMeta.map((s) => {
                        const isChild = singerChildVoices[s.id] || false;
                        return (
                          <div 
                            key={s.id} 
                            onClick={() => {
                              const nextVal = !isChild;
                              setSingerChildVoices(prev => {
                                const updated = { ...prev, [s.id]: nextVal };
                                // Also sync main dialogChildVoice if any singer is childish
                                const list = Object.values(updated);
                                setDialogChildVoice(list.some(v => v === true));
                                return updated;
                              });
                            }}
                            className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                              isChild 
                                ? 'bg-lavender-accent/10 border-lavender-accent shadow' 
                                : 'bg-lavender-surface/30 border-lavender-border/40 hover:border-lavender-accent/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChild}
                                onChange={() => {}} // handled by onClick container for better UX
                                className="w-4 h-4 rounded border-lavender-border text-lavender-accent focus:ring-0 cursor-pointer pointer-events-none"
                              />
                              <div>
                                <span className="text-xs font-extrabold text-lavender-accent block">{s.name}</span>
                                <span className="text-[10px] text-lavender-text/70 font-semibold">{s.voice}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isChild ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                              {isChild ? 'Childish' : 'Adult'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-lavender-surface/30 border border-lavender-border/20 rounded-xl mt-2 text-[10.5px] leading-relaxed text-lavender-text/60 w-full">
                      <span className="font-extrabold text-lavender-accent block mb-1">Configuration Overview</span>
                      Set individual singer profiles above. For example, toggle two as childish and two as adults to create a beautiful family choir containing both parents and children vocal heights!
                    </div>
                  </div>,
                  'childVoice'
                )}
              </div>
            )}

            {singersSubTab === 'instruments' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Singer Solo Instruments", "Select specific instruments that can be played by a single singer, individually assigned per singer.", "singerInstruments")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                    {/* Singers selection for instruments */}
                    <div className="flex flex-wrap gap-2.5 shrink-0">
                      {singersMeta.map((s) => {
                        const isCurrent = s.id === activeInstrumentSinger;
                        const instrumentsPlayed = singerInstruments[s.id] || [];
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveInstrumentSinger(s.id as any)}
                            className={`flex-1 min-w-[124px] p-2.5 rounded-xl border text-left transition-all ${
                              isCurrent 
                                ? 'bg-lavender-accent text-black border-lavender-accent font-extrabold shadow-md' 
                                : 'bg-lavender-surface/40 hover:bg-lavender-surface border-lavender-border text-lavender-text font-bold'
                            }`}
                          >
                            <div className="text-[10px] opacity-75 uppercase tracking-wider">{s.name} ({s.voice})</div>
                            <div className="text-xs mt-1 truncate flex flex-wrap gap-1">
                              {instrumentsPlayed.length === 0 ? (
                                <span className="text-[10px] opacity-50 font-normal">None selected</span>
                              ) : (
                                instrumentsPlayed.map(inst => (
                                  <span key={inst} className="text-[9px] bg-black/10 px-1 rounded truncate max-w-[80px]">
                                    {inst}
                                  </span>
                                ))
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
                      {/* Categories Sidebar */}
                      <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2.5 lg:pb-0 lg:pr-3 gap-1.5 whitespace-nowrap lg:whitespace-normal max-h-[55px] lg:max-h-none">
                        <span className="hidden lg:block text-[9px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 mb-1.5">Categories</span>
                        {['All', 'Ancient & Exotic', 'Acoustic Strings', 'Bowed Strings', 'Brass', 'Drums & Snare', 'Percussion & Metal', 'Woodwinds & Reeds', 'Electronic'].map(cat => {
                          const count = (singerInstruments[activeInstrumentSinger] || []).filter(name => {
                            const inst = SINGLE_SINGER_INSTRUMENTS.find(i => i.name === name);
                            return inst && (cat === 'All' || inst.group === cat);
                          }).length;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setActiveSingerInstrumentGroup(cat)}
                              className={`text-left px-3 py-1.5 lg:p-2 lg:w-full rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between cursor-pointer ${
                                cat === activeSingerInstrumentGroup 
                                  ? 'bg-lavender-accent text-black font-extrabold shadow-sm' 
                                  : 'bg-lavender-surface/20 text-lavender-text hover:bg-lavender-surface/50 border border-lavender-border/10 lg:border-0'
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              {count > 0 && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ml-2 ${
                                  cat === activeSingerInstrumentGroup ? 'bg-black/20 text-black' : 'bg-lavender-accent/20 text-lavender-accent border border-lavender-accent/30'
                                }`}>{count}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Instruments Columns */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex text-xs font-extrabold text-lavender-accent uppercase tracking-widest px-1 mb-2 font-mono">
                          {activeSingerInstrumentGroup} Instruments for <strong className="text-white ml-1.5">{singersMeta.find(s => s.id === activeInstrumentSinger)?.name}</strong>:
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-0.5 pr-1 font-mono">
                          {SINGLE_SINGER_INSTRUMENTS.filter(inst => activeSingerInstrumentGroup === 'All' || inst.group === activeSingerInstrumentGroup).map((inst) => {
                            const activeInstList = singerInstruments[activeInstrumentSinger] || [];
                            const isSelected = activeInstList.includes(inst.name);
                            return (
                              <button
                                key={inst.name}
                                type="button"
                                onClick={() => {
                                  setSingerInstruments(prev => {
                                    const list = prev[activeInstrumentSinger] || [];
                                    const newList = list.includes(inst.name)
                                      ? list.filter(x => x !== inst.name)
                                      : [...list, inst.name];
                                    return { ...prev, [activeInstrumentSinger]: newList };
                                  });
                                }}
                                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                  isSelected ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' : 'bg-lavender-accent/5 hover:bg-lavender-accent/10 hover:border-lavender-accent/40 border-lavender-border/50 text-lavender-text'
                                }`}
                              >
                                <span className="font-extrabold text-xs flex items-center gap-1.5 mt-0.5 truncate">
                                  {isSelected ? <CheckCircle size={12} className="text-lavender-accent shrink-0" /> : <div className="w-3 h-3 rounded-full border border-lavender-text/30 shrink-0" />}
                                  {inst.name}
                                </span>
                                <p className="text-[10px] text-lavender-text/65 mt-1 line-clamp-1 leading-relaxed font-semibold">{inst.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>,
                  'singerInstruments'
                )}
              </div>
            )}

            {singersSubTab === 'partnerUp' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Singer Partner-ups", "Select two or three singers to partner up and sing combined unison or harmony blocks for the same verses.", "partnerUp")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col gap-6 p-6 bg-lavender-surface/10 rounded-2xl border border-lavender-border/30 justify-center items-center overflow-y-auto">
                    <div className="text-center">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-1">Singer Combinations</span>
                      <h2 className="text-xl font-black text-lavender-accent">Form Vocal Duets & Trios</h2>
                      <p className="text-xs text-lavender-text/60 mt-1 max-w-sm mx-auto leading-relaxed">
                        Partnered singers will perform specific verses or chorus lines together in beautiful unison or harmony.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                      {singersMeta.map((s) => {
                        const isChecked = singerPartnerUps[s.id] || false;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSingerPartnerUps(prev => ({
                                ...prev,
                                [s.id]: !prev[s.id]
                              }));
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent font-extrabold shadow-sm'
                                : 'bg-lavender-surface/40 hover:bg-lavender-surface border-lavender-border/40 text-lavender-text font-bold'
                            }`}
                          >
                            <div>
                              <span className="text-xs block">{s.name}</span>
                              <span className="text-[9px] opacity-60 font-semibold">{s.voice}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by button click
                              className="w-3.5 h-3.5 rounded border-lavender-border/40 text-lavender-accent focus:ring-lavender-accent"
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Validation Info Box */}
                    <div className="w-full max-w-md">
                      {(() => {
                        const selectedCount = Object.values(singerPartnerUps).filter(Boolean).length;
                        const selectedNames = Object.entries(singerPartnerUps)
                          .filter(([_, active]) => active)
                          .map(([id]) => id.charAt(0).toUpperCase() + id.slice(1));

                        if (selectedCount === 0) {
                          return (
                            <div className="p-3 bg-lavender-surface/30 border border-lavender-border/20 rounded-xl text-center">
                              <p className="text-[10px] sm:text-xs text-lavender-text/50">
                                No singers selected. Active partners won't be appended to the custom prompt.
                              </p>
                            </div>
                          );
                        } else if (selectedCount === 1) {
                          return (
                            <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-center">
                              <p className="text-[10px] sm:text-xs text-yellow-500 font-bold">
                                ⚠️ A partner-up requires at least 2 singers. Select another singer!
                              </p>
                            </div>
                          );
                        } else if (selectedCount === 2 || selectedCount === 3) {
                          return (
                            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center shadow-inner">
                              <p className="text-[10px] sm:text-xs text-emerald-400 font-black flex items-center justify-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Valid Partner-up Dynamic Active!
                              </p>
                              <p className="text-[10px] text-lavender-text/70 mt-1">
                                {selectedNames.join(" & ")} will perform combined duet/trio sections together.
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center">
                              <p className="text-[10px] sm:text-xs text-rose-500 font-black">
                                🚫 Invalid selection: {selectedCount} singers selected.
                              </p>
                              <p className="text-[10px] text-lavender-text/60 mt-1">
                                A combined partner segment must contain either 2 or 3 singers. Please deselect one.
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>,
                  'partnerUp'
                )}
              </div>
            )}
          </div>
        );

      case 'structure':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setStructureSubTab('intro')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${structureSubTab === 'intro' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Instrumental Intro
              </button>
              <button
                type="button"
                onClick={() => setStructureSubTab('outro')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${structureSubTab === 'outro' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Instrumental Outro
              </button>
              <button
                type="button"
                onClick={() => setStructureSubTab('sfx')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${structureSubTab === 'sfx' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Sound Effects (SFX)
              </button>
            </div>

            {structureSubTab === 'intro' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader(
                  "Instrumental Prelude Intro", 
                  "Pure acoustic opening section, perfect to lock keys", 
                  "intro"
                )}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Status indicator button */}
                    <div className="flex items-center justify-between p-3 mb-3 bg-lavender-surface/15 border border-lavender-border/30 rounded-xl shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setDialogIntroConfig(prev => ({
                              ...prev,
                              enabled: !prev.enabled
                            }));
                          }}
                          className={`px-3 py-1 text-[11px] font-black uppercase rounded-md border ${
                            dialogIntroConfig.enabled 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                              : 'bg-lavender-surface border-lavender-border/40 text-lavender-text/40'
                          }`}
                        >
                          {dialogIntroConfig.enabled ? 'ACTIVE PRE-COMPOSING' : 'INACTIVE'}
                        </button>
                        <span className="text-[10px] text-lavender-text/50 font-bold">Duration preset: <strong className="text-white">{dialogIntroConfig.duration}s</strong></span>
                      </div>
                      {dialogIntroConfig.instruments.length > 0 && (
                        <button type="button" onClick={() => setDialogIntroConfig(prev => ({ ...prev, instruments: [] }))} className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 leading-none"><Trash2 size={11} /> Clear instruments ({dialogIntroConfig.instruments.length})</button>
                      )}
                    </div>

                    {dialogIntroConfig.enabled && (
                      <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        {/* Duration preset buttons */}
                        <div className="grid grid-cols-4 gap-2 mb-3 shrink-0">
                          {[
                            { val: 10, label: 'Prelude (10s)' },
                            { val: 20, label: 'Stand. Build (20s)' },
                            { val: 40, label: 'Atmo Progress (40s)' },
                            { val: 60, label: 'Extended Epic (60s)' }
                          ].map(p => {
                            const isSel = dialogIntroConfig.duration === p.val;
                            return (
                              <button
                                key={p.val}
                                type="button"
                                onClick={() => setDialogIntroConfig(prev => ({ ...prev, duration: p.val }))}
                                className={`py-2 text-center rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                                  isSel ? 'bg-lavender-accent border-lavender-accent text-black font-extrabold' : 'bg-lavender-surface border-lavender-border/30 text-lavender-text hover:border-lavender-accent/40'
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Instruments Flex selection */}
                        <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                          {/* Left categories */}
                          <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[100px] lg:max-h-none space-y-0.5">
                            <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Categories</span>
                            {INTRO_OUTRO_INSTRUMENTS.map(g => {
                              const count = g.instruments.filter(x => dialogIntroConfig.instruments.includes(x)).length;
                              return (
                                <button
                                  key={g.category}
                                  type="button"
                                  onClick={() => setIntroSfxGroup(g.category)}
                                  className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                    g.category === introSfxGroup ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                                  }`}
                                >
                                  <span className="truncate">{g.category}</span>
                                  {count > 0 && <span className="text-[9px] bg-lavender-accent text-black font-black px-1.5 py-0.2 rounded-full leading-none">{count}</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Instruments grid */}
                          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1 pb-2 h-full">
                            {(INTRO_OUTRO_INSTRUMENTS.find(c => c.category === introSfxGroup)?.instruments || []).map(instName => {
                              const isSel = dialogIntroConfig.instruments.includes(instName);
                              return (
                                <button
                                  key={instName}
                                  type="button"
                                  onClick={() => {
                                    setDialogIntroConfig(prev => {
                                      const isSelected = prev.instruments.includes(instName);
                                      const nextInstruments = isSelected 
                                        ? prev.instruments.filter(i => i !== instName) 
                                        : [...prev.instruments, instName];
                                      return { ...prev, instruments: nextInstruments };
                                    });
                                  }}
                                  className={`p-2.5 text-left rounded-lg text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-between ${
                                    isSel
                                      ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent'
                                      : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                                  }`}
                                >
                                  <span className="truncate">{instName}</span>
                                  {isSel && <Check size={11} className="text-lavender-accent shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>,
                  "intro"
                )}
              </div>
            )}

            {structureSubTab === 'outro' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader(
                  "Instrumental Postlude Outro", 
                  "Pure vocal-free coda progressive ending section", 
                  "outro"
                )}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Status indicator button */}
                    <div className="flex items-center justify-between p-3 mb-3 bg-lavender-surface/15 border border-lavender-border/30 rounded-xl shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setDialogOutroConfig(prev => ({
                              ...prev,
                              enabled: !prev.enabled
                            }));
                          }}
                          className={`px-3 py-1 text-[11px] font-black uppercase rounded-md border ${
                            dialogOutroConfig.enabled 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                              : 'bg-lavender-surface border-lavender-border/40 text-lavender-text/40'
                          }`}
                        >
                          {dialogOutroConfig.enabled ? 'ACTIVE PRE-COMPOSING' : 'INACTIVE'}
                        </button>
                        <span className="text-[10px] text-lavender-text/50 font-bold">Duration preset: <strong className="text-white">{dialogOutroConfig.duration}s</strong></span>
                      </div>
                      {dialogOutroConfig.instruments.length > 0 && (
                        <button type="button" onClick={() => setDialogOutroConfig(prev => ({ ...prev, instruments: [] }))} className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 leading-none"><Trash2 size={11} /> Clear instruments ({dialogOutroConfig.instruments.length})</button>
                      )}
                    </div>

                    {dialogOutroConfig.enabled && (
                      <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        {/* Duration preset buttons */}
                        <div className="grid grid-cols-4 gap-2 mb-3 shrink-0">
                          {[
                            { val: 10, label: 'Prelude (10s)' },
                            { val: 20, label: 'Stand. Build (20s)' },
                            { val: 40, label: 'Atmo Progress (40s)' },
                            { val: 60, label: 'Extended Epic (60s)' }
                          ].map(p => {
                            const isSel = dialogOutroConfig.duration === p.val;
                            return (
                              <button
                                key={p.val}
                                type="button"
                                onClick={() => setDialogOutroConfig(prev => ({ ...prev, duration: p.val }))}
                                className={`py-2 text-center rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                                  isSel ? 'bg-lavender-accent border-lavender-accent text-black font-extrabold' : 'bg-lavender-surface border-lavender-border/30 text-lavender-text hover:border-lavender-accent/40'
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Instruments Flex selection */}
                        <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                          {/* Left categories */}
                          <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[100px] lg:max-h-none space-y-0.5">
                            <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Categories</span>
                            {INTRO_OUTRO_INSTRUMENTS.map(g => {
                              const count = g.instruments.filter(x => dialogOutroConfig.instruments.includes(x)).length;
                              return (
                                <button
                                  key={g.category}
                                  type="button"
                                  onClick={() => setOutroSfxGroup(g.category)}
                                  className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                    g.category === outroSfxGroup ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                                  }`}
                                >
                                  <span className="truncate">{g.category}</span>
                                  {count > 0 && <span className="text-[9px] bg-lavender-accent text-black font-black px-1.5 py-0.2 rounded-full leading-none">{count}</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Instruments grid */}
                          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1 pb-2 h-full">
                            {(INTRO_OUTRO_INSTRUMENTS.find(c => c.category === outroSfxGroup)?.instruments || []).map(instName => {
                              const isSel = dialogOutroConfig.instruments.includes(instName);
                              return (
                                <button
                                  key={instName}
                                  type="button"
                                  onClick={() => {
                                    setDialogOutroConfig(prev => {
                                      const isSelected = prev.instruments.includes(instName);
                                      const nextInstruments = isSelected 
                                        ? prev.instruments.filter(i => i !== instName) 
                                        : [...prev.instruments, instName];
                                      return { ...prev, instruments: nextInstruments };
                                    });
                                  }}
                                  className={`p-2.5 text-left rounded-lg text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-between ${
                                    isSel
                                      ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent'
                                      : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                                  }`}
                                >
                                  <span className="truncate">{instName}</span>
                                  {isSel && <Check size={11} className="text-lavender-accent shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>,
                  "outro"
                )}
              </div>
            )}

            {structureSubTab === 'sfx' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Sound Effects (SFX)", "Add bracketed background performance sound effects cues inside writing", "sfx")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                    {/* Families Sidebar */}
                    {sfxSearch.trim() === '' && (
                      <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[120px] lg:max-h-none space-y-0.5">
                        <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Categories</span>
                        {processedSfxGroups.map(g => {
                          const count = g.effects.filter(x => selectedSfx.includes(x.name)).length;
                          return (
                            <button
                              key={g.type}
                              type="button"
                              onClick={() => setSfxGroupId(g.type)}
                              className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                                g.type === sfxGroupId ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                              }`}
                            >
                              <span className="truncate">{g.type}</span>
                              {count > 0 && <span className="text-[9px] bg-lavender-accent text-black font-black px-1.5 py-0.2 rounded-full leading-none">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Sfx list */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="relative mb-2.5 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                        <input
                          type="text"
                          placeholder="Search sound effects (e.g. Thunder, Vinyl hiss, Laughing, Siren)..."
                          value={sfxSearch}
                          onChange={(e) => setSfxSearch(e.target.value)}
                          className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-lavender-accent"
                        />
                      </div>

                      <div className="flex text-xs font-extrabold text-lavender-accent uppercase tracking-widest px-1 mb-2">
                        Total Selection: <strong className="text-white ml-1.5">{selectedSfx.length} loaded</strong>
                      </div>

                      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1 pb-2">
                        {filteredSfx.map(eff => {
                          const isSel = selectedSfx.includes(eff.name);
                          return (
                            <button
                              key={eff.name}
                              type="button"
                              onClick={() => setSelectedSfx(prev => prev.includes(eff.name) ? prev.filter(x => x !== eff.name) : [...prev, eff.name])}
                              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSel ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                <span className="font-extrabold text-xs truncate">{eff.name}</span>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isSel ? 'bg-lavender-accent border-lavender-accent text-black' : 'border-lavender-border/70'}`}>
                                  {isSel && <Check size={10} strokeWidth={4} />}
                                </div>
                              </div>
                              <p className="text-[10px] text-lavender-text/60 mt-1 line-clamp-2 leading-relaxed font-semibold">{eff.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>,
                  'sfx'
                )}
              </div>
            )}
          </div>
        );

      case 'poetics':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setPoeticsSubTab('rhyme')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[100px] text-center ${poeticsSubTab === 'rhyme' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Rhyme Structure
              </button>
              <button
                type="button"
                onClick={() => setPoeticsSubTab('reversal')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[100px] text-center ${poeticsSubTab === 'reversal' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Backward Reversal
              </button>
              <button
                type="button"
                onClick={() => setPoeticsSubTab('reflection')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[100px] text-center ${poeticsSubTab === 'reflection' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Self-Reflection
              </button>
              <button
                type="button"
                onClick={() => setPoeticsSubTab('safety')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[100px] text-center ${poeticsSubTab === 'safety' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Safety Ratings
              </button>
            </div>

            {poeticsSubTab === 'rhyme' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Rhymes Structure Constraints", "Constrains paragraph poetry endings to specific patterns", "rhymeScheme")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
                    {/* Categories */}
                    {rhymeSearch.trim() === '' && (
                      <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/20 pb-2 lg:pb-0 lg:pr-3 overflow-y-auto max-h-[120px] lg:max-h-none space-y-0.5">
                        <span className="text-[10px] font-extrabold text-lavender-text/40 uppercase tracking-widest px-1 block mb-1">Categories</span>
                        {RHYME_CATEGORIES.map(category => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setRhymeGroupId(category.id)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all truncate flex items-center justify-between ${
                              category.id === rhymeGroupId ? 'bg-lavender-accent text-black font-extrabold' : 'hover:bg-lavender-surface text-lavender-text/80'
                            }`}
                          >
                            <span className="truncate">{category.name}</span>
                            <span className="text-[8px] font-bold opacity-65">{category.rhymeIds.length}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Schemes list */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="relative mb-2.5 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
                        <input
                          type="text"
                          placeholder="Search rhyme styles (e.g. perfect, subverted, haiku, tanka, freeverse)..."
                          value={rhymeSearch}
                          onChange={(e) => setRhymeSearch(e.target.value)}
                          className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-lavender-accent"
                        />
                      </div>

                      {(() => {
                        const currentRhyme = findRhymeTypeById(dialogRhymeId);
                        return (
                          <div className="flex text-xs font-extrabold text-lavender-accent uppercase tracking-widest px-1 mb-2">
                            Selected Poetic: <strong className="text-white ml-1.5">{currentRhyme?.name || 'Perfect Rhyme'}</strong>
                          </div>
                        );
                      })()}

                      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1 pb-2">
                        {filteredRhyming.map(rhyme => {
                          const isSelected = rhyme.id === dialogRhymeId;
                          return (
                            <button
                              key={rhyme.id}
                              type="button"
                              onClick={() => setDialogRhymeId(rhyme.id)}
                              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow' : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                              }`}
                            >
                              <span className="font-extrabold text-xs truncate mt-0.5">{rhyme.name}</span>
                              <p className="text-[10px] text-lavender-text/60 mt-1 line-clamp-3 leading-relaxed font-semibold">{rhyme.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>,
                  'rhymeScheme'
                )}
              </div>
            )}

            {poeticsSubTab === 'reversal' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Lyric Phonetic Mirroring Reversal", "Injects subliminal mirror coding constraints into verses", "lyricsReversal")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-4 max-w-md">
                    <label className="flex items-center gap-3 p-4 bg-lavender-surface/50 border border-lavender-border/30 hover:border-lavender-accent/30 rounded-xl cursor-pointer selection-none transition-all">
                      <input
                        type="checkbox"
                        checked={dialogReverseLyrics}
                        onChange={(e) => setDialogReverseLyrics(e.target.checked)}
                        className="w-4 h-4 rounded border-lavender-border text-lavender-accent focus:ring-opacity-50"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-lavender-accent block">Enable backward phonetic rendering</span>
                        <span className="text-[10px] text-lavender-text/50 font-medium">Inserts phonetic mirror references to enable code cracking when played backwards.</span>
                      </div>
                    </label>
                  </div>,
                  'lyricsReversal'
                )}
              </div>
            )}

            {poeticsSubTab === 'reflection' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Self-Reflection Poetic Filter", "Enables writing meta lyrics containing self-referencing verses", "selfReflecting")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-4 max-w-md">
                    <label className="flex items-center gap-3 p-4 bg-lavender-surface/50 border border-lavender-border/30 hover:border-lavender-accent/30 rounded-xl cursor-pointer selection-none transition-all">
                      <input
                        type="checkbox"
                        checked={dialogSelfReflect}
                        onChange={(e) => setDialogSelfReflect(e.target.checked)}
                        className="w-4 h-4 rounded border-lavender-border text-lavender-accent focus:ring-opacity-50"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-lavender-accent block">Activate Self-Reflection Poetic cues</span>
                        <span className="text-[10px] text-lavender-text/50 font-medium">The songwriter will self-examine the song structure inside the verses.</span>
                      </div>
                    </label>
                  </div>,
                  'selfReflecting'
                )}
              </div>
            )}

            {poeticsSubTab === 'safety' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Content Safety Rating Bounds", "Configure lyrics filters based on standard media ratings", "rating")}
                {maybeOverlayDisabled(
                  <div className="flex flex-col gap-4 max-w-xl p-4">
                    <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">Active Safety Rating:</span>
                    <div className="grid grid-cols-5 gap-2.5">
                      {['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => {
                        const isSel = dialogRating === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setDialogRating(r)}
                            className={`py-3 px-2 text-center rounded-lg border text-sm font-black transition-all cursor-pointer h-full hover:scale-[1.01] ${
                              isSel 
                                ? 'bg-lavender-accent border-lavender-accent text-black font-black shadow-md' 
                                : 'bg-lavender-surface border-lavender-border/50 text-lavender-text hover:border-lavender-accent/40'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 p-4 border border-lavender-border/30 bg-lavender-surface/30 rounded-xl">
                      <h4 className="text-xs font-extrabold text-lavender-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        Active Rating Restrictions Bounds (Suno Compliant)
                      </h4>
                      <ul className="text-[11px] text-lavender-text/65 leading-relaxed space-y-1 ml-4 list-disc font-medium">
                        <li><strong>G Rating:</strong> Purely innocent themes, child-safe, completely zero references to violence or suggestive content.</li>
                        <li><strong>PG Rating</strong> (Recommended): Smooth poetic themes, warm lyrics, double entendres strictly filtered.</li>
                        <li><strong>PG-13 Rating:</strong> Allows slight dramatic friction, mild romantic depth, and thematic edge.</li>
                        <li><strong>R / NC-17:</strong> Intended for deep adult/horror theatrical concepts, high-drama, and uninhibited emotional lyricisms.</li>
                      </ul>
                    </div>
                  </div>,
                  'rating'
                )}
              </div>
            )}
          </div>
        );

      case 'sliders':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setSlidersSubTab('innuendo')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${slidersSubTab === 'innuendo' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Innuendo Scale
              </button>
              <button
                type="button"
                onClick={() => setSlidersSubTab('epic')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${slidersSubTab === 'epic' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Epic Drama
              </button>
              <button
                type="button"
                onClick={() => setSlidersSubTab('silly')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${slidersSubTab === 'silly' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Silliness Level
              </button>
              <button
                type="button"
                onClick={() => setSlidersSubTab('sapphic')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${slidersSubTab === 'sapphic' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Sapphic Meter
              </button>
            </div>

            {slidersSubTab === 'innuendo' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Sensual Innuendo Scale", "Set romantical flow temperature hints", "innuendoLevel")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-5 max-w-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">Innuendo Level (0 to 10):</span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={dialogInnuendoLevel}
                        onChange={(e) => setDialogInnuendoLevel(parseInt(e.target.value, 10))}
                        className="w-full accent-lavender-accent cursor-pointer"
                      />
                    </div>

                    {/* Level Details card */}
                    {(() => {
                      const step = getInnuendoStep(dialogInnuendoLevel);
                      return (
                        <div className="p-4 border border-lavender-border/30 bg-lavender-surface/40 rounded-xl">
                          <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest block">Selected Step:</span>
                          <h4 className="text-sm font-black text-white mt-0.5">{step.level}. {step.label}</h4>
                          <p className="text-[11px] text-lavender-text/60 font-semibold leading-relaxed mt-1.5">{step.description}</p>
                        </div>
                      );
                    })()}
                  </div>,
                  'innuendoLevel'
                )}
              </div>
            )}

            {slidersSubTab === 'epic' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Epic Drama Drama Level Setting", "Adjust orchestration depth from basic pop keys to symphonic heights", "epicLevel")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-5 max-w-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">Epic drama Scale (0 to 10):</span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={dialogEpicLevel}
                        onChange={(e) => setDialogEpicLevel(parseInt(e.target.value, 10))}
                        className="w-full accent-lavender-accent cursor-pointer"
                      />
                    </div>

                    {/* Level Details card */}
                    {(() => {
                      const step = getEpicStep(dialogEpicLevel);
                      return (
                        <div className="p-4 border border-lavender-border/30 bg-lavender-surface/40 rounded-xl">
                          <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest block">Selected Level:</span>
                          <h4 className="text-sm font-black text-white mt-0.5">{step.level}. {step.label}</h4>
                          <p className="text-[11px] text-lavender-text/60 font-semibold leading-relaxed mt-1.5">{step.description}</p>
                        </div>
                      );
                    })()}
                  </div>,
                  'epicLevel'
                )}
              </div>
            )}

            {slidersSubTab === 'silly' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Silliness Level Slider", "Fictional scaling of absurdity, ranging from deeply profound, to wacky puns, to pure Dadaist nonsense!", "sillyLevel")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-5 max-w-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">Silliness Scale (24 Steps - 0 to 23):</span>
                      <input
                        type="range"
                        min="0"
                        max="23"
                        step="1"
                        value={dialogSillyLevel}
                        onChange={(e) => setDialogSillyLevel(parseInt(e.target.value, 10))}
                        className="w-full accent-lavender-accent cursor-pointer"
                      />
                    </div>

                    {/* Level Details card */}
                    {(() => {
                      const step = getSillyStep(dialogSillyLevel);
                      return (
                        <div className="p-4 border border-lavender-border/40 bg-lavender-surface/50 rounded-xl relative shadow-md">
                          <div className="absolute right-4 top-4 bg-lavender-accent text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">Step {step.level} / 23</div>
                          <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest block">Active Silliness Level:</span>
                          <h4 className="text-sm font-black text-white mt-1">{step.label}</h4>
                          <p className="text-[11px] text-lavender-text/65 font-bold leading-relaxed mt-2 p-3 bg-black/30 border border-lavender-border/10 rounded-lg">{step.description}</p>
                        </div>
                      );
                    })()}
                  </div>,
                  'sillyLevel'
                )}
              </div>
            )}

            {slidersSubTab === 'sapphic' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Sapphic / Lesbian Focus Meter", "Determine the level of Sapphic romance, matriarchal rule, and female pairing intensity in the lyrical themes.", "sapphicLevel")}
                {maybeOverlayDisabled(
                  <div className="p-4 flex flex-col gap-5 max-w-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block">Sapphic Focus Meter (24 Steps - 0 to 23):</span>
                      <input
                        type="range"
                        min="0"
                        max="23"
                        step="1"
                        value={dialogSapphicLevel}
                        onChange={(e) => setDialogSapphicLevel(parseInt(e.target.value, 10))}
                        className="w-full accent-lavender-accent cursor-pointer"
                      />
                    </div>

                    {/* Level Details card */}
                    {(() => {
                      const step = getSapphicStep(dialogSapphicLevel);
                      return (
                        <div className="p-4 border border-lavender-border/40 bg-lavender-surface/50 rounded-xl relative shadow-md">
                          <div className="absolute right-4 top-4 bg-lavender-accent text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">Step {step.level} / 23</div>
                          <span className="text-[10px] font-extrabold text-lavender-accent uppercase tracking-widest block">Active Sapphic Step:</span>
                          <h4 className="text-sm font-black text-white mt-1">{step.label}</h4>
                          <p className="text-[11px] text-lavender-text/65 font-bold leading-relaxed mt-2 p-3 bg-black/30 border border-lavender-border/10 rounded-lg">{step.description}</p>
                        </div>
                      );
                    })()}
                  </div>,
                  'sapphicLevel'
                )}
              </div>
            )}
          </div>
        );

      case 'musicTheory':
        return (
          <div className="flex flex-col h-full">
            {/* Horizontal Sub-tabs */}
            <div className="flex bg-lavender-surface/35 border-b border-lavender-border/40 shrink-0 p-1 mb-3 rounded-lg overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setMusicTheorySubTab('bpm')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${musicTheorySubTab === 'bpm' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Beats Per Minute (BPM)
              </button>
              <button
                type="button"
                onClick={() => setMusicTheorySubTab('key')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${musicTheorySubTab === 'key' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Musical Key
              </button>
              <button
                type="button"
                onClick={() => setMusicTheorySubTab('timeSig')}
                className={`flex-1 py-1.5 px-3 text-xs font-black transition-all rounded-md cursor-pointer whitespace-nowrap min-w-[125px] text-center ${musicTheorySubTab === 'timeSig' ? 'bg-lavender-accent text-black font-extrabold shadow' : 'text-lavender-text/60 hover:text-lavender-text/90'}`}
              >
                Time Signature
              </button>
            </div>

            {musicTheorySubTab === 'bpm' && (
              <div className="flex-1 flex flex-col min-h-0 text-center justify-center">
                {renderEnableHeader("Beats Per Minute (BPM)", "Controls the speed and rhythm timing grids of the composition", "beatsPerMinute")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col justify-center items-center gap-5 p-6 bg-lavender-surface/10 rounded-2xl border border-lavender-border/30">
                    <div className="text-center">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-1">Main Accent Tempo</span>
                      <h1 className="text-4xl sm:text-5xl font-black text-lavender-accent tracking-tighter block">
                        {dialogBpm} <span className="text-sm font-bold text-lavender-text/55">BPM</span>
                      </h1>
                      <span className="inline-block bg-lavender-accent/15 text-lavender-accent border border-lavender-accent/30 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mt-2">
                        {getTempoName(dialogBpm)}
                      </span>
                    </div>

                    <div className="w-full max-w-md px-4 mt-2 shrink-0">
                      <div className="flex justify-between text-[10px] font-extrabold text-lavender-accent/80 uppercase tracking-widest mb-2">
                        <span>50 BPM (Largo)</span>
                        <span>{allowFastBpm ? "400 BPM (Extratone)" : "200 BPM (Limit)"}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={allowFastBpm ? 400 : 200}
                        value={dialogBpm}
                        onChange={(e) => setDialogBpm(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-lavender-border/40 accent-lavender-accent rounded-lg cursor-pointer focus:outline-none"
                      />
                    </div>

                    {/* Range limit override switch */}
                    <div className="w-full max-w-md shrink-0 flex items-center justify-between p-3.5 bg-lavender-surface/30 rounded-xl border border-lavender-border/20 text-left">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-lavender-text">Enable high-tempo range</span>
                        <span className="text-[10px] text-lavender-text/50 font-medium">Allows tempos above 200 BPM up to 400 BPM</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowFastBpm}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setAllowFastBpm(checked);
                          if (!checked && dialogBpm > 200) {
                            setDialogBpm(200);
                          }
                        }}
                        className="w-4 h-4 rounded text-lavender-accent border-lavender-border/40 focus:ring-lavender-accent/40 bg-zinc-950 accent-lavender-accent cursor-pointer"
                      />
                    </div>

                    <div className="w-full max-w-md flex justify-between gap-1.5 shrink-0">
                      {[60, 100, 120, 140, 175, 220, 350].map((presetBpm) => {
                        const isDisabled = !allowFastBpm && presetBpm > 200;
                        return (
                          <button
                            key={presetBpm}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setDialogBpm(presetBpm)}
                            className={`flex-1 py-1.5 px-1 border rounded text-[10pt] font-black tracking-tight transition-all cursor-pointer ${
                              isDisabled 
                                ? 'opacity-25 bg-black/10 border-transparent text-lavender-text/30 cursor-not-allowed' 
                                : 'bg-lavender-surface/40 hover:bg-lavender-white hover:text-black border-lavender-border/40 text-lavender-text/80'
                            }`}
                          >
                            {presetBpm}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-lavender-text/40 font-semibold max-w-md text-center shrink-0 mt-1 leading-normal">
                      Common tempos: 120-130 BPM for House/Techno, 70-90 BPM for Hip Hop/R&B, 140 BPM for Dubstep, and 170-180 BPM for Drum & Bass.
                    </p>
                  </div>,
                  'beatsPerMinute'
                )}
              </div>
            )}

            {musicTheorySubTab === 'key' && (
              <div className="flex-1 flex flex-col min-h-0">
                {renderEnableHeader("Musical Key Composition Accent", "Locks song arrangement and female vocal cues around a designated musical key", "musicalKey")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col justify-center items-center gap-6 p-6 bg-lavender-surface/10 rounded-2xl border border-lavender-border/30 overflow-y-auto">
                    <div className="text-center">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-2">Selected Key Blueprint</span>
                      <h1 className="text-4xl sm:text-5xl font-black text-lavender-accent tracking-tighter drop-shadow-md">
                        {dialogMusicalKey}
                      </h1>
                      <p className="text-[11px] text-lavender-text/60 font-semibold italic mt-2.5 max-w-sm mx-auto">
                        {dialogMusicalKey.includes('Minor') 
                          ? 'Lighter, bittersweet and emotional key perfect for introspective ballads.'
                          : 'Bright, cheerful, and highly resonant key, excellent for high-energy anthems.'}
                      </p>
                    </div>

                    <div className="w-full max-w-md px-4 mt-4 shrink-0">
                      <div className="flex justify-between text-[10px] font-extrabold text-lavender-accent uppercase tracking-wider mb-2">
                        <span>C Major (Low)</span>
                        <span>B Minor (High)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={MUSICAL_KEYS.length - 1}
                        value={findKeyIndexByName(dialogMusicalKey)}
                        onChange={(e) => {
                          const idx = parseInt(e.target.value, 10);
                          setDialogMusicalKey(findKeyByIndex(idx));
                        }}
                        className="w-full h-2 bg-lavender-border/40 accent-lavender-accent rounded-lg cursor-pointer focus:outline-none"
                      />
                    </div>

                    <div className="w-full max-w-xl overflow-hidden flex flex-col min-h-0">
                      <span className="text-[9px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-3 text-center shrink-0">
                        Click key below or drag the slider above:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto pr-1 pb-1">
                        {MUSICAL_KEYS.map((key) => {
                          const isSelected = key === dialogMusicalKey;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setDialogMusicalKey(key)}
                              className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-lavender-accent text-black font-extrabold border-lavender-accent shadow-lg scale-105' 
                                  : 'bg-lavender-surface/30 border-lavender-border/40 text-lavender-text/80 hover:border-lavender-accent/50'
                              }`}
                            >
                              {key}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[10px] text-lavender-text/40 font-semibold max-w-md text-center shrink-0 mt-2 leading-normal">
                      *Pro tip: For lower alto voice models, major keys are recommended to maintain rich, warm vocal clarity.
                    </p>
                  </div>,
                  'musicalKey'
                )}
              </div>
            )}

            {musicTheorySubTab === 'timeSig' && (
              <div className="flex-1 flex flex-col min-h-0 select-none">
                {renderEnableHeader("Time Signature Meter", "Enforces custom fractions / rhythmic bar subdivisions for lyrical metrics", "timeSignature")}
                {maybeOverlayDisabled(
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="p-4 bg-lavender-surface/10 border border-lavender-border/30 rounded-2xl mb-4 text-center shrink-0">
                      <span className="text-[10px] font-extrabold text-lavender-text/50 uppercase tracking-widest block mb-1">Active Rhythm Pacing</span>
                      <div className="flex justify-center items-baseline gap-2 mt-1">
                        {(() => {
                          const selectedSig = findTimeSignatureByFraction(dialogTimeSignature);
                          return (
                            <>
                              <h1 className="text-4xl font-extrabold text-lavender-accent">{selectedSig.fraction}</h1>
                              <span className="text-xs font-bold text-white/90">({selectedSig.name})</span>
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-[10px] text-lavender-text/60 font-semibold italic mt-2.5 max-w-md mx-auto">
                        {findTimeSignatureByFraction(dialogTimeSignature).description}
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4 pr-1">
                      {TIME_SIGNATURES.map((sig) => {
                        const isSelected = sig.fraction === dialogTimeSignature;
                        return (
                          <button
                            key={sig.fraction}
                            type="button"
                            onClick={() => setDialogTimeSignature(sig.fraction)}
                            className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md scale-[1.02]' 
                                : 'bg-lavender-surface/30 border-lavender-border/50 hover:border-lavender-accent/40 text-lavender-text'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-sm font-black tracking-tight">{sig.fraction}</span>
                              <span className="text-[9px] font-bold opacity-70 px-1.5 py-0.5 rounded bg-lavender-surface">{sig.name}</span>
                            </div>
                            <p className="text-[10px] text-lavender-text/60 mt-2 font-semibold leading-relaxed line-clamp-2">{sig.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>,
                  'timeSignature'
                )}
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-center italic text-lavender-text/40 py-8">Select a parameter configuration tab on the left to edit.</div>;
    }
  };

  if (showSummaryModal) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={executeGeneration}
        title="Confirm Song Generation Parameters"
        size="full"
        isNested={true}
      >
        {renderSummaryContent()}
      </Dialog>
    );
  }

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      onConfirm={handleConfirmAction} 
      onClear={handleClearAllOptions}
      clearText="Reset all generation parameters to default"
      title="Generate / Modify Song Dashboard"
      size="full"
    >
      <div className="flex flex-col h-[74vh] overflow-hidden -m-4 font-sans text-lavender-text">
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR: Large Tab Buttons representing configuration pages */}
          <div className="w-[28vw] max-w-[260px] min-w-[210px] bg-black/25 border-r border-lavender-border/40 overflow-y-auto p-3 flex flex-col gap-1.5 select-none shrink-0 h-full">
            <span className="text-[10px] font-bold text-lavender-accent uppercase tracking-widest px-2 mb-2 block border-b border-lavender-border/30 pb-1.5 shrink-0">
              Dashboard Options
            </span>
            
            <div className="space-y-1 flex-1 overflow-y-auto pr-0.5">
              {tabsList.map((tab) => {
                const isActive = tab.id === activeTabId;
                const isEnabled = enabledTabs[tab.id];
                const canDisable = tab.id !== 'prompt';

                return (
                  <div
                    key={tab.id}
                    className="group flex items-center justify-between gap-1 w-full"
                  >
                    {/* Tab selection link button */}
                    <button
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className={`flex-1 text-left px-3 py-2.5 rounded-lg text-[11.5px] transition-all flex items-center gap-2 truncate cursor-pointer ${
                        isActive
                          ? 'bg-lavender-accent text-black font-extrabold shadow h-full'
                          : 'hover:bg-lavender-surface/60 text-lavender-text/80 h-full'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-black' : isEnabled ? 'text-green-400' : 'text-lavender-text/45'}`}>
                        {tab.icon}
                      </span>
                      <div className="min-w-0 pr-1 select-none">
                        <span className={`block truncate ${isActive ? 'font-black' : isEnabled ? 'text-green-400/90 font-extrabold' : 'font-bold'}`}>
                          {tab.label.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>
                    </button>

                    {/* Left Checklist indicator switch (compact click trigger) */}
                    {canDisable ? (
                      <button
                        type="button"
                        onClick={() => toggleTabEnabled(tab.id)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all shrink-0 hover:bg-lavender-surface select-none cursor-pointer ${
                          isEnabled 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                            : 'bg-transparent border-lavender-border/30 text-lavender-text/30'
                        }`}
                        title={isEnabled ? "Disable this parameter" : "Enable this parameter"}
                      >
                        {isEnabled ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-lavender-text/20" />}
                      </button>
                    ) : (
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-lavender-accent/60 uppercase">CORE</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="pt-2 border-t border-lavender-border/25 text-center shrink-0">
              <span className="text-[9px] font-mono tracking-wider text-lavender-text/30 uppercase max-w-full block">Licensed under MIT by Katje B.V.</span>
            </div>
          </div>

          {/* RIGHT SIDE PANEL: Configuration controls container */}
          <div className="flex-1 bg-black/5 p-4 md:p-5 overflow-y-auto h-full min-w-0">
            {renderRightPanelContent()}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
