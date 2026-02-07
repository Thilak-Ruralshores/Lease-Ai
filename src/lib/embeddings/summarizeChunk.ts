import pLimit from "p-limit";
import { ollamaModel } from "../openai/openai";
import { chunkSummaryPrompt } from "../prompts/chunkSummary.prompt";

export type Chunk = {
  text: string;
  [key: string]: any;
};

const limit = pLimit(2); // ✅ 2–3 is ideal for summaries

export async function summarizeChunks(chunks: Chunk[]) {
  try{
  if (!chunks || chunks.length === 0) return [];

  const tasks = chunks.map((chunk,index) =>
    limit(async () => {
      console.log("index",index)
      const input = `
${chunkSummaryPrompt}

---
SECTION TEXT:
${chunk.text}
`;

      const response = await ollamaModel.invoke(input);

      return {
        ...chunk,
        // summary: response.content,
        summary: response,
      };
    })
  );

  return Promise.all(tasks);
}
catch(error){
  console.log(error)
}
}
// import pLimit from "p-limit";
// import { model } from "../openai/openai";
// import { chunkSummaryPrompt } from "../prompts/chunkSummary.prompt";

// export type Chunk = {
//   text: string;
//   [key: string]: any;
// };

// const limit = pLimit(1); // 🚨 MUST be 1 for Gemini free tier (10 requests/min quota)
// const MAX_RETRIES = 3; // Allow a few retries for rate limits

// async function sleep(ms: number) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// // Extract retry delay from Gemini error message
// function parseRetryDelay(errorMessage: string): number {
//   // Look for patterns like "retry in 8.127s" or "retryDelay":"8s"
//   const match = errorMessage.match(/retry in ([0-9.]+)s|retryDelay["']?:\s*["']?([0-9.]+)s/);
//   if (match) {
//     const seconds = parseFloat(match[1] || match[2]);
//     return Math.ceil(seconds * 1000); // Convert to ms and round up
//   }
//   return 10000; // Default to 10 seconds if we can't parse it
// }

// async function summarizeOne(chunk: Chunk, attempt = 0): Promise<Chunk> {
//   try {
//     console.log(
//       `📄 Summarizing chunk ${chunk['heading_id']} ${chunk['text'].slice(0, 20)}... (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
//     );
//     const input = `
// ${chunkSummaryPrompt}

// ---
// SECTION TEXT:
// ${chunk.text}
// `;

//     const response = await model.invoke(input);

//     return {
//       ...chunk,
//       summary: response.content,
//     };
//   } catch (err: any) {
//     const is429 = err?.message?.includes("429") || err?.message?.includes("quota");

//     if (is429 && attempt < MAX_RETRIES) {
//       // Extract the retry delay from Gemini's error message
//       const retryDelay = parseRetryDelay(err.message || '');
//       console.warn(
//         `⏳ Gemini rate-limited. Waiting ${retryDelay}ms before retry ${attempt + 1}/${MAX_RETRIES}...`
//       );
//       await sleep(retryDelay);
//       return summarizeOne(chunk, attempt + 1);
//     }

//     // After max retries or non-429 error, throw with clear message
//     if (is429) {
//       console.error(`❌ Max retries (${MAX_RETRIES}) exceeded for rate limit. Giving up.`);
//       throw new Error(`Rate limit exceeded after ${MAX_RETRIES} retries. ${err.message}`);
//     }
    
//     throw err;
//   }
// }

// export async function summarizeChunks(chunks: Chunk[]) {
//   if (!chunks || chunks.length === 0) return [];

//   const tasks = chunks.map((chunk) =>
//     limit(() => summarizeOne(chunk))
//   );

//   return Promise.all(tasks);
// }
