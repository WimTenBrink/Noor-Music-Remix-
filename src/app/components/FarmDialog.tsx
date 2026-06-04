import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';
import { Home, Leaf, Mic2, Heart, Trees, Wheat, Tractor } from 'lucide-react';
import { motion } from 'motion/react';
import { ABCOUDE_FARM_MD } from '../../constants/help';

interface FarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmDialog: React.FC<FarmDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'document'>('interactive');

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Noor Farm Sanctuary"
      size="full"
    >
      <div className="w-full h-full flex flex-col bg-lavender-bg text-lavender-text font-sans">
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center px-6 py-4 bg-lavender-surface/60 border-b border-lavender-border">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'interactive'
                  ? 'bg-lavender-accent text-lavender-bg shadow-md'
                  : 'hover:bg-lavender-surface text-lavender-text/70'
              }`}
            >
              Farm Sanctuary Overview
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'document'
                  ? 'bg-lavender-accent text-lavender-bg shadow-md'
                  : 'hover:bg-lavender-surface text-lavender-text/70'
              }`}
            >
              System Initialization Document
            </button>
          </div>
          <div className="text-xs font-mono text-lavender-text/40">
            SECURE REPOSITORY // KATJE B.V.
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'document' ? (
            <div className="w-full h-full p-4 overflow-auto">
              <div className="max-w-4xl mx-auto bg-lavender-surface border border-lavender-border rounded-xl shadow-lg h-full overflow-hidden">
                <MarkdownView content={ABCOUDE_FARM_MD} filename="Abcoude_Farm_Description" />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto"
            >
              <div className="bg-lavender-surface p-6 rounded-xl border border-lavender-border shadow-inner space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-lavender-accent">
                    <Home size={24} /> Homestead & Studio
                </h3>
                <ul className="space-y-4 text-sm text-lavender-text/80">
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Five bedrooms (2 for residents, 3 for guests)</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Wellness wing with home spa and sauna</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Gaming entertainment room (4 systems)</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Dedicated sound studio barn with high-end recording gear</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Attic for creative crafting materials</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Server cellar</li>
                </ul>
              </div>

              <div className="bg-lavender-surface p-6 rounded-xl border border-lavender-border shadow-inner space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-lavender-accent">
                    <Trees size={24} /> Farmlands & Life
                </h3>
                <ul className="space-y-4 text-sm text-lavender-text/80">
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> 12 Lakenvelder sheep & 6 dwarf goats</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Orchard (apples, walnuts)</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Rotation: potatoes, grains, spinach</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Greenhouse (paprika, tomatoes)</li>
                  <li className="flex gap-2"><span className="text-lavender-accent font-bold">•</span> Wildflower conservation areas</li>
                  <li className="flex gap-2 text-red-400 font-bold"><span className="text-red-400 font-bold">•</span> Alert: Miranda is forbidden to enter farmlands</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
