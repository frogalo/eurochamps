import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const stage = await prisma.stage.findUnique({
      where: { id },
    });

    if (!stage) {
      return NextResponse.json({ error: "Nie znaleziono konkursu." }, { status: 404 });
    }

    const artists = await prisma.artist.findMany({
      where: { 
        year: stage.year,
        ...(stage.disabledArtists && stage.disabledArtists.length > 0 ? {
          id: { notIn: stage.disabledArtists }
        } : {})
      },
      orderBy: [
        { country: "asc" },
        { name: "asc" }
      ],
    });

    // Map database artists to the shape expected by the frontend
    const entries = artists.map((artist) => ({
      id: artist.id,
      artist: artist.name,
      country: artist.country,
      song: artist.songPath,
      note: artist.description,
      imagePath: artist.imagePath,
      // Default accents if not in DB
      accentFrom: "#00eefc",
      accentTo: "#121e7a",
    }));

    return NextResponse.json({
      stage: {
        ...stage,
        entries
      }
    });
  } catch (error) {
    console.error("Public stage detail API error", error);
    return NextResponse.json({ error: "Nie udało się pobrać szczegółów konkursu." }, { status: 500 });
  }
}
