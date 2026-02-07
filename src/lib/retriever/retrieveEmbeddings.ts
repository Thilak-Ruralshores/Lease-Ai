// lib/retriever.ts
import { similaritySearch } from "@/lib/retriever/vector";

export async function twoLevelRetrieveForKeywords({
  documentId,
  keywords,
  stage1Limit = 5,
  // stage2Limit = 5,
}: {
  documentId: string;
  keywords: {
    id: string;
    keyword: string;
    query: string;
    query_emb: number[];
  }[];
  stage1Limit?: number;
  // stage2Limit?: number;
}) {
  return Promise.all(
    keywords.map(async (kw) => {
      /* ---------- STAGE 1: SUMMARY SEARCH ---------- */
      const stage1 = await similaritySearch({
        embedding: kw.query_emb,
        table: "DocumentChunk",
        vectorColumn: "text_embedding",
        // vectorColumn: "summary_embedding",
        where: `"document_id" = '${documentId}'`,
        limit: stage1Limit,
      });

      if (!stage1.length) {
        return { keywordId: kw.id, chunks: [] };
      }

      /* ---------- STAGE 2: TEXT SEARCH (RERANK) ---------- */
      const chunkIds = stage1.map(c => `'${c.id}'`).join(",");

      // const stage2 = await similaritySearch({
      //   embedding: kw.query_emb,
      //   table: "DocumentChunk",
      //   vectorColumn: "text_embedding",
      //   where: `"id" IN (${chunkIds})`,
      //   limit: stage2Limit,
      // });

      return {
        keywordId: kw.id,
        keyword: kw.keyword,
        query:kw.query,
        // chunks: stage2.map(c => ({
        chunks: stage1.map(c => ({
          chunkId: c.id,
          title: c.title,
          page_start: c.page_start,
          page_end: c.page_end,
          score: c.score,
          text: c.text,
        })),
      };
    })
  );
}
