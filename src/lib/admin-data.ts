import { VoteType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

// ─── Stages ────────────────────────────────────────────

export async function getAdminStages() {
  return prisma.stage.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: [{ year: "desc" }, { createdAt: "asc" }],
  });
}

export async function createStage(input: {
  name: string;
  year: string;
  place: string;
  logoUrl: string;
  round: string;
  date: string;
  tagline: string;
  description: string;
  status?: "OPEN" | "LOCKED";
  disabledArtists?: string[];
}) {
  return prisma.stage.create({ data: input });
}

export async function updateStage(
  stageId: string,
  input: {
    name: string;
    year: string;
    place: string;
    logoUrl: string;
    round: string;
    date: string;
    tagline: string;
    description: string;
    status?: "OPEN" | "LOCKED";
    disabledArtists?: string[];
  }
) {
  return prisma.stage.update({ where: { id: stageId }, data: input });
}

export async function deleteStage(stageId: string) {
  return prisma.stage.delete({ where: { id: stageId } });
}

// ─── Artists ───────────────────────────────────────────

export async function getAdminArtists() {
  return prisma.artist.findMany({
    orderBy: [{ year: "desc" }, { country: "asc" }, { name: "asc" }],
  });
}

export async function getArtistsByYear(year: string) {
  return prisma.artist.findMany({
    where: { year },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
}

export async function createArtist(input: {
  name: string;
  country: string;
  songPath: string;
  description: string;
  imagePath: string;
  year: string;
}) {
  return prisma.artist.create({ data: input });
}

export async function updateArtist(
  artistId: string,
  input: {
    name: string;
    country: string;
    songPath: string;
    description: string;
    imagePath: string;
    year: string;
  }
) {
  return prisma.artist.update({ where: { id: artistId }, data: input });
}

export async function deleteArtist(artistId: string) {
  return prisma.artist.delete({ where: { id: artistId } });
}

// ─── Stage + Artists (for votes page) ──────────────────

export async function getStageWithArtists(stageId: string) {
  const stage = await prisma.stage.findUnique({ where: { id: stageId } });

  if (!stage) {
    return null;
  }

  const artists = await prisma.artist.findMany({
    where: { year: stage.year },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });

  return { stage, artists };
}

// ─── Votes ─────────────────────────────────────────────

export async function createVoteBatch(input: {
  stageId: string;
  voterName: string;
  voteType: VoteType;
  votes: Array<{ artistId: string; rank: number }>;
}) {
  await prisma.vote.deleteMany({
    where: {
      stageId: input.stageId,
      voterName: input.voterName,
      voteType: input.voteType,
      userId: null,
    },
  });

  if (input.votes.length === 0) {
    return [];
  }

  await prisma.vote.createMany({
    data: input.votes.map((vote) => ({
      stageId: input.stageId,
      artistId: vote.artistId,
      voterName: input.voterName,
      voteType: input.voteType,
      rank: vote.rank,
    })),
  });

  return prisma.vote.findMany({
    where: {
      stageId: input.stageId,
      voterName: input.voterName,
      voteType: input.voteType,
      userId: null,
    },
    include: {
      artist: true,
    },
    orderBy: { rank: "desc" },
  });
}
