import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUserName } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const username = getRequestUserName(request);
    if (!username) {
      return NextResponse.json({ error: "Zaloguj się, aby zagłosować." }, { status: 401 });
    }

    const { stageId, votes } = await request.json();

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "Użytkownik nie istnieje." }, { status: 404 });
    }

    const stage = await prisma.stage.findUnique({ where: { id: stageId } });
    if (!stage) {
      return NextResponse.json({ error: "Konkurs nie istnieje." }, { status: 404 });
    }

    if (stage.status === "LOCKED") {
      return NextResponse.json({ error: "Głosowanie w tym konkursie jest zablokowane." }, { status: 403 });
    }

    // Transaction to ensure atomicity
    await prisma.$transaction([
      prisma.vote.deleteMany({
        where: { userId: user.id, stageId },
      }),
      prisma.vote.createMany({
        data: votes.map((v: { artistId: string; song?: number; performance?: number; stageScore?: number; overall?: number }) => ({
          userId: user.id,
          stageId,
          artistId: v.artistId,
          voterName: user.displayName || user.username,
          song: v.song,
          performance: v.performance,
          stageScore: v.stageScore,
          overall: v.overall,
        })),
      }),
    ]);

    // Update StageScore for each artist in this stage
    for (const v of votes) {
      const agg = await prisma.vote.aggregate({
        where: { stageId, artistId: v.artistId },
        _sum: { overall: true },
      });
      const totalScore = agg._sum.overall || 0;

      await prisma.stageScore.upsert({
        where: {
          stageId_artistId: {
            stageId,
            artistId: v.artistId,
          },
        },
        update: { score: totalScore },
        create: {
          stageId,
          artistId: v.artistId,
          score: totalScore,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Voting API error", error);
    return NextResponse.json({ error: "Wystąpił błąd podczas zapisywania głosów." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const username = getRequestUserName(request);
    if (!username) {
      return NextResponse.json({ error: "Zaloguj się, aby zagłosować." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stageId = searchParams.get("stageId");
    if (!stageId) {
      return NextResponse.json({ error: "Brak parametru stageId." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "Użytkownik nie istnieje." }, { status: 404 });
    }

    const votes = await prisma.vote.findMany({
      where: { userId: user.id, stageId },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error("Voting API GET error", error);
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania głosów." }, { status: 500 });
  }
}
