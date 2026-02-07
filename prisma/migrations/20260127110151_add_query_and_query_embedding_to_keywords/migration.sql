-- AlterTable
ALTER TABLE "Keywords" ADD COLUMN     "query" TEXT,
ADD COLUMN     "query_emb" vector;

-- CreateIndex
CREATE INDEX "Keywords_category_idx" ON "Keywords"("category");

-- CreateIndex
CREATE INDEX "Keywords_keyword_idx" ON "Keywords"("keyword");
