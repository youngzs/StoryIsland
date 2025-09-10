
import { AgeGroup, Theme, AgeGroupDetails, Character } from './types';

export const THEMES: { id: Theme; label: string; emoji: string; }[] = [
  { id: 'fantasy', label: 'Fantasy', emoji: '🏰' },
  { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'friendship', label: 'Friendship', emoji: '🤗' },
];

export const CHARACTERS: Character[] = [
    { name: 'Brave Knight', description: 'A knight who is brave and kind, with shiny armor.', emoji: '🛡️' },
    { name: 'Curious Astronaut', description: 'An astronaut who loves exploring stars and new planets.', emoji: '🧑‍🚀' },
    { name: 'Magical Fairy', description: 'A fairy with sparkling wings who can talk to animals.', emoji: '🧚‍♀️' },
    { name: 'Clever Detective', description: 'A detective who can solve any mystery with their big magnifying glass.', emoji: '🕵️' },
    { name: 'Shy Dragon', description: 'A small, friendly dragon who breathes bubbles instead of fire.', emoji: '🐲' },
];

export const AGE_GROUPS: Record<AgeGroup, AgeGroupDetails> = {
  '3-5': {
    label: '3-5 years',
    storyPromptModifier: 'Use very simple language, short sentences, and a linear, repetitive plot. Focus on basic concepts like colors, shapes, and animals. The story should be around 200 words.',
    illustrationStyle: 'Simple cartoon style illustration for toddlers, bright primary colors, cute friendly characters with big eyes, minimal background details, safe and happy appearance.',
    voiceConfig: { pitch: 1.2, rate: 0.8 },
    color: 'bg-green-400'
  },
  '5-7': {
    label: '5-7 years',
    storyPromptModifier: 'Use simple but slightly more descriptive language. The plot can have a simple problem and resolution. Introduce themes of friendship and sharing. The story should be around 400 words.',
    illustrationStyle: 'Colorful children\'s book illustration, cartoon style, expressive characters, moderately detailed backgrounds, warm and inviting atmosphere.',
    voiceConfig: { pitch: 1.1, rate: 0.9 },
    color: 'bg-yellow-400'
  },
  '7-9': {
    label: '7-9 years',
    storyPromptModifier: 'Use richer vocabulary and more complex sentences. The plot can have multiple steps to solve a problem and introduce teamwork. The story should be around 800 words.',
    illustrationStyle: 'Detailed children\'s book illustration, semi-realistic cartoon style, rich backgrounds, characters showing a range of emotions, educational elements woven in.',
    voiceConfig: { pitch: 1.0, rate: 1.0 },
    color: 'bg-orange-400'
  },
  '9-12': {
    label: '9-12 years',
    storyPromptModifier: 'Use sophisticated language and literary devices. The plot can be more complex with subplots and moral dilemmas. Explore themes of courage, responsibility, and discovery. The story should be around 1200 words.',
    illustrationStyle: 'Sophisticated children\'s illustration, realistic cartoon style, complex scenes with dynamic lighting, mature themes, artistic composition.',
    voiceConfig: { pitch: 0.9, rate: 1.1 },
    color: 'bg-blue-400'
  }
};

export const LOADING_MESSAGES = [
    "Dreaming up a magical tale...",
    "Mixing colors for your picture...",
    "Waking up the story characters...",
    "Asking the wise old owl for ideas...",
    "Painting a world with magic pixels...",
    "Turning imagination into a story...",
];
