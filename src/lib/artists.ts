import { prisma } from "@/lib/prisma";

export async function listArtists() {
  return prisma.artist.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
}

export async function createArtist(input: {
  name: string;
  country: string;
  description: string;
  imagePath: string;
  songPath: string;
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
