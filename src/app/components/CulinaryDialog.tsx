import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { MarkdownView } from './MarkdownView';
import { CULINARY_DATA, CULINARY_MD } from '../../constants/culinary';
import { Copy, Check, Flame, Award, Trash2, Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CulinaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CulinaryDialog: React.FC<CulinaryDialogProps> = ({ isOpen, onClose }) => {
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
    { id: 'miranda', name: 'Miranda Noor', avatar: '🌊', color: 'from-blue-600/30 to-blue-500/10 border-blue-500/30' },
    { id: 'annelies', name: 'Annelies Brink', avatar: '☀️', color: 'from-emerald-600/30 to-emerald-500/10 border-emerald-500/30' },
    { id: 'fannie', name: 'Fannie de Jong', avatar: '🦨', color: 'from-purple-600/30 to-purple-500/10 border-purple-500/30' },
    { id: 'emma', name: 'Emma Vermeer', avatar: '🌿', color: 'from-red-600/30 to-red-500/10 border-red-500/30' }
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Noor Culinary Database"
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
              Interactive Culinary Profile
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'document'
                  ? 'bg-lavender-accent text-lavender-bg shadow-md'
                  : 'hover:bg-lavender-surface text-lavender-text/70'
              }`}
            >
              Culinary Guideline MD
            </button>
          </div>
          <div className="text-xs font-mono text-lavender-text/40">
            SECURE CULINARY LOGS // KATJE B.V.
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'document' ? (
            <div className="w-full h-full p-4 overflow-auto">
              <div className="max-w-4xl mx-auto bg-lavender-surface border border-lavender-border rounded-xl shadow-lg h-full overflow-hidden">
                <MarkdownView content={CULINARY_MD} filename="Noor_Quartet_Culinary_System" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
              {/* Left Selector + Core Rules Panel */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto">
                {/* Core Rules Section */}
                <div className="bg-lavender-surface/80 border border-lavender-border p-5 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-base font-bold tracking-wider text-lavender-accent uppercase flex items-center gap-2">
                    <Sparkles size={16} />
                    🧬 Core Dietary Rules
                  </h3>
                  
                  {/* The No-Go List */}
                  <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl space-y-1 group relative">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <Trash2 size={12} />
                        The No-Go List
                      </span>
                      <button
                        onClick={() => handleCopyText('dietary-no-go', 'Sauerkraut, excessively bitter raw green vegetables, and any dish prepared by Fannie that requires boiling water or fire.')}
                        className="p-1 hover:bg-red-500/10 rounded text-red-400/40 hover:text-red-400 transition-colors"
                        title="Copy No-Go Rules"
                      >
                        {copiedStates['dietary-no-go'] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-sm text-red-200/90 leading-relaxed font-semibold">
                      Sauerkraut, excessively bitter raw green vegetables, and any dish prepared by Fannie that requires boiling water or fire.
                    </p>
                  </div>

                  {/* The Victory Category */}
                  <div className="bg-green-950/20 border border-green-900/30 p-4 rounded-xl space-y-1 group relative">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                        <Award size={12} />
                        The Victory Category
                      </span>
                      <button
                        onClick={() => handleCopyText('dietary-victory', 'Deep-fried, crispy, golden comfort food, and intensely sweet, aromatic desserts.')}
                        className="p-1 hover:bg-green-500/10 rounded text-green-400/40 hover:text-green-400 transition-colors"
                        title="Copy Victory Card"
                      >
                        {copiedStates['dietary-victory'] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-sm text-green-200/90 leading-relaxed font-semibold">
                      Deep-fried, crispy, golden comfort food, and intensely sweet, aromatic desserts.
                    </p>
                  </div>
                </div>

                {/* Member selector */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold tracking-widest text-lavender-accent uppercase px-2">Singer Profiles</h3>
                  {members.map(member => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member.id)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-center gap-4 ${
                        selectedMember === member.id
                          ? `bg-gradient-to-r ${member.color} border-lavender-accent text-lavender-accent font-bold scale-[1.02] shadow-md`
                          : 'bg-lavender-surface border-lavender-border hover:bg-lavender-surface/80 hover:scale-[1.01]'
                      }`}
                    >
                      <span className="text-3xl">{member.avatar}</span>
                      <div>
                        <div className="text-lg leading-tight">{member.name}</div>
                        <div className="text-xs text-lavender-text/50 font-mono mt-0.5 capitalize">{CULINARY_DATA[member.id]?.personaTitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Profile Detail View */}
              <div className="flex-1 bg-lavender-surface border border-lavender-border rounded-2xl p-6 overflow-y-auto shadow-inner flex flex-col justify-between">
                {(() => {
                  const item = CULINARY_DATA[selectedMember];
                  const currentMember = members.find(m => m.id === selectedMember);
                  if (!item) return null;

                  return (
                    <motion.div
                      key={selectedMember}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      {/* Top bar with name and persona */}
                      <div className="border-b border-lavender-border/60 pb-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{currentMember?.avatar}</span>
                            <div>
                              <h2 className="text-3xl font-extrabold text-lavender-accent tracking-tight">{item.name}</h2>
                              <p className="text-sm font-semibold text-lavender-accent/70 uppercase tracking-widest mt-0.5">{item.personaTitle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Kitchen Disaster Slider Badge */}
                        <div className="flex items-center gap-3 bg-lavender-bg border border-lavender-border/80 px-4 py-2 rounded-xl">
                          <Flame className={item.disasterRating >= 7 ? "text-red-500 animate-bounce" : "text-orange-400"} size={18} />
                          <div>
                            <div className="text-[10px] font-bold text-lavender-text/40 uppercase leading-none tracking-widest">Kitchen Disaster</div>
                            <span className="text-base font-extrabold text-lavender-accent">{item.disasterRating}/10</span>
                          </div>
                        </div>
                      </div>

                      {/* Display of Culinary Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-4">
                        {/* Favorite Meal Box */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-2 group relative">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold tracking-wider text-pink-400 uppercase flex items-center gap-1.5">
                              <UtensilsCrossed size={14} />
                              Favorite Meal
                            </h4>
                            <button
                              onClick={() => handleCopyText(`${selectedMember}-meal`, `${item.favoriteMeal}: ${item.favoriteMealDesc}`)}
                              className="p-1 hover:bg-lavender-surface rounded text-lavender-text/30 hover:text-lavender-accent transition-colors"
                              title="Copy Favorite Meal"
                            >
                              {copiedStates[`${selectedMember}-meal`] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-lavender-text">{item.favoriteMeal}</div>
                            <p className="text-sm text-lavender-text/70 mt-1 leading-relaxed font-medium">
                              {item.favoriteMealDesc}
                            </p>
                          </div>
                        </div>

                        {/* Favorite Dessert Box */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-2 group relative">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold tracking-wider text-yellow-400 uppercase flex items-center gap-1.5">
                              <Sparkles size={14} />
                              Favorite Dessert
                            </h4>
                            <button
                              onClick={() => handleCopyText(`${selectedMember}-dessert`, `${item.favoriteDessert}: ${item.favoriteDessertDesc}`)}
                              className="p-1 hover:bg-lavender-surface rounded text-lavender-text/30 hover:text-lavender-accent transition-colors"
                              title="Copy Favorite Dessert"
                            >
                              {copiedStates[`${selectedMember}-dessert`] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-lavender-text">{item.favoriteDessert}</div>
                            <p className="text-sm text-lavender-text/70 mt-1 leading-relaxed font-medium">
                              {item.favoriteDessertDesc}
                            </p>
                          </div>
                        </div>

                        {/* Signature Drink Box */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-2 group relative">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
                              <Coffee size={14} />
                              Signature Drink
                            </h4>
                            <button
                              onClick={() => handleCopyText(`${selectedMember}-drink`, item.signatureDrink)}
                              className="p-1 hover:bg-lavender-surface rounded text-lavender-text/30 hover:text-lavender-accent transition-colors"
                              title="Copy Signature Drink"
                            >
                              {copiedStates[`${selectedMember}-drink`] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div>
                            <p className="text-sm text-lavender-text/90 font-medium leading-relaxed">
                              {item.signatureDrink}
                            </p>
                          </div>
                        </div>

                        {/* Kitchen Disaster Detail Box */}
                        <div className="bg-lavender-bg border border-lavender-border/40 p-5 rounded-xl space-y-2 group relative">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold tracking-wider text-orange-400 uppercase flex items-center gap-1.5">
                              <Flame size={14} />
                              Kitchen Safety Evaluation
                            </h4>
                            <button
                              onClick={() => handleCopyText(`${selectedMember}-safety`, item.disasterDesc)}
                              className="p-1 hover:bg-lavender-surface rounded text-lavender-text/30 hover:text-lavender-accent transition-colors"
                              title="Copy Safety Review"
                            >
                              {copiedStates[`${selectedMember}-safety`] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div>
                            <p className="text-sm text-lavender-text/90 font-medium leading-relaxed">
                              {item.disasterDesc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Display Rating bar visually */}
                      <div className="mt-6 bg-lavender-bg/60 border border-lavender-border/40 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs font-mono text-lavender-text/40">
                          <span>0 - UTTER KITCHEN MASTER</span>
                          <span>STATION HARBORS EXCESS HEAT</span>
                          <span>10 - HAZARDOUS EVAC PROTOCOL STATE</span>
                        </div>
                        <div className="h-3.5 bg-lavender-border rounded-full overflow-hidden flex">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.disasterRating >= 7 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                              item.disasterRating >= 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${item.disasterRating * 10}%` }}
                          />
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
