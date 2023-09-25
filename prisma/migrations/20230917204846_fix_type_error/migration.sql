/*
  Warnings:

  - You are about to drop the column `descriptin` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "descriptin",
ADD COLUMN     "description" TEXT;
