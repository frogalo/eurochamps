import { prisma } from "@/lib/prisma";

export async function listArtists() {
  return prisma.artist.findMany({
    orderBy: [{ year: "desc" }, { country: "asc" }, { name: "asc" }],
  });
}

export async function createArtist(input: {
  name: string;
  country: string;
  description: string;
  imagePath: string;
  songPath: string;
  year: string;
}) {
  return prisma.artist.create({
    data: input,
  });
}

export async function getArtistById(id: string) {
  return prisma.artist.findUnique({
    where: { id },
  });
}
