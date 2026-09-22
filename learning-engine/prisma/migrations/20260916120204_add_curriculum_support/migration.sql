-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('PRACTICE', 'CHECKPOINT');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "type" "ExerciseType" NOT NULL DEFAULT 'PRACTICE';

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "isCurriculum" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "primerContent" TEXT,
ADD COLUMN     "stage" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Module_isCurriculum_stage_order_idx" ON "Module"("isCurriculum", "stage", "order");
