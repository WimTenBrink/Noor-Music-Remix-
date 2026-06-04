import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { SONG_EMOTIONS, Emotion } from '../utils/emotions';
import { Smile, Check, Search, Compass, ShieldAlert, Zap, Coffee, Flame, Trophy, Heart, Frown, Sparkles } from 'lucide-react';

interface EmotionSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emotion: string) => void;
  currentEmotionName: string;
}

interface EmotionCategorySpec {
  id: string;
  name: string;
  icon: React.ReactNode;
  emotionIds: string[];
}

const EMOTION_CATEGORIES: EmotionCategorySpec[] = [
  {
    id: 'happy',
    name: 'Happy & Uplifting',
    icon: <Smile size={14} />,
    emotionIds: ['joyful', 'ecstatic', 'euphoric', 'energetic', 'excited', 'playful', 'proud', 'whimsical', 'inspired']
  },
  {
    id: 'triumph',
    name: 'Triumph & Conquest',
    icon: <Trophy size={14} />,
    emotionIds: ['victory', 'triumphant', 'glorious', 'heroic']
  },
  {
    id: 'sensual',
    name: 'Sensual & Passion',
    icon: <Heart size={14} />,
    emotionIds: ['sensual', 'erotic', 'seductive', 'passionate', 'romantic']
  },
  {
    id: 'calm',
    name: 'Peaceful & Serene',
    icon: <Compass size={14} />,
    emotionIds: ['peaceful', 'hopeful', 'serene', 'dreamy', 'compassionate', 'grateful', 'relieved', 'content', 'empathetic']
  },
  {
    id: 'sad',
    name: 'Sad & Nostalgic',
    icon: <Coffee size={14} />,
    emotionIds: ['sad', 'melancholic', 'nostalgic', 'despondent', 'gloomy', 'lonely', 'somber', 'heartbroken', 'vulnerable']
  },
  {
    id: 'defeat',
    name: 'Defeat & Loss',
    icon: <Frown size={14} />,
    emotionIds: ['defeat', 'mournful', 'crushed', 'desolate', 'disillusioned']
  },
  {
    id: 'angry',
    name: 'Angry & Hostile',
    icon: <Flame size={14} />,
    emotionIds: ['angry', 'annoyed', 'resentful', 'hostile', 'frustrated', 'bitter', 'melodramatic', 'nostalgic_bitter', 'cynical', 'skeptical', 'jealous']
  },
  {
    id: 'intense',
    name: 'Anxious & Mystical',
    icon: <Sparkles size={14} />,
    emotionIds: ['anxious', 'terrified', 'overwhelmed', 'mystical', 'cosmic', 'transcendent', 'haunting']
  },
  {
    id: 'neutral',
    name: 'Flat & Patient',
    icon: <Zap size={14} />,
    emotionIds: ['bored', 'apathetic']
  }
];

export const EmotionSelectionDialog: React.FC<EmotionSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentEmotionName
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('happy');
  const [searchQuery, setSearchQuery] = useState('');

  // Find category of current selection when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      // Find emotion by case-insensitive name match
      const matchedEmotionId = SONG_EMOTIONS.find(
        e => e.name.toLowerCase() === currentEmotionName.toLowerCase()
      )?.id || 'joyful';

      const foundCat = EMOTION_CATEGORIES.find(c => c.emotionIds.includes(matchedEmotionId));
      if (foundCat) {
        setSelectedCategoryId(foundCat.id);
      } else {
        setSelectedCategoryId('happy');
      }
    }
  }, [isOpen, currentEmotionName]);

  const activeCategory = EMOTION_CATEGORIES.find(c => c.id === selectedCategoryId) || EMOTION_CATEGORIES[0];

  // Helper/Map to find category for any emotion during search
  const getCategoryOfEmotion = (emotionId: string) => {
    return EMOTION_CATEGORIES.find(c => c.emotionIds.includes(emotionId));
  };

  // Get active list based on category or global search
  const filteredEmotions = searchQuery.trim() !== ''
    ? SONG_EMOTIONS.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SONG_EMOTIONS.filter(e => activeCategory.emotionIds.includes(e.id));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onClear={() => {
        onSelect('Joyful');
        onClose();
      }}
      clearText="Reset to Joyful (Default)"
      title="Select Explore Emotion / Vibe"
      isNested={true}
    >
      <div className="flex flex-col md:flex-row gap-5 max-w-4xl w-[85vw] max-h-[70vh] font-sans text-lavender-text">
        {/* Left Side: Emotion Group Tabs (hidden if searching) */}
        {searchQuery.trim() === '' && (
          <div className="w-full md:w-56 shrink-0 flex flex-col border-r border-lavender-border/40 pr-4 overflow-y-auto max-h-[50vh] md:max-h-none">
            <span className="text-xs font-bold uppercase text-lavender-accent/60 tracking-wider mb-2 block">
              Emotion Categories
            </span>
            <div className="space-y-1">
              {EMOTION_CATEGORIES.map((category) => {
                const isActive = category.id === selectedCategoryId;
                const count = SONG_EMOTIONS.filter(e => category.emotionIds.includes(e.id)).length;
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
                      {category.icon}
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

        {/* Right Side: Options List */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-text/40" />
            <input
              type="text"
              placeholder="Search emotions (e.g. ecstatic, melancholy, somber)..."
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
                : `${activeCategory?.name || 'All'} Emotion Vibes`}
            </span>
          </div>

          {/* Emotions list (Compact Grid) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1 max-h-[45vh] min-h-[25vh]">
            {filteredEmotions.map((emotion) => {
              const isSelected = emotion.name.toLowerCase() === currentEmotionName.toLowerCase();
              const cat = getCategoryOfEmotion(emotion.id);

              return (
                <button
                  key={emotion.id}
                  onClick={() => {
                    onSelect(emotion.name);
                    onClose();
                  }}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-lavender-accent/15 border-lavender-accent text-lavender-accent shadow-md shadow-lavender-accent/5'
                      : 'bg-lavender-surface/40 border-lavender-border hover:border-lavender-accent/40 hover:bg-lavender-surface/85 text-lavender-text'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                      {cat?.icon}
                      {emotion.name}
                    </span>
                    {isSelected && (
                      <span className="bg-lavender-accent text-black rounded-full p-0.5 shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-lavender-text/60 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {emotion.description}
                  </p>
                </button>
              );
            })}

            {filteredEmotions.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-lavender-surface/10 rounded-xl border border-lavender-border/20">
                <p className="text-sm text-lavender-text/50 italic">No matching emotions or vibes found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
