import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../../constants/instructions";

export async function generateSong(
  prompt: string,
  apiKey: string,
  systemInstruction?: string,
  imageBase64?: string,
  imageMimeType?: string
) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in your Settings.");
  }

  const genAI = new GoogleGenAI({ apiKey });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("AI response timed out (90s limit reached). The AI failed to respond in time. Please check your network or try again."));
    }, 90000);
  });

  const contents: any[] = [];
  if (imageBase64 && imageMimeType) {
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    contents.push({
      inlineData: {
        data: cleanBase64,
        mimeType: imageMimeType
      }
    });
  }
  contents.push({ text: prompt });

  const generatePromise = genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: contents,
    config: {
      systemInstruction: systemInstruction || SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    },
  });

  const response = await Promise.race([generatePromise, timeoutPromise]);
  return response;
}
