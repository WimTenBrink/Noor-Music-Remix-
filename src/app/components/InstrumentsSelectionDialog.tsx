import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from './Dialog';
import { INSTRUMENTS } from '../../constants/instruments';
import { Music, Check, Search, Trash2 } from 'lucide-react';

interface InstrumentsSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selected: string[]) => void;
  initialSelected: string[];
}

export const InstrumentsSelectionDialog: React.FC<InstrumentsSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialSelected
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // Reset state when opening the dialog
  useEffect(() => {
    if (isOpen) {
      setTempSelected([...initialSelected]);
      setSearchQuery('');
      // Default to alphabetically first group
      const sortedGroups = [...INSTRUMENTS].sort((a, b) => a.type.localeCompare(b.type));
      if (sortedGroups.length > 0) {
        setSelectedGroupId(sortedGroups[0].type);
      }
    }
  }, [isOpen, initialSelected]);

  // Sort groups and instruments inside them alphabetically
  const processedGroups = useMemo(() => {
    return [...INSTRUMENTS]
      .sort((a, b) => a.type.localeCompare(b.type))
      .map(group => ({
        ...group,
        instruments: [...group.instruments].sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, []);

  const activeGroup = processedGroups.find(g => g.type === selectedGroupId) || processedGroups[0];

  // Global search filtering
  const filteredInstruments = useMemo(() => {
    if (searchQuery.trim() === '') {
      return activeGroup?.instruments || [];
    }
    const results: { name: string; description: string; groupName: string }[] = [];
    processedGroups.forEach(group => {
      group.instruments.forEach(inst => {
        if (
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ ...inst, groupName: group.type });
        }
      });
    });
    return results;
  }, [searchQuery, activeGroup, processedGroups]);

  const handleToggle = (name: string) => {
    setTempSelected(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleClearAll = () => {
    setTempSelected([]);
  };

  const activeGroupSelectedCount = useMemo(() => {
    if (!activeGroup) return 0;
    return activeGroup.instruments.filter(inst => tempSelected.includes(inst.name)).length;
  }, [activeGroup, tempSelected]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onSelect(tempSelected);
        onClose();
      }}
      onClear={() => setTempSelected([])}
      clearText="Clear all selected instruments"
      title="Select Band Instruments & Vocals"
      size="full"
      isNested={true}
    >
      <div className="flex flex-col h-full font-sans text-lavender-text">
        {/* Top bar with active counts & actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-lavender-surface/20 border border-lavender-border/40 rounded-xl mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-lavender-accent tracking-widest bg-lavender-accent/10 px-2.5 py-1.5 rounded-md border border-lavender-accent/20">
              Total Selection: {tempSelected.length}
            </span>
            {tempSelected.length > 0 && (
              <span className="text-xs text-lavender-text/50 font-bold truncate max-w-md hidden sm:inline-block">
                ({tempSelected.join(', ')})
              </span>
            )}
          </div>
          {tempSelected.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/10 border border-red-900/30 hover:border-red-900/55 rounded-lg transition-all"
            >
              <Trash2 size={13} />
              Clear Selection ({tempSelected.length})
            </button>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-1 flex-col md:flex-row gap-5 min-h-0">
          {/* Left Side: Instrument Groups List (Alphabetical) */}
          {searchQuery.trim() === '' && (
            <div className="w-full md:w-64 shrink-0 flex flex-col border-r border-lavender-border/40 pr-4 overflow-y-auto max-h-[30vh] md:max-h-none">
              <span className="text-xs font-extrabold uppercase text-lavender-accent/60 tracking-wider mb-2 block px-1">
                Instrument Families
              </span>
              <div className="space-y-1">
                {processedGroups.map((group) => {
                  const isActive = group.type === selectedGroupId;
                  const groupCount = group.instruments.filter(inst => tempSelected.includes(inst.name)).length;
                  return (
                    <button
                      key={group.type}
                      type="button"
                      onClick={() => setSelectedGroupId(group.type)}
                      className={`w-full flex items-center justify-between text-left p-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-lavender-accent text-black font-extrabold shadow-sm'
                          : 'hover:bg-lavender-surface text-lavender-text/80'
                      }`}
                    >
                      <span className="truncate">{group.type}</span>
                      {groupCount > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive ? 'bg-black/20 text-black' : 'bg-lavender-accent/20 text-lavender-accent border border-lavender-accent/30'
                        }`}>
                          {groupCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Side: Search and Instruments Grid (Alphabetical) */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search Box */}
            <div className="relative mb-3.5 shrink-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-text/40" />
              <input
                type="text"
                placeholder="Search instruments & techniques (e.g. Theremin, Growling, Lyre)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-lavender-accent placeholder:text-lavender-text/30 font-bold"
              />
            </div>

            {/* Indicator badge for Category view vs Search view */}
            <div className="mb-2.5 px-1 shrink-0">
              <span className="text-xs font-bold text-lavender-accent/70 uppercase tracking-widest block">
                {searchQuery.trim() !== '' 
                  ? `Search Results (${filteredInstruments.length})` 
                  : `${activeGroup?.type || 'All'} (${filteredInstruments.length} items, ${activeGroupSelectedCount} active)`}
              </span>
            </div>

            {/* Instrument Buttons Checklist */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pr-1 min-h-[25vh]">
              {filteredInstruments.map((inst) => {
                const isSelected = tempSelected.includes(inst.name);
                return (
                  <button
                    key={inst.name}
                    type="button"
                    onClick={() => handleToggle(inst.name)}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md shadow-lavender-accent/5'
                        : 'bg-lavender-surface/30 border-lavender-border hover:border-lavender-accent/40 hover:bg-lavender-surface/75 text-lavender-text'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5 w-full">
                      <span className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                        <Music size={13} className="opacity-70 shrink-0" />
                        {inst.name}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-lavender-accent border-lavender-accent text-black' 
                          : 'border-lavender-border/70 group-hover:border-lavender-accent/55'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>
                    {'groupName' in inst && (
                      <span className="text-[10px] text-lavender-accent font-bold tracking-wider uppercase mt-1">
                        Category: {(inst as any).groupName}
                      </span>
                    )}
                    <p className="text-[11px] text-lavender-text/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {inst.description}
                    </p>
                  </button>
                );
              })}

              {filteredInstruments.length === 0 && (
                <div className="col-span-full text-center py-10 bg-lavender-surface/10 rounded-xl border border-lavender-border/20">
                  <p className="text-sm text-lavender-text/50 italic">No matching instruments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
