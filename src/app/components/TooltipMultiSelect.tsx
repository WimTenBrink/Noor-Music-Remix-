import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Tooltip } from './Tooltip';

export interface TooltipMultiSelectOption {
  id: string;
  name: string;
  tooltipTitle: string;
  tooltipContent: string;
}

interface TooltipMultiSelectProps {
  label: string;
  options: TooltipMultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  placeholder?: string;
}

export const TooltipMultiSelect: React.FC<TooltipMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  maxSelections = 5,
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((val) => val !== id));
    } else if (selectedValues.length < maxSelections) {
      onChange([...selectedValues, id]);
    }
  };

  const selectedDisplayNames = options
    .filter((opt) => selectedValues.includes(opt.id))
    .map((o) => o.name);

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">{label}</label>
        <span className="text-xs bg-lavender-surface px-2 py-0.5 rounded border border-lavender-border text-lavender-text/70 font-mono">
          {selectedValues.length} / {maxSelections} selected
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent font-sans cursor-pointer transition-colors hover:border-lavender-accent/50 text-left min-h-[58px]"
      >
        <span className="font-medium truncate pr-4 text-white">
          {selectedDisplayNames.length > 0
            ? selectedDisplayNames.join(', ')
            : placeholder}
        </span>
        <ChevronDown size={18} className={`text-lavender-text/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-lavender-surface border border-lavender-accent/50 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-md animate-fade-in max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              const isDisabled = !isSelected && selectedValues.length >= maxSelections;

              return (
                <div key={option.id} className="w-full">
                  <Tooltip 
                    title={option.tooltipTitle} 
                    content={option.tooltipContent + (isDisabled ? ' (Selection limit reached)' : '')} 
                    className="block w-full"
                    disabled={false}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(option.id)}
                      disabled={isDisabled}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                        isSelected 
                          ? 'bg-lavender-accent/20 text-lavender-accent font-bold' 
                          : isDisabled
                            ? 'text-lavender-text/30 cursor-not-allowed bg-black/10'
                            : 'text-lavender-text hover:bg-lavender-surface/80 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{option.name}</span>
                      {isSelected && <Check size={16} className="text-lavender-accent" />}
                    </button>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
