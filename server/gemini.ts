// Google Gemini Client
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "AIzaSyBccDUlUcF1ejaKP4EyExxpVvAvVW1NOwo";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model (gemini-pro is good for text)
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
