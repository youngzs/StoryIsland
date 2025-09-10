
import { GoogleGenAI, Type } from "@google/genai";
import { AgeGroup, Theme } from '../types';
import { AGE_GROUPS } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A creative and catchy title for the story.'
    },
    content: {
      type: Type.STRING,
      description: 'The first part of the story text, with paragraphs separated by newline characters. It should end at an interesting point, leading into the choices.'
    },
    illustrationPrompt: {
      type: Type.STRING,
      description: 'A concise, descriptive English prompt for an image generation AI to create an illustration for this story part. Describe the main character, the setting, and the key action. This should be a single sentence.'
    },
    choices: {
        type: Type.ARRAY,
        description: 'An array of exactly three short, exciting options (each under 15 words) for what the main character could do next. These choices should lead to different outcomes.',
        items: { type: Type.STRING }
    }
  },
  required: ['title', 'content', 'illustrationPrompt', 'choices']
};

const storyContinuationSchema = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.STRING,
      description: 'The next part of the story text, continuing from the chosen path. Paragraphs should be separated by newline characters. It should end at another interesting point, leading into the new choices.'
    },
    illustrationPrompt: {
      type: Type.STRING,
      description: 'A new, concise, descriptive English prompt for an image generation AI to illustrate this new part of the story. This should be a single sentence.'
    },
    choices: {
        type: Type.ARRAY,
        description: 'An array of exactly three new, short, exciting options (each under 15 words) for what could happen next.',
        items: { type: Type.STRING }
    }
  },
  required: ['content', 'illustrationPrompt', 'choices']
};


export async function generateStory(ageGroup: AgeGroup, theme: Theme, character: string): Promise<{ title: string; content: string; illustrationPrompt: string; choices: string[]; }> {
  const ageGroupDetails = AGE_GROUPS[ageGroup];

  const prompt = `
    You are an expert storyteller for children. Your task is to start a delightful and age-appropriate story.

    **Story requirements:**
    - **Main Character:** ${character}.
    - **Target Age Group:** ${ageGroup} years old.
    - **Theme:** ${theme}.
    - **Tone:** Positive, engaging, and safe for children. No scary or violent content.
    - **Language Style:** ${ageGroupDetails.storyPromptModifier}
    - **Output:** Create just the beginning of a story. It must end at a point where the character has to make a decision. Then, provide three possible choices for what happens next.
    
    Ensure the output is a valid JSON object matching the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: storySchema,
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (parsed.title && parsed.content && parsed.illustrationPrompt && parsed.choices) {
        return parsed;
    } else {
        throw new Error("AI response did not match the required schema for starting a story.");
    }
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw new Error("Failed to generate story. Please try again.");
  }
}

export async function continueStory(previousContent: string, chosenPath: string, ageGroup: AgeGroup): Promise<{ content: string; illustrationPrompt: string; choices: string[]; }> {
  const ageGroupDetails = AGE_GROUPS[ageGroup];

  const prompt = `
    You are an expert storyteller for children, continuing a story.

    **Story so far:**
    ${previousContent}

    **The user chose this path:** "${chosenPath}"

    **Your Task:**
    - Write the next part of the story, following the chosen path.
    - Keep the tone and language consistent with the age group: ${ageGroup} (${ageGroupDetails.storyPromptModifier}).
    - The story part should be of a similar length to the previous parts.
    - End the new part at another interesting decision point.
    - Provide three new, distinct choices for what can happen next.

    Ensure the output is a valid JSON object matching the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: storyContinuationSchema,
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (parsed.content && parsed.illustrationPrompt && parsed.choices) {
        return parsed;
    } else {
        throw new Error("AI response did not match the required schema for continuing a story.");
    }
  } catch (error) {
    console.error("Error continuing story with Gemini:", error);
    throw new Error("Failed to continue story. Please try again.");
  }
}

export async function generateImage(prompt: string, ageGroup: AgeGroup): Promise<string> {
    const ageGroupDetails = AGE_GROUPS[ageGroup];
    const fullPrompt = `${prompt}, ${ageGroupDetails.illustrationStyle}, --no scary --no violence --child-friendly`;
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            // Fallback image
            return `https://via.placeholder.com/512/${AGE_GROUPS[ageGroup].color.split('-')[1]}-300/FFFFFF?text=Image+Magic+Failed`;
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
         // Fallback image
        return `https://via.placeholder.com/512/${AGE_GROUPS[ageGroup].color.split('-')[1]}-300/FFFFFF?text=Image+Magic+Failed`;
    }
}
