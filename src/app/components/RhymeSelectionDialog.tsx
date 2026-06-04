import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { RHYME_TYPES, RHYME_CATEGORIES, RhymeType, findRhymeTypeById, findRhymeCategoryOfId } from '../utils/rhymes';
import { Music, Zap, Sparkles, Flame, Check, Search, Quote } from 'lucide-react';

interface RhymeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (rhymeId: string) => void;
  currentRhymeId: string;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'music':
      return <Music size={14} />;
    case 'zap':
      return <Zap size={14} />;
    case 'sparkles':
      return <Sparkles size={14} />;
    case 'flame':
      return <Flame size={14} />;
    default:
      return <Quote size={14} />;
  }
};

export const RhymeSelectionDialog: React.FC<RhymeSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentRhymeId
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('classical');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const matchedCategory = findRhymeCategoryOfId(currentRhymeId);
      if (matchedCategory) {
        setSelectedCategoryId(matchedCategory.id);
      } else {
        setSelectedCategoryId('classical');
      }
    }
  }, [isOpen, currentRhymeId]);

  const activeCategory = RHYME_CATEGORIES.find(c => c.id === selectedCategoryId) || RHYME_CATEGORIES[0];

  const filteredRhymeTypes = searchQuery.trim() !== ''
    ? RHYME_TYPES.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : RHYME_TYPES.filter(r => activeCategory.rhymeIds.includes(r.id));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onClear={() => {
        onSelect('perfect');
        onClose();
      }}
      clearText="Reset to Perfect Rhyme (Default)"
      title="Select Rhyme Scheme / Poetic Structure"
      isNested={true}
      size="full"
    >
      <div className="flex flex-col md:flex-row gap-5 h-full max-h-[80vh] font-sans text-lavender-text">
        {/* Left Side: Category Tabs */}
        {searchQuery.trim() === '' && (
          <div className="w-full md:w-64 shrink-0 flex flex-col border-r border-lavender-border/40 pr-4 overflow-y-auto">
            <span className="text-xs font-bold uppercase text-lavender-text/50 tracking-wider mb-2 block">
              Categories
            </span>
            <div className="space-y-1">
              {RHYME_CATEGORIES.map((category) => {
                const isActive = category.id === selectedCategoryId;
                const count = category.rhymeIds.length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-lavender-accent text-black font-extrabold shadow-sm'
                        : 'hover:bg-lavender-surface text-lavender-text/80'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {getCategoryIcon(category.iconName)}
                      {category.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-lavender-surface border border-lavender-border/30 text-lavender-text/50'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side: Rhyme Schemes list */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-text/40" />
            <input
              type="text"
              placeholder="Search rhyme styles (e.g. perfect, subverted, haiku, haka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-lavender-surface border border-lavender-border text-lavender-text rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-lavender-accent placeholder:text-lavender-text/30 font-bold"
            />
          </div>

          {/* Header indicator */}
          <div className="mb-3 px-1">
            <span className="text-xs font-bold text-lavender-accent/70 uppercase tracking-widest block">
              {searchQuery.trim() !== '' 
                ? 'Search Results' 
                : `${activeCategory?.name || 'All'} Styles`}
            </span>
          </div>

          {/* Options Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
            {filteredRhymeTypes.map((rhyme) => {
              const isSelected = rhyme.id === currentRhymeId;
              const cat = findRhymeCategoryOfId(rhyme.id);

              return (
                <button
                  key={rhyme.id}
                  onClick={() => {
                    onSelect(rhyme.id);
                    onClose();
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md shadow-lavender-accent/5'
                      : 'bg-lavender-surface/40 border-lavender-border hover:border-lavender-accent/40 hover:bg-lavender-surface/85 text-lavender-text'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full mb-1">
                    <span className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                      {cat && getCategoryIcon(cat.iconName)}
                      {rhyme.name}
                    </span>
                    {isSelected && (
                      <span className="bg-lavender-accent text-black rounded-full p-0.5 shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-lavender-text/60 line-clamp-3 leading-relaxed font-medium">
                    {rhyme.description}
                  </p>
                </button>
              );
            })}

            {filteredRhymeTypes.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-lavender-surface/10 rounded-xl border border-lavender-border/20">
                <p className="text-sm text-lavender-text/50 italic">No matching rhyme structures found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
