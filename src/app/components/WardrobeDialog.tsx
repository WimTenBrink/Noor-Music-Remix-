import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';
import { WARDROBE_DATA, WARDROBE_MD } from '../../constants/wardrobe';
import { Copy, Check, Palette, Sparkles, Footprints } from 'lucide-react';
import { motion } from 'motion/react';

interface WardrobeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WardrobeDialog: React.FC<WardrobeDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'document'>('interactive');
  const [selectedMember, setSelectedMember] = useState<string>('fannie');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const members = [
    { id: 'miranda', name: 'Miranda Noor', color: 'from-blue-600/30 to-blue-500/10 border-blue-500/30' },
    { id: 'annelies', name: 'Annelies Brink', color: 'from-emerald-600/30 to-emerald-500/10 border-emerald-500/30' },
    { id: 'fannie', name: 'Fannie de Jong', color: 'from-purple-600/30 to-purple-500/10 border-purple-500/30' },
    { id: 'emma', name: 'Emma Vermeer', color: 'from-red-600/30 to-red-500/10 border-red-500/30' }
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Noor Wardrobe System"
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
              Interactive Closets
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
        <div className="flex-1 overflow-hidden">
          {activeTab === 'document' ? (
            <div className="w-full h-full p-4 overflow-auto">
              <div className="max-w-4xl mx-auto bg-lavender-surface border border-lavender-border rounded-xl shadow-lg h-full overflow-hidden">
                <MarkdownView content={WARDROBE_MD} filename="Noor_Quartet_Wardrobe_System" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
              {/* Member Selector Left Panel */}
              <div className="w-full md:w-1/4 flex flex-col gap-3 overflow-y-auto">
                <h3 className="text-sm font-semibold tracking-widest text-lavender-accent uppercase px-2 mb-2">Quartet Members</h3>
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      selectedMember === member.id
                        ? `bg-gradient-to-r ${member.color} border-lavender-accent text-lavender-accent font-bold scale-[1.02] shadow-md`
                        : 'bg-lavender-surface border-lavender-border hover:bg-lavender-surface/80 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="text-lg">{member.name}</div>
                    <div className="text-xs text-lavender-text/50 font-mono mt-1 capitalize">{member.id} wardrobe keys active</div>
                  </button>
                ))}
              </div>

              {/* Selected Closet Detail View */}
              <div className="flex-1 bg-lavender-surface border border-lavender-border rounded-2xl p-6 overflow-y-auto shadow-inner">
                {(() => {
                  const data = WARDROBE_DATA[selectedMember];
                  const currentMember = members.find(m => m.id === selectedMember);
                  if (!data) return null;

                  const copyIdColor = `${selectedMember}-palette`;

                  return (
                    <motion.div
                      key={selectedMember}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-start border-b border-lavender-border/60 pb-4">
                        <div>
                          <h2 className="text-3xl font-extrabold text-lavender-accent tracking-tight">{currentMember?.name}</h2>
                          <p className="text-xs font-mono text-lavender-text/50 uppercase mt-1">Status: Active Wardrobe Synchronization</p>
                        </div>
                        
                        {/* Interactive Copy Item */}
                        <div className="flex items-center gap-2 bg-lavender-surface border border-lavender-border px-3 py-1.5 rounded-lg text-xs leading-none">
                          <Palette size={14} className="text-lavender-accent animate-pulse" />
                          <span className="font-mono text-lavender-text/80">{data.palette}</span>
                          <button
                            onClick={() => handleCopyText(copyIdColor, data.palette)}
                            className="p-1 hover:bg-lavender-surface rounded text-lavender-text/40 hover:text-lavender-accent ml-2"
                            title="Copy Palette"
                          >
                            {copiedStates[copyIdColor] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Wardrobe Grid Categories */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Underwear Card */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-3 shadow-md relative group">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold tracking-wider text-lavender-text/60 uppercase flex items-center gap-2">
                              <Sparkles size={14} className="text-lavender-accent" />
                              Underwear Layer
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {data.underwear.map((item, idx) => {
                              const copyKey = `${selectedMember}-uw-${idx}`;
                              return (
                                <li key={idx} className="flex justify-between items-center text-sm font-medium border-b border-lavender-border/20 pb-1.5 hover:border-lavender-accent/30 transition-colors">
                                  <span>{item}</span>
                                  <button
                                    onClick={() => handleCopyText(copyKey, item)}
                                    className="p-1 hover:bg-lavender-surface rounded text-lavender-text/20 hover:text-lavender-accent transition-colors"
                                    title="Copy item name"
                                  >
                                    {copiedStates[copyKey] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Casual Card */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-3 shadow-md relative group">
                          <h4 className="text-sm font-bold tracking-wider text-lavender-text/60 uppercase flex items-center gap-2">
                            <Sparkles size={14} className="text-lavender-accent" />
                            Casual Wear
                          </h4>
                          <ul className="space-y-2">
                            {data.casual.map((item, idx) => {
                              const copyKey = `${selectedMember}-cas-${idx}`;
                              return (
                                <li key={idx} className="flex justify-between items-center text-sm font-medium border-b border-lavender-border/20 pb-1.5 hover:border-lavender-accent/30 transition-colors">
                                  <span>{item}</span>
                                  <button
                                    onClick={() => handleCopyText(copyKey, item)}
                                    className="p-1 hover:bg-lavender-surface rounded text-lavender-text/20 hover:text-lavender-accent transition-colors"
                                    title="Copy item name"
                                  >
                                    {copiedStates[copyKey] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Official Card */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-3 shadow-md relative group">
                          <h4 className="text-sm font-bold tracking-wider text-lavender-text/60 uppercase flex items-center gap-2">
                            <Sparkles size={14} className="text-lavender-accent" />
                            Official Outfits
                          </h4>
                          <ul className="space-y-2">
                            {data.official.map((item, idx) => {
                              const copyKey = `${selectedMember}-off-${idx}`;
                              return (
                                <li key={idx} className="flex justify-between items-center text-sm font-medium border-b border-lavender-border/20 pb-1.5 hover:border-lavender-accent/30 transition-colors">
                                  <span>{item}</span>
                                  <button
                                    onClick={() => handleCopyText(copyKey, item)}
                                    className="p-1 hover:bg-lavender-surface rounded text-lavender-text/20 hover:text-lavender-accent transition-colors"
                                    title="Copy item name"
                                  >
                                    {copiedStates[copyKey] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Gala Card */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-3 shadow-md relative group">
                          <h4 className="text-sm font-bold tracking-wider text-lavender-text/60 uppercase flex items-center gap-2">
                            <Sparkles size={14} className="text-lavender-accent" />
                            Gala Closets
                          </h4>
                          <ul className="space-y-2">
                            {data.gala.map((item, idx) => {
                              const copyKey = `${selectedMember}-gala-${idx}`;
                              return (
                                <li key={idx} className="flex justify-between items-center text-sm font-medium border-b border-lavender-border/20 pb-1.5 hover:border-lavender-accent/30 transition-colors">
                                  <span>{item}</span>
                                  <button
                                    onClick={() => handleCopyText(copyKey, item)}
                                    className="p-1 hover:bg-lavender-surface rounded text-lavender-text/20 hover:text-lavender-accent transition-colors"
                                    title="Copy item name"
                                  >
                                    {copiedStates[copyKey] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Swimwear Card */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl col-span-1 md:col-span-2 space-y-3 shadow-md relative group">
                          <h4 className="text-sm font-bold tracking-wider text-lavender-text/60 uppercase flex items-center gap-2">
                            <Footprints size={14} className="text-lavender-accent" />
                            Swimwear / Active Set
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.swimwear.map((item, idx) => {
                              const copyKey = `${selectedMember}-swim-${idx}`;
                              return (
                                <li key={idx} className="flex justify-between items-center text-sm font-medium border-b border-lavender-border/20 pb-1.5 hover:border-lavender-accent/30 transition-colors">
                                  <span>{item}</span>
                                  <button
                                    onClick={() => handleCopyText(copyKey, item)}
                                    className="p-1 hover:bg-lavender-surface rounded text-lavender-text/20 hover:text-lavender-accent transition-colors"
                                    title="Copy item name"
                                  >
                                    {copiedStates[copyKey] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
