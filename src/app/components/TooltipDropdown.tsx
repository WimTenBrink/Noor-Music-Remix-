import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Tooltip } from './Tooltip';

export interface TooltipDropdownOption {
  id: string;
  name: string;
  tooltipTitle: string;
  tooltipContent: string;
}

interface TooltipDropdownProps {
  label: string;
  options: TooltipDropdownOption[];
  selectedValue: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export const TooltipDropdown: React.FC<TooltipDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === selectedValue) || options[0];

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

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">{label}</label>
      
      <button
        type="button"
        onClick={() => !loading && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent font-sans cursor-pointer transition-colors hover:border-lavender-accent/50 text-left min-h-[58px]"
        disabled={loading}
      >
        <span className="font-medium text-white">
          {selectedOption ? selectedOption.name : 'Select option...'}
        </span>
        <ChevronDown size={18} className={`text-lavender-text/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-lavender-surface border border-lavender-accent/50 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-md animate-fade-in max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = option.id === selectedValue;
              return (
                <div key={option.id} className="w-full">
                  <Tooltip title={option.tooltipTitle} content={option.tooltipContent} className="block w-full">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(option.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                        isSelected 
                          ? 'bg-lavender-accent text-black font-extrabold' 
                          : 'text-lavender-text hover:bg-lavender-accent/20 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{option.name}</span>
                      {isSelected && <Check size={16} className={isSelected ? 'text-black' : 'text-lavender-accent'} />}
                    </button>
                  </Tooltip>
                </div>
              );
            })}
            {options.length === 0 && (
              <div className="px-4 py-3 text-sm text-lavender-text/40 italic">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
