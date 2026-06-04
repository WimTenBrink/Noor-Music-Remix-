import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from './Dialog';
import { STYLES } from '../../constants/styles';
import { GROOVE_CATEGORIES, getGroupedAndSortedGrooves } from '../utils/grooves';
import { GROOVE_TOOLTIPS } from '../utils/tooltipsData';
import { Sparkles, Check, Search, Trash2, Heart, Music, CheckCircle, Filter } from 'lucide-react';

// Attribute Evaluator helper to categorize items on the fly
export const evaluateAttributes = (name: string, description: string, type: 'style' | 'groove') => {
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

interface StylesAndGroovesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStyles: string[], selectedGrooves: string[]) => void;
  initialStyles: string[];
  initialGrooves: string[];
}

interface UnifiedGroup {
  id: string; // group type name or category id
  name: string; // display name
  type: 'style' | 'groove';
  description?: string;
  items: {
    name: string;
    description: string;
    vibe?: string;
  }[];
}

export const StylesAndGroovesDialog: React.FC<StylesAndGroovesDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialStyles,
  initialGrooves
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Attribute Filters
  const [loudnessFilter, setLoudnessFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [bassFilter, setBassFilter] = useState<'all' | 'heavy' | 'medium' | 'none'>('all');
  const [tempoFilter, setTempoFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all');
  const [vibeFilter, setVibeFilter] = useState<'all' | 'dark' | 'bright' | 'weird' | 'neutral'>('all');

  // Local temporary selections
  const [tempSelectedStyles, setTempSelectedStyles] = useState<string[]>([]);
  const [tempSelectedGrooves, setTempSelectedGrooves] = useState<string[]>([]);

  // Sync state values when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTempSelectedStyles([...initialStyles]);
      setTempSelectedGrooves([...initialGrooves]);
      setSearchQuery('');
      setLoudnessFilter('all');
      setBassFilter('all');
      setTempoFilter('all');
      setVibeFilter('all');
    }
  }, [isOpen, initialStyles, initialGrooves]);

  // Build the combined groups list alphabetically sorted
  const unifiedGroups = useMemo<UnifiedGroup[]>(() => {
    // 1. Process Style Families
    const styleGroups: UnifiedGroup[] = STYLES.map(s => ({
      id: `style-${s.type}`,
      name: s.type,
      type: 'style',
      description: 'Select one or more genre-specific style settings to format the song.',
      items: [...s.substyles]
        .map(sub => ({
          name: sub.name,
          description: sub.description
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    }));

    // 2. Process Groove Categories
    const grooveData = getGroupedAndSortedGrooves();
    const grooveGroups: UnifiedGroup[] = GROOVE_CATEGORIES.map(cat => ({
      id: `groove-${cat.id}`,
      name: cat.name,
      type: 'groove',
      description: cat.description,
      items: (grooveData[cat.id] || []).map(name => {
        const tooltip = GROOVE_TOOLTIPS[name] || { desc: 'Dynamic beat and delivery style.', vibe: 'Creative' };
        return {
          name,
          description: tooltip.desc,
          vibe: tooltip.vibe
        };
      }).sort((a, b) => a.name.localeCompare(b.name))
    }));

    // 3. Merge and sort alphabetically by group name
    return [...styleGroups, ...grooveGroups].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Determine standard active group on modal open or state change
  useEffect(() => {
    if (isOpen && unifiedGroups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(unifiedGroups[0].id);
    }
  }, [isOpen, unifiedGroups, selectedGroupId]);

  const activeGroup = useMemo(() => {
    return unifiedGroups.find(g => g.id === selectedGroupId) || unifiedGroups[0];
  }, [unifiedGroups, selectedGroupId]);

  // Grouped counts calculation for badges
  const getSelectedCountForGroup = (group: UnifiedGroup) => {
    if (group.type === 'style') {
      return group.items.filter(item => tempSelectedStyles.includes(item.name)).length;
    } else {
      return group.items.filter(item => tempSelectedGrooves.includes(item.name)).length;
    }
  };

  // Compile candidate items before checking attribute filters
  const candidates = useMemo(() => {
    if (searchQuery.trim() === '') {
      if (!activeGroup) return [];
      return activeGroup.items.map(item => ({
        ...item,
        type: activeGroup.type
      }));
    }

    const results: { name: string; description: string; vibe?: string; groupName?: string; type: 'style' | 'groove' }[] = [];
    unifiedGroups.forEach(group => {
      group.items.forEach(item => {
        if (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.vibe && item.vibe.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          results.push({
            ...item,
            groupName: group.name,
            type: group.type
          });
        }
      });
    });

    return results;
  }, [searchQuery, activeGroup, unifiedGroups]);

  // Unified search and attribute filters logic
  const filteredItems = useMemo(() => {
    return candidates.filter(item => {
      const attrs = evaluateAttributes(item.name, item.description, item.type);
      
      if (loudnessFilter !== 'all' && attrs.loudness !== loudnessFilter) {
        return false;
      }
      if (bassFilter !== 'all' && attrs.bass !== bassFilter) {
        return false;
      }
      if (tempoFilter !== 'all' && attrs.tempo !== tempoFilter) {
        return false;
      }
      if (vibeFilter !== 'all' && attrs.vibe !== vibeFilter) {
        return false;
      }
      
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [candidates, loudnessFilter, bassFilter, tempoFilter, vibeFilter]);

  const handleToggleItem = (name: string, type: 'style' | 'groove') => {
    if (type === 'style') {
      setTempSelectedStyles(prev =>
        prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
      );
    } else {
      if (tempSelectedGrooves.includes(name)) {
        setTempSelectedGrooves(prev => prev.filter(g => g !== name));
      } else {
        if (tempSelectedGrooves.length >= 5) {
          return; // Max 5 grooves limit
        }
        setTempSelectedGrooves(prev => [...prev, name]);
      }
    }
  };

  const handleClearAll = () => {
    setTempSelectedStyles([]);
    setTempSelectedGrooves([]);
  };

  const renderAttributeBadges = (name: string, description: string, itemType: 'style' | 'groove') => {
    const attrs = evaluateAttributes(name, description, itemType);
    const badges = [];

    if (attrs.loudness === 'high') {
      badges.push({ text: 'Loud', bg: 'bg-red-500/10 text-red-400 border-red-500/20' });
    } else if (attrs.loudness === 'low') {
      badges.push({ text: 'Quiet', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' });
    }

    if (attrs.bass === 'heavy') {
      badges.push({ text: 'Heavy Bass', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' });
    } else if (attrs.bass === 'none') {
      badges.push({ text: 'Acoustic', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' });
    }

    if (attrs.tempo === 'fast') {
      badges.push({ text: 'Fast Tempo', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' });
    } else if (attrs.tempo === 'slow') {
      badges.push({ text: 'Slow Space', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' });
    }

    if (attrs.vibe === 'dark') {
      badges.push({ text: 'Dark Vibe', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' });
    } else if (attrs.vibe === 'bright') {
      badges.push({ text: 'Bright Vibe', bg: 'bg-yellow-500/10 text-yellow-500/95 border-yellow-500/20' });
    } else if (attrs.vibe === 'weird') {
      badges.push({ text: 'Avant-Garde', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' });
    }

    if (badges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-lavender-border/10">
        {badges.map((b, idx) => (
          <span key={idx} className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${b.bg}`}>
            {b.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onConfirm(tempSelectedStyles, tempSelectedGrooves);
        onClose();
      }}
      onClear={handleClearAll}
      clearText="Clear all selected styles and grooves"
      title="Configure Styles & Core Grooves"
      size="full"
      isNested={true}
    >
      <div className="flex flex-col h-full font-sans text-lavender-text">
        {/* Active Selection KPI top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-lavender-surface/25 border border-lavender-border/40 rounded-xl mb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase text-lavender-accent tracking-widest bg-lavender-accent/10 px-2.5 py-1.5 rounded-md border border-lavender-accent/20">
              Styles Selected: {tempSelectedStyles.length}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md border ${
              tempSelectedGrooves.length === 5 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-lavender-accent/10 text-lavender-accent border-lavender-accent/20'
            }`}>
              Grooves Selected: {tempSelectedGrooves.length} / 5
            </span>
            {(tempSelectedStyles.length > 0 || tempSelectedGrooves.length > 0) && (
              <span className="text-[11px] text-lavender-text/50 font-bold truncate max-w-sm hidden lg:inline-block">
                ({[...tempSelectedStyles, ...tempSelectedGrooves].join(', ')})
              </span>
            )}
          </div>
          {(tempSelectedStyles.length > 0 || tempSelectedGrooves.length > 0) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/10 border border-red-900/30 hover:border-red-900/55 rounded-lg transition-all"
            >
              <Trash2 size={13} />
              Clear Selection
            </button>
          )}
        </div>

        {/* Search Input Box */}
        <div className="relative mb-3 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-text/40" />
          <input
            type="text"
            placeholder="Search styles, tempos, or grooves (e.g. Synthpop, Shoegaze, Euro-Bounce)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-lavender-accent placeholder:text-lavender-text/30 font-bold"
          />
        </div>

        {/* Dynamic Attribute Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-lavender-surface/15 border border-lavender-border/40 rounded-xl shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lavender-accent/85">
            <Filter size={13} className="text-lavender-accent shrink-0" />
            Attributes:
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Loudness Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-lavender-text/50">Loudness:</span>
              <select
                value={loudnessFilter}
                onChange={(e) => setLoudnessFilter(e.target.value as any)}
                className="bg-lavender-surface text-[11px] text-lavender-text border border-lavender-border hover:border-lavender-accent rounded px-2.5 py-1 focus:outline-none font-bold"
              >
                <option value="all">Any Loudness</option>
                <option value="high">Loud / Aggressive</option>
                <option value="medium">Moderate Volume</option>
                <option value="low">Quiet / Ambient</option>
              </select>
            </div>

            {/* Bass Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-lavender-text/50">Bass & Drums:</span>
              <select
                value={bassFilter}
                onChange={(e) => setBassFilter(e.target.value as any)}
                className="bg-lavender-surface text-[11px] text-lavender-text border border-lavender-border hover:border-lavender-accent rounded px-2.5 py-1 focus:outline-none font-bold"
              >
                <option value="all">Any Bass</option>
                <option value="heavy">Heavy Bass / Beats</option>
                <option value="medium">Medium Bass</option>
                <option value="none">Acoustic / No Bass</option>
              </select>
            </div>

            {/* Tempo Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-lavender-text/50">Tempo:</span>
              <select
                value={tempoFilter}
                onChange={(e) => setTempoFilter(e.target.value as any)}
                className="bg-lavender-surface text-[11px] text-lavender-text border border-lavender-border hover:border-lavender-accent rounded px-2.5 py-1 focus:outline-none font-bold"
              >
                <option value="all">Any Tempo</option>
                <option value="fast">Fast & Energetic</option>
                <option value="medium">Mid Tempo</option>
                <option value="slow">Slow & Spacious</option>
              </select>
            </div>

            {/* Vibe Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-lavender-text/50">Vibe / Mood:</span>
              <select
                value={vibeFilter}
                onChange={(e) => setVibeFilter(e.target.value as any)}
                className="bg-lavender-surface text-[11px] text-lavender-text border border-lavender-border hover:border-lavender-accent rounded px-2.5 py-1 focus:outline-none font-bold"
              >
                <option value="all">Any Vibe</option>
                <option value="bright">Bright & Angelic</option>
                <option value="dark">Dark & Gothic</option>
                <option value="weird">Experimental / Weird</option>
                <option value="neutral">Neutral Mood</option>
              </select>
            </div>
          </div>

          {/* Reset Filters Toggle */}
          {(loudnessFilter !== 'all' || bassFilter !== 'all' || tempoFilter !== 'all' || vibeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setLoudnessFilter('all');
                setBassFilter('all');
                setTempoFilter('all');
                setVibeFilter('all');
              }}
              className="md:ml-auto px-2.5 py-1 text-[10px] font-extrabold text-lavender-accent hover:text-white bg-lavender-accent/10 hover:bg-lavender-accent/25 border border-lavender-accent/30 rounded transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Main Grid content panes */}
        <div className="flex flex-1 flex-col md:flex-row gap-5 min-h-0 overflow-hidden">
          {/* Left Column: Combined Groups List (Alphabetically Ordered) */}
          {searchQuery.trim() === '' && (
            <div className="w-full md:w-72 shrink-0 flex flex-col border-r border-lavender-border/40 pr-4 overflow-y-auto max-h-[30vh] md:max-h-none space-y-1">
              <span className="text-xs font-extrabold uppercase text-lavender-accent/60 tracking-wider mb-2 block px-1">
                Unified Style & Groove Families
              </span>
              <div className="space-y-1">
                {unifiedGroups.map((group) => {
                  const isActive = group.id === selectedGroupId;
                  const count = getSelectedCountForGroup(group);
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-lavender-accent text-black font-extrabold shadow-sm'
                          : 'hover:bg-lavender-surface text-lavender-text/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {group.type === 'style' ? (
                          <Sparkles size={13} className={`shrink-0 ${isActive ? 'text-black' : 'text-lavender-accent'}`} />
                        ) : (
                          <Music size={13} className={`shrink-0 ${isActive ? 'text-black' : 'text-lavender-accent'}`} />
                        )}
                        <span className="truncate">{group.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          isActive 
                            ? 'bg-black/10 text-black/85' 
                            : 'bg-lavender-surface border border-lavender-border/30 text-lavender-text/40'
                        }`}>
                          {group.type === 'style' ? 'Genre' : 'Beat'}
                        </span>
                        {count > 0 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                            isActive ? 'bg-black/20 text-black' : 'bg-lavender-accent/20 text-lavender-accent border border-lavender-accent/30'
                          }`}>
                            {count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Column: Dynamic Items View with Selection List */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Header / Description badge */}
            <div className="mb-3 px-1 shrink-0 bg-lavender-surface/10 p-3 rounded-lg border border-lavender-border/20">
              <span className="text-xs font-bold text-lavender-accent uppercase tracking-widest block mb-0.5">
                {searchQuery.trim() !== '' 
                  ? `Global Search Results (${filteredItems.length})` 
                  : `${activeGroup?.name || ''} (${activeGroup?.type === 'style' ? 'Genre Styles' : 'Core Grooves'}) (${filteredItems.length} matching)`}
              </span>
              {searchQuery.trim() === '' && activeGroup?.description && (
                <p className="text-[11px] text-lavender-text/50 mt-1 italic">
                  {activeGroup.description} {activeGroup.type === 'groove' && '(Up to 5 can be selected)'}
                </p>
              )}
            </div>

            {/* Grid of Styles / Grooves */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pr-1 pb-4">
              {filteredItems.map((item) => {
                const itemType = 'type' in item ? (item as any).type : activeGroup?.type;
                const isSelected = itemType === 'style' 
                  ? tempSelectedStyles.includes(item.name) 
                  : tempSelectedGrooves.includes(item.name);
                
                const isGrooveLimitReached = itemType === 'groove' && tempSelectedGrooves.length >= 5 && !isSelected;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleToggleItem(item.name, itemType)}
                    disabled={isGrooveLimitReached}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md shadow-lavender-accent/5'
                        : isGrooveLimitReached
                        ? 'bg-lavender-surface/10 border-lavender-border/20 text-lavender-text/30 cursor-not-allowed opacity-60'
                        : 'bg-lavender-surface/30 border-lavender-border hover:border-lavender-accent/40 hover:bg-lavender-surface/75 text-lavender-text'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5 w-full">
                      <span className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                        {itemType === 'style' ? (
                          <Sparkles size={12} className="opacity-70 shrink-0 text-lavender-accent" />
                        ) : (
                          <Music size={12} className="opacity-70 shrink-0 text-lavender-accent" />
                        )}
                        {item.name}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-lavender-accent border-lavender-accent text-black' 
                          : 'border-lavender-border/70 group-hover:border-lavender-accent/55'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Meta info tags (Category name / Vibe if appropriate) */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {'groupName' in item && (
                        <span className="text-[9px] bg-lavender-accent/10 border border-lavender-accent/25 text-lavender-accent font-bold tracking-wider uppercase px-1.5 py-0.2 rounded">
                          Family: {(item as any).groupName}
                        </span>
                      )}
                      
                      {itemType === 'groove' && (
                        <span className="text-[9px] bg-lavender-surface border border-lavender-border/40 text-lavender-text/50 font-bold px-1.5 py-0.2 rounded font-mono">
                          Beat / Groove
                        </span>
                      )}

                      {itemType === 'style' && (
                        <span className="text-[9px] bg-lavender-surface border border-lavender-border/40 text-lavender-text/50 font-bold px-1.5 py-0.2 rounded font-mono">
                          Genre Style
                        </span>
                      )}

                      {item.vibe && (
                        <span className="text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-1.5 py-0.2 rounded">
                          Vibe: {item.vibe}
                        </span>
                      )}
                    </div>

                    {/* Evaluated dynamic attributes */}
                    {renderAttributeBadges(item.name, item.description, itemType)}

                    <p className="text-[11px] text-lavender-text/60 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-10 bg-lavender-surface/10 rounded-xl border border-lavender-border/20">
                  <p className="text-sm text-lavender-text/50 italic font-bold">No results found matching your search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
