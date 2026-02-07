// app/api/extract/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { twoLevelRetrieveForKeywords } from "@/lib/retriever/retrieveEmbeddings";

export async function POST(req: Request) {
  const { documentId, keywordIds } = await req.json();

  // 1️⃣ Get active keyword queries + embeddings
  // Note: query_emb is Unsupported("vector"), so we use raw SQL
  const rawKeywords = await prisma.$queryRaw<any[]>`
    SELECT id,keyword,query, CAST(query_emb AS text) as "query_emb_str"
    FROM "Keywords"
    WHERE id = ANY(${keywordIds})
  `;

  const keywords = rawKeywords.map((kw) => ({
    id: kw.id,
    keyword: kw.keyword, 
    query: kw.query,
    query_emb: kw.query_emb_str ? JSON.parse(kw.query_emb_str) : null,
  })).filter(kw => kw.query_emb !== null);

  if (!keywords.length) {
    return NextResponse.json({ result: [] });
  }

  // 2️⃣ Two-level retrieval
  const results = await twoLevelRetrieveForKeywords({
    documentId,
    keywords: keywords as any,
  });

  return NextResponse.json({
    documentId,
    results,
  });
}
