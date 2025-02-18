/*
  Warnings:

  - Added the required column `userId` to the `Columns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Columns" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountConnected" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "Columns" ADD CONSTRAINT "Columns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
