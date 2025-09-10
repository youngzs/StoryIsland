
import React, { useState, useEffect, useCallback } from 'react';
import { AgeGroup, Story, Character } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { PlayIcon } from './icons/PlayIcon';
import { StopIcon } from './icons/StopIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SaveIcon } from './icons/SaveIcon';
import { AGE_GROUPS } from '../constants';
import { continueStory, generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface StoryViewerProps {
  story: Story;
  ageGroup: AgeGroup;
  onReset: () => void;
  onSave: (story: Story) => void;
  isReadOnly: boolean;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, ageGroup, onReset, onSave, isReadOnly }) => {
  const { isSpeaking, speak, cancel } = useSpeechSynthesis();
  const [pitch, setPitch] = useState(AGE_GROUPS[ageGroup].voiceConfig.pitch);
  const [rate, setRate] = useState(AGE_GROUPS[ageGroup].voiceConfig.rate);

  const [currentStory, setCurrentStory] = useState<Story>(story);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // When a new story prop is passed (e.g., from storybooks), update the state
    setCurrentStory(story);
  }, [story]);
  
  useEffect(() => {
    // Stop speaking if the component unmounts or story changes
    return () => {
      cancel();
    }
  }, [cancel, story]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(currentStory.content, { pitch, rate });
    }
  };

  const handleChoice = async (choice: string) => {
    setIsContinuing(true);
    setError(null);
    cancel(); // Stop any current speech
    try {
        const { content: newContent, illustrationPrompt, choices: newChoices } = await continueStory(currentStory.content, choice, ageGroup);
        const newImageUrl = await generateImage(illustrationPrompt, ageGroup);

        setCurrentStory(prev => ({
            ...prev,
            content: prev.content + "\n\n" + newContent,
            imageUrl: newImageUrl,
            choices: newChoices,
        }));
    } catch(err) {
        console.error(err);
        setError("The crystal ball is cloudy... couldn't see what happens next. Try another path!");
    } finally {
        setIsContinuing(false);
    }
  };

  const sliderStyle = "w-full h-2 rounded-lg appearance-none cursor-pointer bg-sky-200 accent-sky-500";

  return (
    <div className="p-6 bg-white/80 rounded-2xl shadow-xl animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 flex-shrink-0 relative">
            <img 
                src={currentStory.imageUrl} 
                alt={currentStory.title} 
                className={`w-full h-auto object-cover rounded-xl shadow-lg aspect-square transition-opacity duration-500 ${isContinuing ? 'opacity-50' : 'opacity-100'}`}
            />
             {isContinuing && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
        </div>
        <div className="md:w-1/2 flex flex-col">
            <h2 className="text-3xl font-black text-slate-800 mb-4">{currentStory.title}</h2>
            <div className="prose prose-lg max-w-none text-slate-600 overflow-y-auto max-h-[400px] flex-grow pr-2">
                {currentStory.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
                ))}
            </div>
        </div>
      </div>

      {/* Interactive Choices */}
      {!isReadOnly && currentStory.choices && currentStory.choices.length > 0 && !isContinuing && (
        <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-4">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStory.choices.map((choice, index) => (
                    <button 
                        key={index}
                        onClick={() => handleChoice(choice)}
                        className="p-4 bg-yellow-200 rounded-lg shadow hover:bg-yellow-300 hover:scale-105 transition-transform text-slate-700"
                    >
                        {choice}
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center items-center gap-4">
              <button 
                onClick={handleToggleSpeech}
                className={`px-8 py-4 flex items-center gap-2 rounded-full text-white text-xl font-bold shadow-lg transition-transform transform hover:scale-105 ${isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'}`}
                aria-label={isSpeaking ? 'Stop reading aloud' : 'Read story aloud'}
              >
                {isSpeaking ? <StopIcon /> : <PlayIcon />}
                {isSpeaking ? 'Stop' : 'Read'}
              </button>
              <button 
                onClick={() => onSave({ ...currentStory, choices: [] })}
                className="px-8 py-4 flex items-center gap-2 rounded-full bg-green-500 text-white text-xl font-bold shadow-lg transition-transform transform hover:scale-105 hover:bg-green-600"
                aria-label="Save this story to your storybooks"
              >
                <SaveIcon />
                Save Story
              </button>
              <button 
                onClick={onReset}
                className="px-8 py-4 flex items-center gap-2 rounded-full bg-orange-500 text-white text-xl font-bold shadow-lg transition-transform transform hover:scale-105 hover:bg-orange-600"
                aria-label="Generate a new story"
              >
                <RefreshIcon />
                New Story
              </button>
          </div>
          <div className="mt-4 w-full max-w-md p-4 bg-sky-50 rounded-lg shadow-inner">
            <h4 className="text-center font-bold text-sky-800 mb-2">Voice Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="pitch" className="block text-sm font-medium text-slate-600 text-center">Pitch</label>
                    <input
                        id="pitch"
                        type="range" min="0.5" max="2" step="0.1" value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className={sliderStyle} aria-label="Adjust voice pitch"
                    />
                    <div className="text-center text-xs text-slate-500 mt-1" aria-hidden="true">{pitch.toFixed(1)}</div>
                </div>
                <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-slate-600 text-center">Speed</label>
                    <input
                        id="rate"
                        type="range" min="0.5" max="2" step="0.1" value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className={sliderStyle} aria-label="Adjust voice speed"
                    />
                    <div className="text-center text-xs text-slate-500 mt-1" aria-hidden="true">{rate.toFixed(1)}</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
