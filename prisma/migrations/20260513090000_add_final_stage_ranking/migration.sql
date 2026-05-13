CREATE TABLE "FinalStageRanking" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinalStageRanking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FinalStageRanking_stageId_idx" ON "FinalStageRanking"("stageId");
CREATE INDEX "FinalStageRanking_artistId_idx" ON "FinalStageRanking"("artistId");

CREATE UNIQUE INDEX "FinalStageRanking_stageId_artistId_key" ON "FinalStageRanking"("stageId", "artistId");
CREATE UNIQUE INDEX "FinalStageRanking_stageId_position_key" ON "FinalStageRanking"("stageId", "position");

ALTER TABLE "FinalStageRanking"
ADD CONSTRAINT "FinalStageRanking_stageId_fkey"
FOREIGN KEY ("stageId") REFERENCES "Stage"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FinalStageRanking"
ADD CONSTRAINT "FinalStageRanking_artistId_fkey"
FOREIGN KEY ("artistId") REFERENCES "Artist"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
