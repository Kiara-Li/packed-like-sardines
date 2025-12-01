import { GoogleGenAI, Type } from "@google/genai";

export const analyzeCanContent = async (text: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found in environment variables. Returning mock data.");
    return ["100% Pure Stress", "Trace amounts of Hope", "High Caffeine Content"];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text from a stressed worker and generate a satirical "Ingredients List" (max 3 items) for a sardine can label. 
      The ingredients should be metaphorical (e.g., "50g of Unpaid Overtime", "Essence of Imposter Syndrome").
      Keep it short, punchy, and witty.
      
      User Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of metaphorical ingredients"
            }
          }
        }
      }
    });

    // Parse the JSON string manually as the SDK returns a string in response.text
    const result = JSON.parse(response.text || '{}');
    return result.ingredients || ["Unknown Contents", "Mystery Meat"];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Compressed Emotions", "Urban Dust", "Silent Screams"];
  }
};