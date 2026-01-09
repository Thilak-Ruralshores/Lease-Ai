// lib/embeddings/embedChunks.ts
import { embedWithOpenAI } from "./embedWithOpenAI";

export type EmbeddedChunk = {
  textEmbedding: number[];
  summaryEmbedding: number[];
};

export async function embedChunks(chunks: any[]) {
  // 1️⃣ Prepare texts
  const rawTexts = chunks.map(c => c.text);
  const summaries = chunks.map(c => c.summary);

  // 2️⃣ Generate embeddings
  const [textEmbeddings, summaryEmbeddings] = await Promise.all([
    embedWithOpenAI(rawTexts),
    embedWithOpenAI(summaries),
  ]);

  // 3️⃣ Attach back deterministically
  return chunks.map((chunk, i) => ({
    ...chunk,
    embeddings: {
      text: textEmbeddings[i],
      summary: summaryEmbeddings[i],
    },
  }));
}
