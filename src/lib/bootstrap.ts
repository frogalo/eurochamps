import { prisma } from "@/lib/prisma";
import { STAGES } from "@/lib/stages";

export async function ensureInitialContestData() {
  const existingStages = await prisma.stage.count();

  if (existingStages > 0) {
    return;
  }

  const defaultYear = "2025";

  for (const stage of STAGES) {
    await prisma.stage.create({
      data: {
        name: stage.name,
        year: defaultYear,
        place: "Bazylea",
        logoUrl: "/globe.svg",
        round: stage.round,
        date: stage.date,
        tagline: stage.tagline,
        description: stage.description,
      },
    });

    for (const entry of stage.entries) {
      const existingArtist = await prisma.artist.findFirst({
        where: { name: entry.artist, year: defaultYear },
      });

      if (!existingArtist) {
        await prisma.artist.create({
          data: {
            name: entry.artist,
            country: entry.country,
            songPath: entry.song,
            description: entry.note,
            imagePath: "",
            year: defaultYear,
          },
        });
      }
    }
  }
}
