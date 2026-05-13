import { VoteType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createVoteBatch } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";

const createVoteBatchSchema = z.object({
  stageId: z.string().trim().min(1),
  voterName: z.string().trim().min(1).max(100),
  voteType: z.nativeEnum(VoteType),
  votes: z.array(
    z.object({
      artistId: z.string().trim().min(1),
      rank: z.number().int().min(0).max(12),
    })
  ),
});

export async function POST(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));

    const body = await request.json();
    const parsed = createVoteBatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Niepoprawne dane glosowania." }, { status: 400 });
    }

    const votes = await createVoteBatch(parsed.data);
    return NextResponse.json({ votes }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
    }

    console.error("Admin votes error", error);
    return NextResponse.json({ error: "Zapis glosow nie powiodl sie." }, { status: 500 });
  }
}
