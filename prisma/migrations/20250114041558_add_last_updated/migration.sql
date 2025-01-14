/*
  Warnings:

  - You are about to drop the column `title` on the `Streamer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Streamer" DROP COLUMN "title",
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Streamer_addedAt_idx" ON "Streamer"("addedAt");
