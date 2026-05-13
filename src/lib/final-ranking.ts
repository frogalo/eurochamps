import { prisma } from "@/lib/prisma";

export interface FinalRankingInput {
  artistId: string;
  position: number;
  points?: number;
}

export interface UserStageLeaderboardRow {
  userId: string;
  username: string;
  displayName: string;
  points: number;
  imagePath?: string;
}

export interface UserVoteDetail {
  artistId: string;
  predictedPosition: number;
  pointsEarned: number;
}

export interface DetailedLeaderboardRow extends UserStageLeaderboardRow {
  votes: UserVoteDetail[];
}

export interface DetailedScoreboard {
  artists: Array<{
    id: string;
    name: string;
    country: string;
    finalPosition: number;
    imagePath?: string;
    song?: string;
    points?: number;
  }>;
  users: DetailedLeaderboardRow[];
}

function pointsFromPlacementDiff(diff: number) {
  if (diff === 0) return 3;
  if (diff === 1) return 2;
  if (diff === 2) return 1;
  return 0;
}

export async function upsertFinalStageRanking(stageId: string, items: FinalRankingInput[]) {
  await prisma.$transaction(async (tx) => {
    const db = tx as any;
    
    await db.finalStageRanking.deleteMany({
      where: { stageId },
    });

    if (items.length === 0) return;

    await db.finalStageRanking.createMany({
      data: items.map((item) => ({
        stageId,
        artistId: item.artistId,
        position: item.position,
      })),
    });

    for (const item of items) {
      if (item.points !== undefined) {
        await db.stageScore.upsert({
          where: {
            stageId_artistId: {
              stageId,
              artistId: item.artistId,
            },
          },
          update: { score: item.points },
          create: {
            stageId,
            artistId: item.artistId,
            score: item.points,
          },
        });
      }
    }
  });
}

export async function getFinalStageRanking(stageId: string) {
  const db = prisma as any;
  return db.finalStageRanking.findMany({
    where: { stageId },
    include: {
      artist: {
        select: {
          id: true,
          name: true,
          country: true,
          songPath: true,
        },
      },
    },
    orderBy: { position: "asc" },
  });
}

export async function getDetailedScoreboard(stageId: string): Promise<DetailedScoreboard> {
  const db = prisma as any;
  const [finalRanking, votes, stageScores] = await Promise.all([
    db.finalStageRanking.findMany({
      where: { stageId },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            country: true,
            imagePath: true,
            songPath: true,
          },
        },
      },
      orderBy: { position: "asc" },
    }),
    prisma.vote.findMany({
      where: {
        stageId,
        userId: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            imagePath: true,
          },
        },
      },
    }),
    prisma.stageScore.findMany({
      where: { stageId },
    }),
  ]);

  if (finalRanking.length === 0) {
    return { artists: [], users: [] };
  }

  const finalPositionByArtistId = new Map<string, number>(
    (finalRanking as any[]).map((item) => [item.artistId, item.position])
  );

  const scoresByArtistId = new Map<string, number>(
    stageScores.map((s) => [s.artistId, s.score])
  );

  const votesByUser = new Map<string, any[]>();
  for (const vote of votes) {
    if (!vote.userId) continue;
    const userVotes = votesByUser.get(vote.userId) ?? [];
    userVotes.push(vote);
    votesByUser.set(vote.userId, userVotes);
  }

  const users: DetailedLeaderboardRow[] = [];

  for (const [userId, userVotes] of votesByUser.entries()) {
    const sortedPredictions = [...userVotes].sort((left, right) => {
      const scoreL = left.overall ?? 0;
      const scoreR = right.overall ?? 0;
      if (scoreR !== scoreL) return scoreR - scoreL;
      return left.artistId.localeCompare(right.artistId);
    });

    const predictedPositionByArtistId = new Map<string, number>();
    for (let i = 0; i < sortedPredictions.length; i += 1) {
      predictedPositionByArtistId.set(sortedPredictions[i].artistId, i + 1);
    }

    const voteDetails: UserVoteDetail[] = [];
    let totalPoints = 0;

    for (const [artistId, finalPos] of finalPositionByArtistId.entries()) {
      const predPos = predictedPositionByArtistId.get(artistId);
      if (predPos === undefined) continue;
      const pts = pointsFromPlacementDiff(Math.abs(predPos - finalPos));
      totalPoints += pts;
      voteDetails.push({
        artistId,
        predictedPosition: predPos,
        pointsEarned: pts,
      });
    }

    const userMeta = userVotes[0]?.user;
    users.push({
      userId,
      username: userMeta?.username ?? userId,
      displayName: userMeta?.displayName ?? userMeta?.username ?? userId,
      imagePath: userMeta?.imagePath,
      points: totalPoints,
      votes: voteDetails,
    });
  }

  users.sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName));

  const artists = (finalRanking as any[]).map((item) => ({
    id: item.artistId,
    name: item.artist.name,
    country: item.artist.country,
    finalPosition: item.position,
    imagePath: item.artist.imagePath,
    song: item.artist.songPath,
    points: scoresByArtistId.get(item.artistId) ?? 0,
  }));

  return { artists, users };
}

export async function getStageLeaderboard(stageId: string): Promise<UserStageLeaderboardRow[]> {
  const scoreboard = await getDetailedScoreboard(stageId);
  return scoreboard.users.map((u) => ({
    userId: u.userId,
    username: u.username,
    displayName: u.displayName,
    points: u.points,
  }));
}
