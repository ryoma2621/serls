
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeReport = async (reportText: string): Promise<FeedbackResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `以下の営業日報を読んで、素晴らしい点（良い点）と、さらなる成長のための改善点をそれぞれ3〜5個ずつ、箇条書きで指摘してください。フィードバックは、相手を励まし、モチベーションを高めるような、ポジティブなトーンでお願いします。\n\n--- 営業日報 ---\n${reportText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goodPoints: {
              type: Type.ARRAY,
              description: "日報から読み取れる素晴らしい点、褒めるべき点。",
              items: {
                type: Type.STRING
              }
            },
            improvements: {
              type: Type.ARRAY,
              description: "日報から読み取れる、さらに良くするための改善点やアドバイス。",
              items: {
                type: Type.STRING
              }
            }
          },
          required: ["goodPoints", "improvements"]
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    // Basic validation to ensure the response matches the expected structure
    if (
      !parsedResponse ||
      !Array.isArray(parsedResponse.goodPoints) ||
      !Array.isArray(parsedResponse.improvements)
    ) {
      throw new Error("Invalid response structure from AI");
    }

    return parsedResponse as FeedbackResponse;
  } catch (error) {
    console.error("Error analyzing report:", error);
    if (error instanceof Error) {
        throw new Error(`AIによる分析中にエラーが発生しました: ${error.message}`);
    }
    throw new Error("AIによる分析中に不明なエラーが発生しました。");
  }
};
