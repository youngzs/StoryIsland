
import React, { useState, useEffect } from 'react';
import { AgeGroup, Story, Theme } from '../types';
import { THEMES, AGE_GROUPS, LOADING_MESSAGES, CHARACTERS } from '../constants';
import { generateStory, generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface StoryCreatorProps {
  ageGroup: AgeGroup;
  onStoryGenerated: (story: Story) => void;
}

type Step = 'theme' | 'character';

const StoryCreator: React.FC<StoryCreatorProps> = ({ ageGroup, onStoryGenerated }) => {
  const [step, setStep] = useState<Step>('theme');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [customCharacter, setCustomCharacter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
            const currentIndex = LOADING_MESSAGES.indexOf(prev);
            const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
            return LOADING_MESSAGES[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setStep('character');
  };

  const handleCharacterSelect = (description: string) => {
    setSelectedCharacter(description);
    setCustomCharacter('');
  };

  const handleCustomCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCharacter(e.target.value);
    setSelectedCharacter('');
  };

  const handleGenerateStory = async () => {
    if (!selectedTheme || (!selectedCharacter && !customCharacter)) return;

    setIsLoading(true);
    setError(null);
    const characterPrompt = customCharacter || selectedCharacter;

    try {
      const { title, content, illustrationPrompt, choices } = await generateStory(ageGroup, selectedTheme, characterPrompt);
      const imageUrl = await generateImage(illustrationPrompt, ageGroup);

      onStoryGenerated({ id: Date.now().toString(), title, content, imageUrl, choices });
    } catch (err) {
      console.error(err);
      setError('Oops! The story magic fizzled. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center h-full">
        <LoadingSpinner />
        <p className="text-2xl font-bold text-sky-700 mt-6">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white/70 rounded-2xl shadow-xl animate-fade-in">
        <h2 className="text-center text-3xl font-bold text-slate-700 mb-2">
            Story for a {AGE_GROUPS[ageGroup].label} old!
        </h2>

        {step === 'theme' && (
            <div className="text-center animate-fade-in">
                <p className="text-lg text-slate-500 mb-8">What should the story be about?</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        className="p-4 rounded-2xl text-2xl shadow-md transition-all duration-300 bg-white hover:bg-orange-100 transform hover:scale-105"
                    >
                        {theme.emoji} {theme.label}
                    </button>
                    ))}
                </div>
            </div>
        )}

        {step === 'character' && (
            <div className="text-center animate-fade-in">
                <p className="text-lg text-slate-500 mb-8">Choose your hero!</p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {CHARACTERS.map((char) => (
                        <button
                            key={char.name}
                            onClick={() => handleCharacterSelect(char.description)}
                            className={`p-3 rounded-2xl shadow-md transition-all duration-300 flex flex-col items-center gap-2 ${
                                selectedCharacter === char.description 
                                ? 'bg-orange-500 text-white scale-110 ring-4 ring-orange-300'
                                : 'bg-white hover:bg-orange-100'
                            }`}
                        >
                            <span className="text-3xl">{char.emoji}</span>
                            <span className="font-bold">{char.name}</span>
                        </button>
                    ))}
                </div>
                <div className="my-4 text-slate-500 font-bold">OR</div>
                <input
                    type="text"
                    value={customCharacter}
                    onChange={handleCustomCharacterChange}
                    placeholder="Create your own hero..."
                    className="w-full max-w-md mx-auto p-3 border-2 border-orange-200 rounded-full shadow-inner focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
                 {error && <p className="text-red-500 mt-4">{error}</p>}
                <div className="mt-8 flex justify-center items-center gap-4">
                    <button onClick={() => setStep('theme')} className="px-8 py-3 bg-gray-300 text-slate-700 font-bold rounded-full shadow-lg hover:bg-gray-400 transition-colors">
                        Back
                    </button>
                    <button
                        onClick={handleGenerateStory}
                        disabled={!selectedTheme || (!selectedCharacter && !customCharacter) || isLoading}
                        className="px-12 py-4 bg-green-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105"
                    >
                        Create Story!
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default StoryCreator;
