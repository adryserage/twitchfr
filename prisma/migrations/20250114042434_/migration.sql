/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `Streamer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `Streamer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Streamer" ADD COLUMN     "login" TEXT NOT NULL,
ALTER COLUMN "lastUpdated" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_login_key" ON "Streamer"("login");
