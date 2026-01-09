import { ChatOpenAI } from "@langchain/openai";
// import "dotenv/config";
 import OpenAI from "openai";
 
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const model = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0,
  apiKey:process.env.OPENAI_API_KEY,
  maxRetries:2,
  // other params...
})