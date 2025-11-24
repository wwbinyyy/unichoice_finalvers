import { GoogleGenAI } from "@google/genai";
import { University, FilterState } from "../types";

// Robust initialization
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // In a real Vercel environment, ensure API_KEY is set in Project Settings
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getAiResponse = async (
  userMessage: string, 
  contextData: University[],
  filters: FilterState
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "I'm sorry, but I cannot access my brain right now. (Missing API Key)";
  }

  const contextString = contextData.map(u => 
    `- ${u.name} (Rank: ${u.ranking || 'N/A'}, Tuition: $${u.tuition}, Country: ${u.country})`
  ).join('\n');

  const filterString = `
    - Max Tuition: $${filters.maxTuition}
    - Max Ranking: ${filters.minRanking >= 2500 ? 'Any' : filters.minRanking}
    - Countries: ${filters.locations.length > 0 ? filters.locations.join(', ') : 'Any'}
    - Majors: ${filters.majors.length > 0 ? filters.majors.join(', ') : 'Any'}
    - Scholarships Required: ${filters.hasScholarship ? 'Yes' : 'No'}
    - Degree Level: ${filters.degreeLevel.length > 0 ? filters.degreeLevel.join(', ') : 'Any'}
  `;

  const systemInstruction = `
    You are "UniBot", an expert academic counselor for the UniChoice platform.
    Your goal is to help students find the perfect university.

    CURRENT USER PREFERENCES (from filters):
    ${filterString}

    AVAILABLE UNIVERSITIES (based on filters):
    ${contextString}

    USER'S QUESTION: "${userMessage}"

    YOUR TASK:
    1. Analyze the user's question in the context of their filters and the available universities.
    2. Provide a concise, helpful answer.
    3. If the user is asking for recommendations, identify the TOP 5 universities from the provided list that best match their implicit and explicit needs.
    4. Present your recommendations as a structured, numbered list. For each university, briefly explain WHY it's a good match based on the user's filters and question (e.g., "It fits your tuition budget and offers a strong Computer Science program.").
    5. Be encouraging and professional. Do not recommend universities that are not in the provided list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    } as any);

    return response.text || "I'm thinking, but couldn't quite formulate an answer.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};