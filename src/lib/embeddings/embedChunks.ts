// lib/embeddings/embedChunks.ts
import { embedWithOpenAI } from "./embedWithOpenAI";
import { embedWithGemini } from "./embedWithGemini";
import { embedWithOllama } from "./embedWithlLama";
import { recursiveSplit } from "./recursiveSplit";
export type EmbeddedChunk = {
  textEmbedding: number[];
  summaryEmbedding: number[];
};

// export async function embedChunks(chunks: any[]) {
//   // 1️⃣ Prepare texts
//   const rawTexts = chunks.map(c => c.text);
//   // const summaries = chunks.map(c => c.summary);

//   // 2️⃣ Generate embeddings
//   // const [textEmbeddings, summaryEmbeddings] = await Promise.all([
//     const [textEmbeddings] = await Promise.all([
//       // embedWithOllama(rawTexts),
//     embedWithOpenAI(rawTexts),
//     // embedWithOpenAI(summaries),
//     // embedWithGemini(rawTexts),
//     // embedWithGemini(summaries),
//   ]);

//   // 3️⃣ Attach back deterministically
//   return chunks.map((chunk, i) => ({
//     ...chunk,
//     embeddings: {
//       text: textEmbeddings[i],
//       // summary: summaryEmbeddings[i],
//     },
//   }));
// }

// lib/embeddings/embedChunks.ts
// import { embedWithOllama } from "./embedWithlLama";

// export type EmbeddedChunk = {
//   textEmbedding: number[];
// };

export async function embedChunks(chunks: any[]) {
  /**
   * 1️⃣ Expand chunks safely
   *    One logical section → 1..N embedding texts
   */
  // const expanded: {
  //   parentIndex: number;
  //   text: string;
  // }[] = [];
 
  

  // chunks.forEach((chunk, index) => {
  //   const parts = recursiveSplit(chunk.text);
  //   for (const part of parts) {
  //     expanded.push({
  //       parentIndex: index,
  //       text: part,
  //     });
  //   }
  // });

  /**
   * 2️⃣ Embed all safe texts
  //  */
  const textsToEmbed = chunks.map((chunk,index)=>chunk.text)
  const embeddings = await embedWithOllama(textsToEmbed);

  /**
   * 3️⃣ Re-attach embeddings to original chunks
   */
  const result = chunks.map(chunk => ({
    ...chunk,
    embeddings: {
      text: [] as number[][],
    },
  }));

  embeddings.forEach((embedding, i) => {
    result[i].embeddings.text.push(embedding);
  });

  return result;
}
