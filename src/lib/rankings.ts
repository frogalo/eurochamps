import { prisma } from "@/lib/prisma";

export interface UserRankingInput {
  artistId: string;
  rank: number;
}

export async function saveUserRankings(
  userId: string,
  rankings: UserRankingInput[]
) {
  return prisma.$transaction(async (tx) => {
    await tx.vote.deleteMany({
      where: { userId },
    });

    if (rankings.length === 0) {
      return [];
    }

    await tx.vote.createMany({
      data: rankings.map((ranking) => ({
        userId,
        artistId: ranking.artistId,
        rank: ranking.rank,
      })),
    });

    return tx.vote.findMany({
      where: { userId },
      include: { artist: true },
      orderBy: { rank: "asc" },
    });
  });
}

export async function getUserRankings(userId: string) {
  return prisma.vote.findMany({
    where: { userId },
    include: { artist: true },
    orderBy: { rank: "asc" },
  });
}

export async function getArtistRankingSummary() {
  return prisma.artist.findMany({
    include: {
      votes: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          rank: "asc",
        },
      },
    },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
}
