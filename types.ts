
export type AgeGroup = '3-5' | '5-7' | '7-9' | '9-12';

export type Theme = 'fantasy' | 'adventure' | 'science' | 'friendship';

export interface Character {
    name: string;
    description: string;
    emoji: string;
}
export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  choices: string[];
}

export interface VoiceConfig {
  pitch: number;
  rate: number;
  name?: string;
}
export interface AgeGroupDetails {
  label: string;
  storyPromptModifier: string;
  illustrationStyle: string;
  voiceConfig: VoiceConfig;
  color: string;
}
