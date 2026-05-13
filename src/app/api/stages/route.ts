import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const stages = await prisma.stage.findMany({
      orderBy: [
        { year: "desc" },
        { createdAt: "asc" }
      ],
    });

    const username = request.headers.get("x-user-name");

    // For each stage, we need to know how many artists are in that year
    const stagesWithCounts = await Promise.all(stages.map(async (stage) => {
      const artistCount = await prisma.artist.count({
        where: { 
          year: stage.year,
          id: { notIn: stage.disabledArtists || [] }
        }
      });

      let userVoteCount = 0;
      if (username) {
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
          userVoteCount = await prisma.vote.count({
            where: {
              stageId: stage.id,
              userId: user.id,
              overall: { gt: 0 } // Only count if they actually gave points
            }
          });
        }
      }

      return {
        ...stage,
        entryCount: artistCount,
        userVoteCount
      };
    }));

    return NextResponse.json({ stages: stagesWithCounts });
  } catch (error) {
    console.error("Public stages API error", error);
    return NextResponse.json({ error: "Nie udało się pobrać konkursów." }, { status: 500 });
  }
}
