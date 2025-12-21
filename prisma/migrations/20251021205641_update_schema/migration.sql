/*
  Warnings:

  - Added the required column `name` to the `movements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."TypeExtract" ADD VALUE 'INCOME';

-- AlterTable
ALTER TABLE "public"."movements" ADD COLUMN     "name" TEXT NOT NULL;
