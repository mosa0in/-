import { GoogleGenAI } from "@google/genai";
import { Scores } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemPrompt = (scores: Scores) => {
  return `
    أنت مستشار مهني وشخصي ذكي وودود جداً. تتحدث باللغة العربية بأسلوب مشجع.
    المستخدم قام بإجراء اختبار لتحديد الميول المهنية والشخصية.
    
    نتائج المستخدم هي:
    - المنطق والتحليل (Logic): ${scores.Logic}
    - الإبداع (Creative): ${scores.Creative}
    - الجانب الإنساني (Human): ${scores.Human}
    - النظم والهندسة (Systems): ${scores.Systems}

    دورك هو الإجابة على أسئلة المستخدم حول مستقبله المهني، أو تفسير نتيجته، أو اقتراح طرق لتطوير مهاراته بناءً على هذه الأرقام.
    كن دقيقاً، واستخدم نبرة ملهمة. لا تكرر النتائج بشكل آلي، بل حللها.
  `;
};

export const streamChatResponse = async (
  message: string,
  scores: Scores,
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    const systemInstruction = getSystemPrompt(scores);
    
    // Using gemini-3-pro-preview with thinking config
    const modelId = 'gemini-3-pro-preview';

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: {
          thinkingBudget: 32768, // Max thinking budget for deep reasoning
        },
      },
      history: history,
    });

    // We return the stream directly
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};