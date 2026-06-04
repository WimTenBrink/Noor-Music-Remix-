import React, { useEffect, useState } from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';

interface SingerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  singer: {
    name: string;
    photo: string;
    bioPath: string;
  } | null;
}

export const SingerDialog: React.FC<SingerDialogProps> = ({ isOpen, onClose, singer }) => {
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && singer) {
      setLoading(true);
      fetch(singer.bioPath)
        .then(res => res.text())
        .then(text => {
          setBio(text);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load bio:', err);
          setBio('Failed to load biography.');
          setLoading(false);
        });
    }
  }, [isOpen, singer]);

  if (!singer) return null;

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={singer.name}
      size="full"
    >
      <div className="w-full h-full overflow-auto p-8 bg-lavender-bg">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lavender-accent"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto h-full">
            <MarkdownView 
              content={bio} 
              filename={singer.bioPath.split('/').pop()?.replace('.md', '') || singer.name}
            >
              <img 
                src={singer.photo} 
                alt={singer.name} 
                className="float-left mr-8 mb-4 w-64 h-auto"
                referrerPolicy="no-referrer"
              />
            </MarkdownView>
          </div>
        )}
      </div>
    </Dialog>
  );
};
