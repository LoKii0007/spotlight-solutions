/*
  Warnings:

  - You are about to drop the column `veriyCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "veriyCode",
ADD COLUMN     "verifyCode" TEXT;
