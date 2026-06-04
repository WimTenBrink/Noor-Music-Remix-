import React from 'react';
import { LibraryItem } from '../../types';

interface StyleSidebarProps {
  selected?: string[];
  onToggle?: (name: string) => void;
  items?: LibraryItem[];
  onView?: (item: LibraryItem) => void;
  onDelete?: (id: string) => void;
}

export const StyleSidebar: React.FC<StyleSidebarProps> = () => {
  return (
    <aside className="w-[20vw] border-l border-lavender-border bg-lavender-bg flex flex-col h-full overflow-hidden shrink-0 select-none">
      {/* Fannie de Jong Section */}
      <div className="flex-1 relative group overflow-hidden border-b border-lavender-border">
        <img 
          src="/singers/Fannie_de_Jong.jpg" 
          alt="Fannie de Jong" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-5">
          <h3 className="font-extrabold text-lg tracking-wide text-lavender-text mb-0.5 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Fannie de Jong
          </h3>
          <p className="font-mono text-xs font-semibold tracking-wider text-lavender-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            Mezzo-Soprano &middot; Drums
          </p>
        </div>
      </div>

      {/* Emma Vermeer Section */}
      <div className="flex-1 relative group overflow-hidden">
        <img 
          src="/singers/Emma_Vermeer.jpg" 
          alt="Emma Vermeer" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-5">
          <h3 className="font-extrabold text-lg tracking-wide text-lavender-text mb-0.5 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Emma Vermeer
          </h3>
          <p className="font-mono text-xs font-semibold tracking-wider text-lavender-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            Contralto &middot; Synthesizers
          </p>
        </div>
      </div>
    </aside>
  );
};
