import { ChatOpenAI } from "@langchain/openai";
// import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

 import OpenAI from "openai";
 
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// export const model = new ChatOpenAI({
//   model: "gpt-4.1-mini",
//   temperature: 0,
//   apiKey:process.env.OPENAI_API_KEY,
//   maxRetries:2,
//   // other params...
// })


export const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  // Updated to the best high-throughput summarization model for 2026
  model: "gemini-2.5-flash-lite", 
  temperature: 0,
  maxRetries: 2,
});


