import { GoogleGenAI } from "@google/genai";

// Global declaration for window.aistudio
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const getAI = async (requiresPaidKey = false) => {
  if (requiresPaidKey) {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }
    // Use the paid API key injected by the platform
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  // Use the default free API key
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};
