// lib/embeddings/embedWithOpenAI.ts
import { openai } from "@/lib/openai/openai";

export async function embedWithOpenAI(
  inputs: string[],
  dims = 1536
) {
  const embeddings: number[][] = [];
  const BATCH_SIZE = 10;

  for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
    const batch = inputs.slice(i, i + BATCH_SIZE);

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
      dimensions: dims,
    });

    embeddings.push(...res.data.map(d => d.embedding));
  }

  return embeddings;
}
