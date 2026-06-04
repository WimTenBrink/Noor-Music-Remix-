import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../../constants/instructions";

export async function generateSong(prompt: string, apiKey: string, systemInstruction?: string) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in your Settings.");
  }

  const genAI = new GoogleGenAI({ apiKey });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("AI response timed out (90s limit reached). The AI failed to respond in time. Please check your network or try again."));
    }, 90000);
  });

  const generatePromise = genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
    },
  });

  const response = await Promise.race([generatePromise, timeoutPromise]);
  return response;
}
