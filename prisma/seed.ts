import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_YEAR = "2026";

const participants = [
  { name: "Alis", songPath: "Nân", country: "AL" },
  { name: "SIMÓN", songPath: "Paloma Rumba", country: "AM" },
  { name: "Delta Goodrem", songPath: "Eclipse", country: "AU" },
  { name: "COSMÓ", songPath: "Tanzschein", country: "AT" },
  { name: "JIVA", songPath: "Just Go", country: "AZ" },
  { name: "ESSYLA", songPath: "Dancing on the Ice", country: "BE" },
  { name: "DARA", songPath: "Bangaranga", country: "BG" },
  { name: "LELEK", songPath: "Andromeda", country: "HR" },
  { name: "Antigoni", songPath: "JALLA", country: "CY" },
  { name: "Daniel Zizka", songPath: "CROSSROADS", country: "CZ" },
  { name: "Søren Torpegaard Lund", songPath: "Før Vi Går Hjem", country: "DK" },
  { name: "Vanilla Ninja", songPath: "Too Epic To Be True", country: "EE" },
  { name: "Linda Lampenius x Pete Parkkonen", songPath: "Liekinheitin", country: "FI"},
  { name: "Monroe", songPath: "Regarde !", country: "FR" },
  { name: "Bzikebi", songPath: "On Replay", country: "GE" },
  { name: "Sarah Engels", songPath: "Fire", country: "DE" },
  { name: "Akylas", songPath: "Ferto", country: "GR" },
  { name: "Noam Bettan", songPath: "Michelle", country: "IL" },
  { name: "Sal Da Vinci", songPath: "Per Sempre Sì", country: "IT" },
  { name: "Atvara", songPath: "Ēnā", country: "LV" },
  { name: "Lion Ceccah", songPath: "Sólo Quiero Más", country: "LT" },
  { name: "Eva Marija", songPath: "Mother Nature", country: "LU" },
  { name: "AIDAN", songPath: "Bella", country: "MT" },
  { name: "Satoshi", songPath: "Viva, Moldova!", country: "MD" },
  { name: "Tamara Živković", songPath: "Nova Zora", country: "ME" },
  { name: "JONAS LOVV", songPath: "YA YA YA", country: "NO" },
  { name: "ALICJA", songPath: "Pray", country: "PL" },
  { name: "Bandidos do Cante", songPath: "Rosa", country: "PT" },
  { name: "Alexandra Căpitănescu", songPath: "Choke Me", country: "RO" },
  { name: "SENHIT", songPath: "Superstar", country: "SM" },
  { name: "LAVINA", songPath: "Kraj Mene", country: "RS" },
  { name: "FELICIA", songPath: "My System", country: "SE" },
  { name: "Veronica Fusaro", songPath: "Alice", country: "CH" },
  { name: "LELÉKA", songPath: "Ridnym", country: "UA" },
  { name: "LOOK MUM NO COMPUTER", songPath: "Eins, Zwei, Drei", country: "GB"}
] as const;

async function main() {
  await prisma.artist.deleteMany({
    where: { year: SEED_YEAR },
  });

  await prisma.artist.createMany({
    data: participants.map((participant) => ({
      ...participant,
      description: "",
      imagePath: "",
      year: SEED_YEAR,
    })),
  });

  console.log(
    `Seeded ${participants.length} participants for year ${SEED_YEAR}.`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
