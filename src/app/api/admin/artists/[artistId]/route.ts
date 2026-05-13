import { NextResponse } from "next/server";
import { z } from "zod";

import { updateArtist, deleteArtist } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";

const updateArtistSchema = z.object({
  name: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(10),
  songPath: z.string().trim().max(200).default(""),
  description: z.string().trim().max(500).default(""),
  imagePath: z.string().trim().max(500).default(""),
  year: z.string().trim().min(1).max(10),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ artistId: string }> }
) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const { artistId } = await context.params;

    const parsed = updateArtistSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Niepoprawne dane artysty." }, { status: 400 });
    }

    const artist = await updateArtist(artistId, parsed.data);
    return NextResponse.json({ artist });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ artistId: string }> }
) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const { artistId } = await context.params;

    await deleteArtist(artistId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

function handleAdminError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
  }

  console.error("Admin artist mutation error", error);
  return NextResponse.json({ error: "Zmiana artysty nie powiodla sie." }, { status: 500 });
}
