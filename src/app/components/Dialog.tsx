import React, { useState } from 'react';
import { X, Check, Copy, Check as CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onClear?: () => void;
  clearText?: string;
  title: string;
  children: React.ReactNode;
  size?: 'normal' | 'large' | 'full';
  isNested?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onClear,
  clearText,
  title, 
  children, 
  size = 'normal',
  isNested = false
}) => {
  if (!isOpen) return null;

  const width = isNested ? '90vw' : '95vw';
  const height = isNested ? '90vh' : '95vh';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{ width: size === 'full' ? width : 'auto', height: size === 'full' ? height : 'auto' }}
          className="bg-lavender-bg border border-lavender-border rounded-lg shadow-2xl flex flex-col max-w-[95vw] max-h-[95vh]"
        >
          <div className="flex items-center justify-between p-4 border-b border-lavender-border">
            <h2 className="text-2xl font-bold text-lavender-accent">{title}</h2>
            <div className="flex items-center gap-4">
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="px-3 py-1.5 text-xs font-bold text-lavender-text/70 bg-lavender-surface hover:bg-red-500/10 hover:text-red-400 border border-lavender-border/40 hover:border-red-500/30 rounded transition-all"
                  title={clearText || "Clear all options"}
                >
                  Clear All
                </button>
              )}
              <button 
                onClick={onConfirm || onClose}
                className="p-1 text-green-500 hover:bg-green-500/10 rounded cursor-pointer"
                title="OK"
              >
                <Check size={24} />
              </button>
              <button 
                onClick={onClose}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                title="Cancel"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AlertDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => (
  <Dialog isOpen={isOpen} onClose={onClose} onConfirm={onClose} title={title}>
    <div className="p-4 text-center">
      <p className="text-lg">{message}</p>
    </div>
  </Dialog>
);
