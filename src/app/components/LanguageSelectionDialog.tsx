import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { LANGUAGE_GROUPS, findDialectById, findGroupByDialectId } from '../utils/languages';
import { Globe, Check, Search, ArrowUp, ArrowDown, X, AlertCircle } from 'lucide-react';

interface LanguageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dialectId: string) => void;
  currentDialectId: string;
}

export const LanguageSelectionDialog: React.FC<LanguageSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentDialectId
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  // Load from currentDialectId (comma-separated list of IDs)
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setWarning(null);
      const parsedIds = currentDialectId ? currentDialectId.split(',').filter(Boolean) : [];
      setSelectedIds(parsedIds);

      // Default the active group to the group of primary (first) dialect
      const primaryId = parsedIds[0] || 'en-GB';
      const group = findGroupByDialectId(primaryId);
      if (group) {
        setSelectedGroupId(group.id);
      } else {
        setSelectedGroupId(LANGUAGE_GROUPS[0]?.id || 'english');
      }
    }
  }, [isOpen, currentDialectId]);

  const activeGroup = LANGUAGE_GROUPS.find(g => g.id === selectedGroupId) || LANGUAGE_GROUPS[0];

  // If there's a search query, search globally
  const filteredDialects = searchQuery.trim() !== ''
    ? LANGUAGE_GROUPS.flatMap(g => g.dialects).filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeGroup?.dialects || [];

  const handleToggleDialect = (dialectId: string) => {
    setWarning(null);
    if (selectedIds.includes(dialectId)) {
      setSelectedIds(selectedIds.filter(id => id !== dialectId));
    } else {
      if (selectedIds.length >= 4) {
        setWarning("Maximum of 4 regional dialects selected. Remove one to add another.");
        return;
      }
      setSelectedIds([...selectedIds, dialectId]);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setWarning(null);
    const next = [...selectedIds];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setSelectedIds(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedIds.length - 1) return;
    setWarning(null);
    const next = [...selectedIds];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setSelectedIds(next);
  };

  const handleRemove = (idToRemove: string) => {
    setWarning(null);
    setSelectedIds(selectedIds.filter(id => id !== idToRemove));
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onSelect(selectedIds.join(','));
        onClose();
      }}
      onClear={() => {
        setSelectedIds([]);
        setWarning(null);
      }}
      clearText="Clear all selected languages"
      title="Select Vocal Accent & Dialect"
      isNested={true}
    >
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-[85vw] h-[68vh] max-h-[68vh] font-sans text-lavender-text overflow-hidden">
        {/* Left Side: Language Groups */}
        {searchQuery.trim() === '' && (
          <div className="w-full lg:w-48 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-lavender-border/40 pb-4 lg:pb-0 lg:pr-4 overflow-y-auto max-h-[20vh] lg:max-h-none">
            <span className="text-xs font-bold uppercase text-lavender-accent/60 tracking-wider mb-2 block">
              Language Groups
            </span>
            <div className="space-y-1">
              {LANGUAGE_GROUPS.map((group) => {
                const isActive = group.id === selectedGroupId;
                const totalDialects = group.dialects.length;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setWarning(null);
                    }}
                    className={`w-full flex items-center justify-between text-left p-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-lavender-accent text-black font-extrabold shadow-sm'
                        : 'hover:bg-lavender-surface text-lavender-text/80'
                    }`}
                  >
                    <span className="truncate">{group.name}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-lavender-surface border border-lavender-border/30 text-lavender-text/50'
                    }`}>
                      {totalDialects}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Center: Dialects Grid & Search */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-text/40" />
            <input
              type="text"
              placeholder="Search accents (e.g. Dutch, Viking, Roman, Greek)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setWarning(null);
              }}
              className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-lavender-accent placeholder:text-lavender-text/30 font-bold"
            />
          </div>

          {/* Subtitle/Indicator */}
          <div className="mb-2 px-1">
            <span className="text-[10px] font-bold text-lavender-accent/70 uppercase tracking-widest block">
              {searchQuery.trim() !== '' 
                ? 'Search Results' 
                : `${activeGroup?.name || 'All'} Dialects`}
            </span>
          </div>

          {/* Dialect List (Compact Grid) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1 h-full">
            {filteredDialects.map((dialect) => {
              const selectedIndex = selectedIds.indexOf(dialect.id);
              const isSelected = selectedIndex !== -1;
              return (
                <button
                  key={dialect.id}
                  onClick={() => handleToggleDialect(dialect.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md shadow-lavender-accent/5'
                      : 'bg-lavender-surface/40 border-lavender-border hover:border-lavender-accent/40 hover:bg-lavender-surface/85 text-lavender-text'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-extrabold text-xs flex items-center gap-1.5 truncate">
                      <Globe size={11} className="opacity-70" />
                      {dialect.name}
                    </span>
                    {isSelected && (
                      <span className="bg-lavender-accent text-black rounded-full font-mono font-extrabold text-[10px] w-5 h-5 flex items-center justify-center shrink-0">
                        {selectedIndex + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-lavender-text/60 mt-1 line-clamp-2 leading-relaxed">
                    {dialect.description}
                  </p>
                </button>
              );
            })}

            {filteredDialects.length === 0 && (
              <div className="col-span-2 text-center py-6 bg-lavender-surface/10 rounded-xl border border-lavender-border/20">
                <p className="text-xs text-lavender-text/50 italic">No matching dialects or accents found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Languages (Priority Reordering Panel) */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-lavender-border/40 pt-4 lg:pt-0 lg:pl-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-lavender-accent tracking-wider block">
              Active Languages ({selectedIds.length}/4)
            </span>
          </div>
          
          <p className="text-[10px] text-lavender-text/50 leading-relaxed mb-3">
            First language is the <strong className="text-lavender-accent">Primary Language</strong>. Arrange others to composition order using arrows.
          </p>

          <div className="space-y-1.5 flex-1 select-none">
            {selectedIds.map((id, index) => {
              const dialect = findDialectById(id);
              return (
                <div 
                  key={id}
                  className={`flex items-center justify-between gap-2 p-2 bg-lavender-surface/50 border rounded-lg transition-all ${
                    index === 0 
                      ? 'border-lavender-accent bg-lavender-accent/5' 
                      : 'border-lavender-border/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-extrabold flex items-center justify-center ${
                      index === 0 ? 'bg-lavender-accent text-black' : 'bg-lavender-surface border border-lavender-border/40 text-lavender-text/70'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11px] font-extrabold text-lavender-text truncate block">{dialect.name}</span>
                      {index === 0 && (
                        <span className="text-[8px] uppercase tracking-widest font-extrabold text-lavender-accent">Primary</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className={`p-1 rounded hover:bg-lavender-surface text-lavender-text/70 disabled:opacity-20 disabled:hover:bg-transparent`}
                      title="Move Up / Increase Priority"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={index === selectedIds.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className={`p-1 rounded hover:bg-lavender-surface text-lavender-text/70 disabled:opacity-20 disabled:hover:bg-transparent`}
                      title="Move Down / Decrease Priority"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={selectedIds.length <= 1}
                      onClick={() => handleRemove(id)}
                      className={`p-1 rounded hover:bg-red-500/10 text-red-400 disabled:opacity-20 disabled:hover:bg-transparent`}
                      title="Remove Language"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-1.5 text-[10px] text-red-300">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
