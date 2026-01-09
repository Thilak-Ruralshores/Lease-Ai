import pLimit from "p-limit";
import { model } from "../openai/openai";
import { chunkSummaryPrompt } from "../prompts/chunkSummary.prompt";

export type Chunk = {
  text: string;
  [key: string]: any;
};

const limit = pLimit(30); // ✅ 2–3 is ideal for summaries

export async function summarizeChunks(chunks: Chunk[]) {
  if (!chunks || chunks.length === 0) return [];

  const tasks = chunks.map((chunk) =>
    limit(async () => {
      const input = `
${chunkSummaryPrompt}

---
SECTION TEXT:
${chunk.text}
`;

      const response = await model.invoke(input);

      return {
        ...chunk,
        summary: response.content,
      };
    })
  );

  return Promise.all(tasks);
}
