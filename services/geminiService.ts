
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ColoringPage, CollectionConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePrompts = async (config: CollectionConfig): Promise<ColoringPage[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a list of exactly 30 unique, high-quality coloring book page descriptions for an Amazon KDP book.
    Theme: ${config.theme}
    Style: ${config.style}
    Target Audience: ${config.targetAudience}

    Requirements for each description:
    1. Must be clear, visually descriptive, and avoid complex shading.
    2. Focus on "black and white line art", "crisp borders", "white background", "no gradients".
    3. Ensure variety across the 30 pages.

    Return the result as a JSON array of objects with 'title' and 'prompt' fields.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING }
          },
          required: ["title", "prompt"]
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "[]");
  return rawData.map((item: any, index: number) => ({
    id: `page-${Date.now()}-${index}`,
    title: item.title,
    prompt: item.prompt,
    status: 'pending'
  }));
};

export const generateImage = async (prompt: string): Promise<string> => {
  // We use gemini-2.5-flash-image for reliable, fast image generation
  const fullPrompt = `KDP Coloring book page, high quality black and white line art, pure white background, thick crisp black outlines, no shading, no greyscale, minimalist, vector style, for coloring, ${prompt}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4" // Standard book ratio
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Failed to generate image data");
};
