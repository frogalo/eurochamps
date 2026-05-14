import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_YEAR = "2026";

const participants = [
  {
    "name": "LOOK MUM NO COMPUTER",
    "country": "GB",
    "songPath": "Eins, Zwei, Drei",
    "description": "https://www.youtube.com/watch?v=niMKvJ-Itq8",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/united-kingdomjpg/United%20Kingdom-fill_size%3D800x1200-focal_point%3D5846x2300-focal_size%3D1616x1638-format%3Dwebp-fill_size%3D800x1200-focal_point%3D5846x2300-focal_size%3D1616x1638-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Bzikebi",
    "country": "GE",
    "songPath": "On Replay",
    "description": "https://www.youtube.com/watch?v=coh-lygCINY",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D800x1200-focal_point%3D1281x262-focal_size%3D188x188-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1281x262-focal_size%3D188x188-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Alis",
    "country": "AL",
    "songPath": "Nân",
    "description": "https://www.youtube.com/watch?v=b9AdRrA554o",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/img_6182jpeg/IMG_6182-fill_size%3D800x1200-focal_point%3D917x593-focal_size%3D491x571-format%3Dwebp-fill_size%3D800x1200-focal_point%3D917x593-focal_size%3D491x571-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "JIVA",
    "country": "AZ",
    "songPath": "Just Go",
    "description": "https://www.youtube.com/watch?v=iMDBPe25JhM",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20(1)-fill_size%3D800x1200-focal_point%3D1298x447-focal_size%3D224x279-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1298x447-focal_size%3D224x279-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Veronica Fusaro",
    "country": "CH",
    "songPath": "Alice",
    "description": "https://www.youtube.com/watch?v=PfpYGAzW5dM",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D800x1200-focal_point%3D1219x615-focal_size%3D436x403-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1219x615-focal_size%3D436x403-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Sarah Engels",
    "country": "DE",
    "songPath": "Fire",
    "description": "https://www.youtube.com/watch?v=FpGjPN1E2DE",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/germanyjpg/Germany-fill_size%3D800x1200-focal_point%3D1276x1003-focal_size%3D488x428-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1276x1003-focal_size%3D488x428-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Eva Marija",
    "country": "LU",
    "songPath": "Mother Nature",
    "description": "https://www.youtube.com/watch?v=DmVfJSRqgnI",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D800x1200-focal_point%3D1272x852-focal_size%3D445x445-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1272x852-focal_size%3D445x445-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Atvara",
    "country": "LV",
    "songPath": "Ēnā",
    "description": "https://www.youtube.com/watch?v=6C2ivaB5D00",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D800x1200-focal_point%3D1477x710-focal_size%3D392x459-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1477x710-focal_size%3D392x459-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Satoshi",
    "country": "MD",
    "songPath": "Viva, Moldova!",
    "description": "https://www.youtube.com/watch?v=SViojHjNSzc",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D800x1200-focal_point%3D1167x399-focal_size%3D482x523-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1167x399-focal_size%3D482x523-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Lion Ceccah",
    "country": "LT",
    "songPath": "Sólo Quiero Más",
    "description": "https://www.youtube.com/watch?v=0H-PXnbhG7A",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lithuaniajpg/Lithuania-fill_size%3D800x1200-focal_point%3D1306x690-focal_size%3D570x459-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1306x690-focal_size%3D570x459-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Tamara Živković",
    "country": "ME",
    "songPath": "Nova Zora",
    "description": "https://www.youtube.com/watch?v=nuvy2d60HbI",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D800x1200-focal_point%3D1378x418-focal_size%3D308x368-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1378x418-focal_size%3D308x368-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "AIDAN",
    "country": "MT",
    "songPath": "Bella",
    "description": "https://www.youtube.com/watch?v=CW6mQLBh6Js",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/maltajpg/Malta-fill_size%3D800x1200-focal_point%3D1189x630-focal_size%3D317x302-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1189x630-focal_size%3D317x302-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "LAVINA",
    "country": "RS",
    "songPath": "Kraj Mene",
    "description": "https://www.youtube.com/watch?v=FJTLKBOOE98",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/serbia-lavina-photo-5-by-natasa-stamatovicjpg/Serbia%2C%20Lavina%2C%20photo%205%20by%20Nata%C5%A1a%20Stamatovi%C4%87-fill_size%3D800x1200-focal_point%3D1905x1014-focal_size%3D345x300-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1905x1014-focal_size%3D345x300-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "SIMÓN",
    "country": "AM",
    "songPath": "Paloma Rumba",
    "description": "https://www.youtube.com/results?search_query=SIMON+Paloma+Rumba+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/armeniajpg/Armenia-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Delta Goodrem",
    "country": "AU",
    "songPath": "Eclipse",
    "description": "https://www.youtube.com/results?search_query=Delta+Goodrem+Eclipse+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/australiajpg/Australia-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "COSMÓ",
    "country": "AT",
    "songPath": "Tanzschein",
    "description": "https://www.youtube.com/results?search_query=COSMO+Tanzschein+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/austriajpg/Austria-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "ESSYLA",
    "country": "BE",
    "songPath": "Dancing on the Ice",
    "description": "https://www.youtube.com/results?search_query=ESSYLA+Dancing+on+the+Ice+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/belgiumjpg/Belgium-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "DARA",
    "country": "BG",
    "songPath": "Bangaranga",
    "description": "https://www.youtube.com/results?search_query=DARA+Bangaranga+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/bulgariajpg/Bulgaria-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "LELEK",
    "country": "HR",
    "songPath": "Andromeda",
    "description": "https://www.youtube.com/results?search_query=LELEK+Andromeda+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/croatiajpg/Croatia-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Antigoni",
    "country": "CY",
    "songPath": "JALLA",
    "description": "https://www.youtube.com/watch?v=JALLA_Antigoni_Eurovision_2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/cyprusjpg/Cyprus-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Daniel Zizka",
    "country": "CZ",
    "songPath": "CROSSROADS",
    "description": "https://www.youtube.com/watch?v=Daniel_Zizka_CROSSROADS_Eurovision_2026_Studio",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/czech-republicjpg/Czech%20Republic-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Søren Torpegaard Lund",
    "country": "DK",
    "songPath": "Før Vi Går Hjem",
    "description": "https://www.youtube.com/watch?v=Soren_Torpegaard_Lund_For_Vi_Gar_Hjem_Eurovision_2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/denmarkjpg/Denmark-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Vanilla Ninja",
    "country": "EE",
    "songPath": "Too Epic To Be True",
    "description": "https://www.youtube.com/watch?v=Vanilla_Ninja_Too_Epic_To_Be_True_Eurovision_2026_Official",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/estoniajpg/Estonia-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Linda Lampenius x Pete Parkkonen",
    "country": "FI",
    "songPath": "Liekinheitin",
    "description": "https://www.youtube.com/results?search_query=Linda+Lampenius+Pete+Parkkonen+Liekinheitin+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/finlandjpg/Finland-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Monroe",
    "country": "FR",
    "songPath": "Regarde !",
    "description": "https://www.youtube.com/results?search_query=Monroe+Regarde+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/francejpg/France-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Akylas",
    "country": "GR",
    "songPath": "Ferto",
    "description": "https://www.youtube.com/results?search_query=Akylas+Ferto+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/greecejpg/Greece-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Noam Bettan",
    "country": "IL",
    "songPath": "Michelle",
    "description": "https://www.youtube.com/results?search_query=Noam+Bettan+Michelle+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/israeljpg/Israel-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Sal Da Vinci",
    "country": "IT",
    "songPath": "Per Sempre Sì",
    "description": "https://www.youtube.com/results?search_query=Sal+Da+Vinci+Per+Sempre+Si+Eurovision+2026",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/italyjpg/Italy-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "JONAS LOVV",
    "country": "NO",
    "songPath": "YA YA YA",
    "description": "https://www.youtube.com/watch?v=F3a7d5N-L7I",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/norwayjpg/Norway-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "ALICJA",
    "country": "PL",
    "songPath": "Pray",
    "description": "https://www.youtube.com/watch?v=m4mVcUReR6Y",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/polandjpg/Poland-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Bandidos do Cante",
    "country": "PT",
    "songPath": "Rosa",
    "description": "https://www.youtube.com/watch?v=d3z6N8p5iC4",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/portugaljpg/Portugal-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Alexandra Căpitănescu",
    "country": "RO",
    "songPath": "Choke Me",
    "description": "https://www.youtube.com/watch?v=hB9FpW1mG6o",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/romaniajpg/Romania-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "SENHIT",
    "country": "SM",
    "songPath": "Superstar",
    "description": "https://www.youtube.com/watch?v=R9V1sH_L45E",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/san-marinojpg/San%20Marino-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "FELICIA",
    "country": "SE",
    "songPath": "My System",
    "description": "https://www.youtube.com/watch?v=wX-y5Q0g4zE",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/swedenjpg/Sweden-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "LELÉKA",
    "country": "UA",
    "songPath": "Ridnym",
    "description": "https://www.youtube.com/watch?v=sU9l6eP8k_A",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/ukrainejpg/Ukraine-fill_size%3D800x1200-format%3Dwebp.webp",
    "year": "2026"
  }
] as const;

async function main() {
  await prisma.artist.deleteMany({
    where: { year: SEED_YEAR },
  });

  await prisma.artist.createMany({
    data: participants.map((participant) => ({
      ...participant,
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
