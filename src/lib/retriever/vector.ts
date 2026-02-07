// lib/vector.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type SimilarityResult = {
  id: string;
  title: string | null;
  page_start: number | null;
  page_end: number | null;
  document_id: string;
  document_name: string | null;
  userId: string;
  text: string | null;
  summary: string | null;
  score: number;
};

export async function similaritySearch({
  embedding,
  table,
  vectorColumn,
  where,
  limit,
}: {
  embedding: number[];
  table: "DocumentChunk"; // strongly recommend not keeping this generic
  vectorColumn: "text_embedding";
  where?: string;
  limit: number;
}) {
  return prisma.$queryRaw<SimilarityResult[]>(
    Prisma.sql`
      SELECT
        id,
        title,
        document_id,
        document_name,
        "userId",
        text,
        summary,
        1 - (${Prisma.raw(vectorColumn)} <=> ${embedding}::vector) AS score
      FROM ${Prisma.raw(`"${table}"`)}
      ${where ? Prisma.sql`WHERE ${Prisma.raw(where)}` : Prisma.empty}
      ORDER BY ${Prisma.raw(vectorColumn)} <=> ${embedding}::vector
      LIMIT ${limit}
    `
  );
}
