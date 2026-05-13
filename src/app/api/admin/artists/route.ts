import { NextResponse } from "next/server";
import { z } from "zod";

import { createArtist, getAdminArtists } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";

const artistSchema = z.object({
  name: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(10),
  songPath: z.string().trim().max(200).default(""),
  description: z.string().trim().max(500).default(""),
  imagePath: z.string().trim().max(500).default(""),
  year: z.string().trim().min(1).max(10),
});

export async function GET(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const artists = await getAdminArtists();
    return NextResponse.json({ artists });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));

    const parsed = artistSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Niepoprawne dane artysty." }, { status: 400 });
    }

    const artist = await createArtist(parsed.data);
    return NextResponse.json({ artist }, { status: 201 });
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

  console.error("Admin artists error", error);
  return NextResponse.json({ error: "Operacja na artystach nie powiodla sie." }, { status: 500 });
}
