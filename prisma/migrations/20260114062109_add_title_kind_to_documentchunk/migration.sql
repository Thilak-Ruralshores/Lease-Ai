-- CreateEnum
CREATE TYPE "TitleKind" AS ENUM ('heading', 'exhibit', 'schedule', 'appendix', 'miscellaneous');

-- AlterTable
ALTER TABLE "DocumentChunk" ADD COLUMN     "title_kind" "TitleKind";
