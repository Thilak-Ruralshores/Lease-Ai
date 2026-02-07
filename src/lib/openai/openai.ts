import { ChatOpenAI } from "@langchain/openai";
// import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Ollama,OllamaEmbeddings } from "@langchain/ollama"
 import OpenAI from "openai";
 
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const model = new ChatOpenAI({
  model: "gpt-5-mini",
  temperature: 0,
  apiKey:process.env.OPENAI_API_KEY,
  maxRetries:2,
  // other params...
})


export const ollamaModel = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.1:8b",
  temperature: 0.1,
  maxRetries: 2,
});


export const embeddingsModel = new OllamaEmbeddings({
  model: "bge-m3",
  baseUrl: "http://localhost:11434", // Default value
});
// export const model = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
//   // Updated to the best high-throughput summarization model for 2026
//   model: "gemini-2.5-flash-lite", 
//   temperature: 0,
//   maxRetries: 2,
// });


