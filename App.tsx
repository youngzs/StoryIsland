
import React, { useState, useCallback, useEffect } from 'react';
import { AgeGroup, Story } from './types';
import AgeSelector from './components/AgeSelector';
import StoryCreator from './components/StoryCreator';
import StoryViewer from './components/StoryViewer';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import MyStorybooks from './components/MyStorybooks';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';

type View = 'age-selector' | 'creator' | 'viewer' | 'my-storybooks';

const App: React.FC = () => {
  const [view, setView] = useState<View>('age-selector');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [storybooks, setStorybooks] = useState<Story[]>(() => loadFromLocalStorage('storybooks') || []);

  useEffect(() => {
    const savedAgeGroup = loadFromLocalStorage<AgeGroup>('ageGroup');
    if (savedAgeGroup) {
      setAgeGroup(savedAgeGroup);
      setView('creator');
    }
  }, []);

  const handleAgeSelect = useCallback((selectedAgeGroup: AgeGroup) => {
    setAgeGroup(selectedAgeGroup);
    saveToLocalStorage('ageGroup', selectedAgeGroup);
    setView('creator');
    setIsSettingsOpen(false);
  }, []);

  const handleStoryGenerated = useCallback((generatedStory: Story) => {
    setStory(generatedStory);
    setView('viewer');
  }, []);

  const handleReset = useCallback(() => {
    setStory(null);
    setView('creator');
  }, []);
  
  const handleResetAll = useCallback(() => {
    setStory(null);
    if(loadFromLocalStorage('ageGroup')) {
        setView('creator');
    } else {
        setView('age-selector');
    }
  }, []);

  const handleSaveStory = useCallback((storyToSave: Story) => {
    const updatedStorybooks = [storyToSave, ...storybooks.filter(s => s.id !== storyToSave.id)];
    setStorybooks(updatedStorybooks);
    saveToLocalStorage('storybooks', updatedStorybooks);
    alert('Story saved to your storybooks!');
  }, [storybooks]);
  
  const viewStorybook = (book: Story) => {
    setStory(book);
    setView('viewer');
  }

  const renderContent = () => {
    switch (view) {
      case 'age-selector':
        return <AgeSelector onSelect={handleAgeSelect} />;
      case 'creator':
        if (!ageGroup) {
            setView('age-selector');
            return null;
        }
        return <StoryCreator ageGroup={ageGroup} onStoryGenerated={handleStoryGenerated} />;
      case 'viewer':
        if (!story || !ageGroup) {
            setView('age-selector');
            return null;
        }
        return <StoryViewer 
            story={story} 
            ageGroup={ageGroup} 
            onReset={handleReset} 
            onSave={handleSaveStory}
            isReadOnly={storybooks.some(s => s.id === story.id)}
        />;
      case 'my-storybooks':
        return <MyStorybooks storybooks={storybooks} onSelectStory={viewStorybook} />;
      default:
        return <AgeSelector onSelect={handleAgeSelect} />;
    }
  };

  return (
    <div className="bg-sky-100 min-h-screen text-slate-800 flex flex-col items-center p-4">
      <Header 
        onLogoClick={handleResetAll} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onMyStorybooksClick={() => setView('my-storybooks')}
      />
      <main className="w-full max-w-4xl mx-auto mt-8 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-sky-600 text-sm">
        <p>Welcome to Wonderful Story Island!</p>
      </footer>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentAgeGroup={ageGroup}
        onAgeGroupChange={handleAgeSelect}
      />
    </div>
  );
};

export default App;
