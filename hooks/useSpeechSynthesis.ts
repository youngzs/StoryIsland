
import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); // Initial load

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, config: { pitch: number; rate: number }) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a suitable, high-quality voice
    const preferredVoices = [
        'Microsoft Zira Desktop - English (United States)', // Windows
        'Google US English', // Chrome OS
        'Samantha', // macOS
    ];
    let selectedVoice = null;
    for (const name of preferredVoices) {
        selectedVoice = voices.find(v => v.name === name);
        if (selectedVoice) break;
    }
    
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Female')) 
                     || voices.find(voice => voice.lang.startsWith('en-US')) 
                     || voices.find(voice => voice.lang.startsWith('en')) 
                     || null;
    }

    utterance.voice = selectedVoice;
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, voices]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, cancel };
};
