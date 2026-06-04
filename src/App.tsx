/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './app/components/Header';
import { InstrumentSidebar } from './app/components/InstrumentSidebar';
import { StyleSidebar } from './app/components/StyleSidebar';
import { MainPanel } from './app/components/MainPanel';
import { StatusBar } from './app/components/StatusBar';
import { JobDialog } from './app/components/JobDialog';
import { LogDialog } from './app/components/LogDialog';
import { HelpDialog } from './app/components/HelpDialog';
import { GenerateDialog } from './app/components/GenerateDialog';
import { KaraokeDialog } from './app/components/KaraokeDialog';
import { SpoilerDialog } from './app/components/SpoilerDialog';
import { ImagePromptsDialog } from './app/components/ImagePromptsDialog';
import { useNoorApp } from './app/hooks/useNoorApp';
import { useLogs } from './app/hooks/useLogs';
import { TextView } from './app/components/TextView';
import { TreeView } from './app/components/TreeView';
import { ImageView } from './app/components/ImageView';
import { MarkdownView } from './app/components/MarkdownView';
import { SingerDialog } from './app/components/SingerDialog';
import { StoryDialog } from './app/components/StoryDialog';
import { PortraitDialog } from './app/components/PortraitDialog';
import { ContentDialog } from './app/components/ContentDialog';
import { WardrobeDialog } from './app/components/WardrobeDialog';
import { CulinaryDialog } from './app/components/CulinaryDialog';
import { FarmDialog } from './app/components/FarmDialog';
import { DoubleFailedDialog } from './app/components/DoubleFailedDialog';
import { X } from 'lucide-react';
import { TooltipProvider } from './app/components/Tooltip';

export default function App() {
  const {
    song,
    setSong,
    selectedInstruments,
    handleToggleInstrument,
    selectedStyles,
    handleToggleStyle,
    activeJob,
    setActiveJob,
    showLogs,
    setShowLogs,
    showGenerate,
    setShowGenerate,
    showKaraoke,
    setShowKaraoke,
    showSpoiler,
    setShowSpoiler,
    showImagePrompts,
    setShowImagePrompts,
    showStory,
    setShowStory,
    showPortrait,
    setShowPortrait,
    showWardrobe,
    setShowWardrobe,
    showCulinary,
    setShowCulinary,
    showFarm,
    setShowFarm,
    doubleFailedJob,
    setDoubleFailedJob,
    activePortraitType,
    portraitPrompts,
    handleGeneratePortraits,
    handleUpdateImagePrompt,
    handleGenerateStoryPrompts,
    rating,
    setRating,
    selectedDialectId,
    setSelectedDialectId,
    selfReflect,
    helpContent,
    setHelpContent,
    selectedSinger,
    setSelectedSinger,
    handleAction,
    handleGenerate,
    leftLibrary,
    rightLibrary,
    removeFromLibrary,
    viewItem,
    setViewItem,
    handleFileDrop,
    showContentSettings,
    setShowContentSettings,
    forbiddenTopics,
    handleToggleForbiddenTopic,
    jobs,
    innuendoLevel,
    reverseLyricsEnabled,
    epicLevel,
    rhymeId,
  } = useNoorApp();

  const { logs } = useLogs();

  const renderMainContent = () => {
    if (viewItem) {
      return (
        <div className="flex-1 flex flex-col overflow-hidden bg-black/50 relative">
          <div className="p-4 border-b border-lavender-border flex justify-between items-center bg-lavender-bg/80">
            <h2 className="text-xl font-bold text-lavender-accent">{viewItem.name}</h2>
            <button 
              onClick={() => setViewItem(null)}
              className="p-2 hover:bg-lavender-surface rounded text-red-500"
              title="Close View"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {viewItem.type === 'song' && (
              <div className="p-8">
                <MarkdownView 
                  content={`# ${viewItem.content.title}\n\n**Style:** ${viewItem.content.style}\n\n---\n\n${viewItem.content.lyrics}`} 
                />
              </div>
            )}
            {viewItem.type === 'image' && <ImageView src={viewItem.content} />}
            {viewItem.type === 'json' && <TreeView data={viewItem.content} isRoot />}
            {viewItem.type === 'xml' && <TreeView data={viewItem.content} isRoot />}
            {viewItem.type === 'text' && <TextView content={viewItem.content} />}
          </div>
        </div>
      );
    }

    return (
      <MainPanel 
        song={song} 
        onChange={setSong} 
        onDropFile={handleFileDrop}
        jobs={jobs}
      />
    );
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-lavender-bg text-lavender-text selection:bg-lavender-accent selection:text-lavender-bg">
        <Header 
          onAction={handleAction} 
          onGenerate={() => setShowGenerate(true)}
          onShowLogs={() => setShowLogs(true)}
        />
        
        <main className="flex-1 flex overflow-hidden">
          <InstrumentSidebar 
            selected={selectedInstruments}
            onToggle={handleToggleInstrument}
            items={leftLibrary}
            onView={setViewItem}
            onDelete={(id) => removeFromLibrary(id, 'left')}
          />
          
          {renderMainContent()}
          
          <StyleSidebar 
            selected={selectedStyles}
            onToggle={handleToggleStyle}
            items={rightLibrary}
            onView={setViewItem}
            onDelete={(id) => removeFromLibrary(id, 'right')}
          />
        </main>

        <StatusBar onShowJob={setActiveJob} />

        {/* Dialogs */}
        <JobDialog 
          job={activeJob} 
          onClose={() => setActiveJob(null)} 
        />
        
        <LogDialog 
          isOpen={showLogs} 
          onClose={() => setShowLogs(false)} 
          logs={logs} 
        />
        
        {helpContent && (
          <HelpDialog 
            isOpen={!!helpContent} 
            onClose={() => setHelpContent(null)} 
            title={helpContent.title} 
            content={helpContent.content} 
            filename={helpContent.filename}
          />
        )}

        <GenerateDialog 
          isOpen={showGenerate} 
          onClose={() => setShowGenerate(false)} 
          onConfirm={handleGenerate} 
          selectedInstruments={selectedInstruments}
          selectedStyles={selectedStyles}
          currentDialectId={selectedDialectId}
          currentRating={rating}
          selfReflect={selfReflect}
          currentInnuendoLevel={innuendoLevel}
          reverseLyrics={reverseLyricsEnabled}
          currentEpicLevel={epicLevel}
          currentRhymeId={rhymeId}
        />

        <KaraokeDialog 
          isOpen={showKaraoke}
          onClose={() => setShowKaraoke(false)}
          title={song.title}
          lyrics={song.lyrics}
        />

        <SpoilerDialog 
          isOpen={showSpoiler}
          onClose={() => setShowSpoiler(false)}
          songTitle={song.title}
          interviewContent={song.interview}
        />

        <SingerDialog 
          isOpen={!!selectedSinger}
          onClose={() => setSelectedSinger(null)}
          singer={selectedSinger}
        />

        <ImagePromptsDialog 
          isOpen={showImagePrompts}
          onClose={() => setShowImagePrompts(false)}
          prompts={song.imagePrompts || { start: '', middle: '', end: '' }}
          onUpdatePrompt={handleUpdateImagePrompt}
        />

        <StoryDialog
          isOpen={showStory}
          onClose={() => setShowStory(false)}
          story={song.story || ''}
          prompts={song.storyPrompts || {
            miranda: { wan: '', sdxl: '' },
            annelies: { wan: '', sdxl: '' },
            fannie: { wan: '', sdxl: '' },
            emma: { wan: '', sdxl: '' },
            mirandaAnnelies: { wan: '', sdxl: '' },
            fannieEmma: { wan: '', sdxl: '' },
            group: { wan: '', sdxl: '' }
          }}
          onGenerate={handleGenerateStoryPrompts}
          onUpdateStory={(story) => setSong(prev => ({ ...prev, story }))}
          songTitle={song.title || 'Untitled Song'}
        />

        <PortraitDialog
          isOpen={showPortrait}
          onClose={() => setShowPortrait(false)}
          type={activePortraitType}
          prompts={portraitPrompts[activePortraitType]}
          onRegenerate={handleGeneratePortraits}
        />

        <ContentDialog
          isOpen={showContentSettings}
          onClose={() => setShowContentSettings(false)}
          topics={forbiddenTopics}
          onToggle={handleToggleForbiddenTopic}
        />
        <WardrobeDialog
          isOpen={showWardrobe}
          onClose={() => setShowWardrobe(false)}
        />
        <CulinaryDialog
          isOpen={showCulinary}
          onClose={() => setShowCulinary(false)}
        />
        <FarmDialog
          isOpen={showFarm}
          onClose={() => setShowFarm(false)}
        />
        <DoubleFailedDialog
          job={doubleFailedJob}
          onClose={() => setDoubleFailedJob(null)}
        />
      </div>
    </TooltipProvider>
  );
}

