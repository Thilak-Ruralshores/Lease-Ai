// lib/embeddings/embedWithGemini.ts
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const EXPECTED_DIM = 768;
const MAX_RETRIES = 3;

const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Extract retry delay from error message
function parseRetryDelay(errorMessage: string): number {
  const match = errorMessage.match(/retry in ([0-9.]+)s|retryDelay["']?:\s*["']?([0-9.]+)s/);
  if (match) {
    const seconds = parseFloat(match[1] || match[2]);
    return Math.ceil(seconds * 1000);
  }
  return 10000; // Default 10s
}

async function embedBatchWithRetry(batch: string[], batchIndex: number, attempt = 0): Promise<number[][]> {
  try {
    console.log(`🔢 Embedding batch ${batchIndex} (${batch.length} items, attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
    return await embeddingsModel.embedDocuments(batch);
  } catch (err: any) {
    const is429 = err?.message?.includes("429") || err?.message?.includes("quota");
    
    if (is429 && attempt < MAX_RETRIES) {
      const retryDelay = parseRetryDelay(err.message || '');
      console.warn(`⏳ Embedding rate-limited. Waiting ${retryDelay}ms before retry ${attempt + 1}/${MAX_RETRIES}...`);
      await sleep(retryDelay);
      return embedBatchWithRetry(batch, batchIndex, attempt + 1);
    }
    
    if (is429) {
      throw new Error(`Embedding rate limit exceeded after ${MAX_RETRIES} retries. ${err.message}`);
    }
    throw err;
  }
}

export async function embedWithGemini(inputs: string[]) {
  const BATCH_SIZE = 5;
  const embeddings: number[][] = [];

  for (let start = 0; start < inputs.length; start += BATCH_SIZE) {
    const batch = inputs.slice(start, start + BATCH_SIZE);
    const batchIndex = Math.floor(start / BATCH_SIZE);

    const batchEmbeddings = await embedBatchWithRetry(batch, batchIndex);

    batchEmbeddings.forEach((embedding, idx) => {
      const globalIndex = start + idx;

      // ✅ DIMENSION CHECK
      if (embedding.length !== EXPECTED_DIM) {
        throw new Error(
          `Embedding dimension mismatch at index ${globalIndex}. Expected ${EXPECTED_DIM}, got ${embedding.length}`
        );
      }

      console.log(
        `[EMBEDDING] globalIndex=${globalIndex}, dim=${embedding.length}`
      );
    });

    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}
