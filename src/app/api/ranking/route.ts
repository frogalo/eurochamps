import { NextResponse } from "next/server";

import { getDetailedScoreboard } from "@/lib/final-ranking";
import { prisma } from "@/lib/prisma";
import { getRequestUserName } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const username = getRequestUserName(request);
    if (!username) {
      return NextResponse.json({ error: "Brak sesji uzytkownika." }, { status: 401 });
    }

    const url = new URL(request.url);
    const stageId = url.searchParams.get("stageId");
    if (!stageId) {
      return NextResponse.json({ error: "Brak parametru stageId." }, { status: 400 });
    }

    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      select: { id: true, name: true, year: true, round: true, status: true },
    });
    if (!stage) {
      return NextResponse.json({ error: "Konkurs nie istnieje." }, { status: 404 });
    }

    const scoreboard = await getDetailedScoreboard(stageId);
    return NextResponse.json({ stage, ...scoreboard });
  } catch (error) {
    console.error("Public ranking API error", error);
    return NextResponse.json({ error: "Nie udalo sie pobrac rankingu." }, { status: 500 });
  }
}
