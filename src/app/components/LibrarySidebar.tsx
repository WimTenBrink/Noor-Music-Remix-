import React from 'react';
import { LibraryItem } from '../../types';
import { Trash2, Eye, Music, Image as ImageIcon, FileCode, FileText, FileJson } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LibrarySidebarProps {
  title: string;
  items: LibraryItem[];
  onView: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
  side: 'left' | 'right';
}

export const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ title, items, onView, onDelete, side }) => {
  const getItemIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'song': return <Music size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'xml': return <FileCode size={14} />;
      case 'json': return <FileJson size={14} />;
      case 'markdown': return <FileText size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <aside className="w-[20vw] border-r border-l border-lavender-border bg-lavender-bg/80 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-lavender-border bg-lavender-surface/30">
        <h3 className="text-xs font-bold text-lavender-accent uppercase tracking-widest">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {sortedItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-lavender-text/30 italic">Empty</div>
        ) : (
          <div className="flex flex-col gap-1">
            {sortedItems.map(item => (
              <div 
                key={item.id} 
                className="group flex items-center justify-between p-2 rounded hover:bg-lavender-surface/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-lavender-accent/50">{getItemIcon(item.type)}</div>
                  <span className="text-xs truncate font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onView(item)}
                    className="p-1 hover:bg-lavender-accent hover:text-lavender-bg rounded text-lavender-accent transition-colors"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1 hover:bg-red-500 hover:text-white rounded text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
