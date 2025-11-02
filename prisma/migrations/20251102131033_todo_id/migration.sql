/*
  Warnings:

  - The primary key for the `todo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `todoid` on the `todo` table. All the data in the column will be lost.
  - Added the required column `id` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todo" DROP CONSTRAINT "todo_pkey",
DROP COLUMN "todoid",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "todo_pkey" PRIMARY KEY ("id");
