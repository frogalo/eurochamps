import { NextResponse } from "next/server";

import { getArtistsByYear } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ stageId: string }> }
) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const { stageId } = await context.params;

    const stage = await prisma.stage.findUnique({ where: { id: stageId } });

    if (!stage) {
      return NextResponse.json({ error: "Nie znaleziono konkursu." }, { status: 404 });
    }

    const artists = await getArtistsByYear(stage.year);

    return NextResponse.json({
      stage: {
        ...stage,
        entries: artists.map((a) => ({
          artist: a,
        })),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
    }
    console.error("Admin participants error", error);
    return NextResponse.json({ error: "Operacja nie powiodla sie." }, { status: 500 });
  }
}
