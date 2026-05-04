import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateActionPlan(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const fullPrompt = `User wants to do: "${prompt}". 
    Create a short, actionable 3-5 step plan in Bengali. 
    Keep it concise and relevant to a reminder app. 
    Format: Use bullet points.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, পরিকল্পনা তৈরি করা সম্ভব হয়নি।";
  }
}
