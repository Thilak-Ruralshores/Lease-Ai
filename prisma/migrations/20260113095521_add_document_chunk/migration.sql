CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "ChunkType" AS ENUM ('section', 'exhibit', 'other');

-- CreateTable
CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "type" "ChunkType" NOT NULL,
    "title" TEXT,
    "page_start" INTEGER,
    "page_end" INTEGER,
    "text" TEXT,
    "summary" TEXT,
    "summary_embedding" vector,
    "text_embedding" vector,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentChunk_document_id_idx" ON "DocumentChunk"("document_id");

-- CreateIndex
CREATE INDEX "DocumentChunk_type_idx" ON "DocumentChunk"("type");
