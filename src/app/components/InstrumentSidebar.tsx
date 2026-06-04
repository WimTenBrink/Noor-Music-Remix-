import React from 'react';
import { LibraryItem } from '../../types';

interface InstrumentSidebarProps {
  selected?: string[];
  onToggle?: (name: string) => void;
  items?: LibraryItem[];
  onView?: (item: LibraryItem) => void;
  onDelete?: (id: string) => void;
}

export const InstrumentSidebar: React.FC<InstrumentSidebarProps> = () => {
  return (
    <aside className="w-[20vw] border-r border-lavender-border bg-lavender-bg flex flex-col h-full overflow-hidden shrink-0 select-none">
      {/* Miranda Noor Section */}
      <div className="flex-1 relative group overflow-hidden border-b border-lavender-border">
        <img 
          src="/singers/Miranda_Noor.jpg" 
          alt="Miranda Noor" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-5">
          <h3 className="font-extrabold text-lg tracking-wide text-lavender-text mb-0.5 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Miranda Noor
          </h3>
          <p className="font-mono text-xs font-semibold tracking-wider text-lavender-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            Soprano &middot; Lead Vocals
          </p>
        </div>
      </div>

      {/* Annelies Brink Section */}
      <div className="flex-1 relative group overflow-hidden">
        <img 
          src="/singers/Annelies_Brink.jpg" 
          alt="Annelies Brink" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-5">
          <h3 className="font-extrabold text-lg tracking-wide text-lavender-text mb-0.5 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Annelies Brink
          </h3>
          <p className="font-mono text-xs font-semibold tracking-wider text-lavender-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            Alto &middot; Rhythm Guitar
          </p>
        </div>
      </div>
    </aside>
  );
};
