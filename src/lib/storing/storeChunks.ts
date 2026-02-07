import { prisma } from "@/lib/prisma";
import { ChunkType, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

/**
 * Interface for the chunk input data.
 * Supports both top-level and nested embeddings (as produced by some existing lib functions).
*/
type TitleType = "title" | "heading_title" | "other";
function normalizeTitle(chunk: any) {
  if (chunk.heading_title) {
    return {
      title: chunk.heading_title,
      title_kind: "heading" as const,
    };
  }

  if (chunk.title) {
    return {
      title: chunk.title,
      title_kind: "exhibit" as const,
    };
  }

  return {
    title: null,
    title_kind: null,
  };
}


export interface ChunkInput {
  type: string; // Using string to allow mapping to ChunkType
   title?: string;          // actual text
  title_kind?: string;
  page_start?: number;
  page_end?: number;
  text?: string;
  summary?: string;
  summary_embedding?: number[];
  text_embedding?: number[];
  embeddings?: {
    text?: number[];
    summary?: number[];
  };
}

/**
 * Maps incoming chunk types to the Prisma ChunkType enum.
 */
function mapChunkType(type: string): ChunkType {
  const t = type.toLowerCase();
  if (t === "section" || t === "grouped_section") return ChunkType.section;
  if (t === "exhibit") return ChunkType.exhibit;
  return ChunkType.other; // For 'miscellaneous', 'heading_only', etc.
}

/**
 * Stores multiple document chunks into the database with retry logic.
 * 
 * @param documentId - The unique identifier for the document.
 * @param documentName - The name of the document.
 * @param chunks - An array of chunk objects to be stored.
 * @returns A promise that resolves to a success or failure message string.
 */
export async function storeChunks(
  documentId: string,
  documentName: string,
  userId: string,
  chunks: ChunkInput[]
): Promise<string> {
  // 1. Validate inputs
  if (!documentId || !documentName || !userId) {
    return "Error: documentId, documentName and userId are required.";
  }

  if (!chunks || chunks.length === 0) {
    return "Error: No chunks provided for storage.";
  }

  const MAX_RETRIES = 2; 
  let lastError: any = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Prepare chunks for insertion
      const preparedChunks = chunks.map(chunk => {
        const { title, title_kind } = normalizeTitle(chunk);
        const text_embedding = chunk.text_embedding || chunk.embeddings?.text;
        const summary_embedding = chunk.summary_embedding || chunk.embeddings?.summary;
        
        return {
          id: randomUUID(),
          document_id: documentId,
          document_name: documentName,
          userId: userId,
          type: mapChunkType(chunk.type),
          title,
          title_kind,
          page_start: chunk.page_start || null,
          page_end: chunk.page_end || null,
          text: chunk.text || null,
          summary: chunk.summary || null,
          text_embedding,
          summary_embedding,
        };
      });

      const hasEmbeddings = preparedChunks.some(c => c.summary_embedding || c.text_embedding);

      if (hasEmbeddings) {
        // Use raw SQL for pgvector support with a single bulk insert for performance
        await prisma.$transaction(async (tx) => {
          // Construct a single bulk insert query
          // Note: PostgreSQL has a limit on the number of parameters, but for document chunks this should generally be fine.
          // For extremely large sets, we might need to batch them.
          
          for (const chunk of preparedChunks) {
            const summaryVector = chunk.summary_embedding ? `[${chunk.summary_embedding.join(",")}]` : null;
            const textVector = chunk.text_embedding ? `[${chunk.text_embedding.join(",")}]` : null;

            await tx.$executeRaw`
              INSERT INTO "DocumentChunk" (
                "id", "document_id", "document_name", "userId", "type", "title", 
                "page_start", "page_end", "text", "summary", 
                "summary_embedding", "text_embedding", "created_at"
              ) VALUES (
                ${chunk.id}, ${chunk.document_id}, ${chunk.document_name}, ${chunk.userId}, ${chunk.type}::"ChunkType", ${chunk.title},
                ${chunk.page_start}, ${chunk.page_end}, ${chunk.text}, ${chunk.summary},
                ${summaryVector ? Prisma.sql`${summaryVector}::vector` : null}, 
                ${textVector ? Prisma.sql`${textVector}::vector` : null}, 
                NOW()
              )
            `;
          }
        }, {
          timeout: 30000 // Increase timeout to 30 seconds for large documents
        });
      } else {
        // Standard createMany
        await prisma.documentChunk.createMany({
          data: preparedChunks.map(({ text_embedding, summary_embedding, ...rest }) => ({
            ...rest
          })),
        });
      }

      return `Successfully stored ${chunks.length} chunks for document "${documentName}".`;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  return `Failed to store chunks after ${MAX_RETRIES + 1} attempts. Last error: ${lastError?.message || "Unknown error"}`;
}

