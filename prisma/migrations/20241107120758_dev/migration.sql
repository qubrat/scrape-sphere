/*
  Warnings:

  - Changed the type of `status` on the `Workflow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "status",
ADD COLUMN     "status" "WorkflowStatus" NOT NULL;
