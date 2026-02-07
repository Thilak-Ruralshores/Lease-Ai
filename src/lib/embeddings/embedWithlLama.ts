import { embeddingsModel } from "../openai/openai";

export async function embedWithOllama(inputs: string[]) {
  const embeddings: number[][] = [];
  const BATCH_SIZE = 16; // tweak based on RAM/CPU

  for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
    const batch = inputs.slice(i, i + BATCH_SIZE);
    console.log(i,"i")
    // 👇 This is the key method
    const batchEmbeddings = await embeddingsModel.embedDocuments(batch);

    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}
