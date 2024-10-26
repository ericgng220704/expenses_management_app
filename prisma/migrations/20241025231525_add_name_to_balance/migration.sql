/*
  Warnings:

  - Added the required column `name` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "name" TEXT NOT NULL;
