import { NextResponse } from "next/server";
import { z } from "zod";

import { getFinalStageRanking, upsertFinalStageRanking } from "@/lib/final-ranking";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";

const finalRankingSchema = z.object({
  stageId: z.string().trim().min(1),
  rankings: z.array(
    z.object({
      artistId: z.string().trim().min(1),
      position: z.number().int().min(1),
      points: z.number().int().min(0).optional(),
    })
  ),
});

export async function GET(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));

    const url = new URL(request.url);
    const stageId = url.searchParams.get("stageId");
    if (!stageId) {
      return NextResponse.json({ error: "Brak parametru stageId." }, { status: 400 });
    }

    const ranking = await getFinalStageRanking(stageId);
    return NextResponse.json({ ranking });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
    }
    console.error("Admin final ranking GET error", error);
    return NextResponse.json({ error: "Nie udalo sie pobrac rankingu finalnego." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));

    const parsed = finalRankingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Niepoprawne dane rankingu finalnego." }, { status: 400 });
    }

    const positions = parsed.data.rankings.map((entry) => entry.position);
    if (new Set(positions).size !== positions.length) {
      return NextResponse.json({ error: "Pozycje finalne musza byc unikalne." }, { status: 400 });
    }

    await upsertFinalStageRanking(parsed.data.stageId, parsed.data.rankings);
    const ranking = await getFinalStageRanking(parsed.data.stageId);
    return NextResponse.json({ ranking }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
    }
    console.error("Admin final ranking POST error", error);
    return NextResponse.json({ error: "Nie udalo sie zapisac rankingu finalnego." }, { status: 500 });
  }
}
