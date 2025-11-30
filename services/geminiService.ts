import { GoogleGenAI, Type } from "@google/genai";
import { AISearchResult } from "../types";

// Helper to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzePartImage = async (base64Image: string): Promise<AISearchResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    أنت خبير في قطع غيار السيارات.
    قم بتحليل هذه الصورة واستخراج المعلومات التالية بتنسيق JSON:
    1. detectedName: اسم القطعة باللغة العربية.
    2. description: وصف قصير للقطعة ووظيفتها وحالتها الظاهرة.
    3. possiblePartNumbers: مصفوفة تحتوي على أي أرقام أو رموز تراها مطبوعة على القطعة.
    4. confidence: رقم من 0 إلى 1 يمثل مدى ثقتك في التعرف على القطعة.
    
    إذا لم تكن الصورة لقطعة سيارة، أرجع detectedName كـ "غير معروف".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Efficient model for image analysis
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedName: { type: Type.STRING },
            description: { type: Type.STRING },
            possiblePartNumbers: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISearchResult;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};