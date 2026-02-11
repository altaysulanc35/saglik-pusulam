// Google Gemini Client
import { GoogleGenerativeAI } from "@google/generative-ai";

const DUMMY_KEY = "AIzaSyBccDUlUcF1ejaKP4EyExxpVvAvVW1NOwo";
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || DUMMY_KEY;

// Log key status (masked) for debugging
console.log("Gemini Client Initialized with Key:", apiKey === DUMMY_KEY ? "USING DUMMY KEY (Will Fail)" : `PROVIDED KEY (${apiKey.substring(0, 4)}...)`);

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Helper to get model with fallback capability if needed in the future
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getGeminiModel = (modelName: string) => genAI.getGenerativeModel({ model: modelName });
