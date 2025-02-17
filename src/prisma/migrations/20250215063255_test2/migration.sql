/*
  Warnings:

  - You are about to drop the column `BoardId` on the `Columns` table. All the data in the column will be lost.
  - You are about to drop the column `BoardId` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Columns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Columns" DROP CONSTRAINT "Columns_BoardId_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_BoardId_fkey";

-- AlterTable
ALTER TABLE "Columns" DROP COLUMN "BoardId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "BoardId",
ADD COLUMN     "boardId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Columns" ADD CONSTRAINT "Columns_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
