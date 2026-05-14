import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_YEAR = "2026";

const participants = [
  {
    "name": "LOOK MUM NO COMPUTER",
    "country": "GB",
    "songPath": "Eins, Zwei, Drei",
    "description": "https://www.youtube.com/watch?v=niMKvJ-Itq8&pp=ygUmTE9PSyBNVU0gTk8gQ09NUFVURVIgIEVpbnMsIFp3ZWksIERyZWk%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/united-kingdomjpg/United%20Kingdom-fill_size%3D800x1200-focal_point%3D5846x2300-focal_size%3D1616x1638-format%3Dwebp-fill_size%3D800x1200-focal_point%3D5846x2300-focal_size%3D1616x1638-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Bzikebi",
    "country": "GE",
    "songPath": "On Replay",
    "description": "https://www.youtube.com/watch?v=coh-lygCINY&pp=ygUSQnppa2ViaSAgT24gUmVwbGF5",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D800x1200-focal_point%3D1281x262-focal_size%3D188x188-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1281x262-focal_size%3D188x188-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Alis",
    "country": "AL",
    "songPath": "Nân",
    "description": "https://www.youtube.com/watch?v=b9AdRrA554o&pp=ygUIZWxpcyBuYW4%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/img_6182jpeg/IMG_6182-fill_size%3D800x1200-focal_point%3D917x593-focal_size%3D491x571-format%3Dwebp-fill_size%3D800x1200-focal_point%3D917x593-focal_size%3D491x571-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "JIVA",
    "country": "AZ",
    "songPath": "Just Go",
    "description": "https://www.youtube.com/watch?v=iMDBPe25JhM&pp=ygUNSklWQSAgSnVzdCBHbw%3D%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20(1)-fill_size%3D800x1200-focal_point%3D1298x447-focal_size%3D224x279-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1298x447-focal_size%3D224x279-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Veronica Fusaro",
    "country": "CH",
    "songPath": "Alice",
    "description": "https://www.youtube.com/watch?v=PfpYGAzW5dM&pp=ygUWVmVyb25pY2EgRnVzYXJvICBBbGljZQ%3D%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D800x1200-focal_point%3D1219x615-focal_size%3D436x403-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1219x615-focal_size%3D436x403-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Sarah Engels",
    "country": "DE",
    "songPath": "Fire",
    "description": "https://www.youtube.com/watch?v=FpGjPN1E2DE&pp=ygUSU2FyYWggRW5nZWxzICBGaXJl",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/germanyjpg/Germany-fill_size%3D800x1200-focal_point%3D1276x1003-focal_size%3D488x428-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1276x1003-focal_size%3D488x428-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Eva Marija",
    "country": "LU",
    "songPath": "Mother Nature",
    "description": "https://www.youtube.com/watch?v=DmVfJSRqgnI&pp=ygUZRXZhIE1hcmlqYSAgTW90aGVyIE5hdHVyZQ%3D%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D800x1200-focal_point%3D1272x852-focal_size%3D445x445-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1272x852-focal_size%3D445x445-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Atvara",
    "country": "LV",
    "songPath": "Ēnā",
    "description": "https://www.youtube.com/watch?v=6C2ivaB5D00&pp=ygUNQXR2YXJhICDEkm7EgQ%3D%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D800x1200-focal_point%3D1477x710-focal_size%3D392x459-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1477x710-focal_size%3D392x459-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Satoshi",
    "country": "MD",
    "songPath": "Viva, Moldova!",
    "description": "https://www.youtube.com/watch?v=SViojHjNSzc&pp=ygUXU2F0b3NoaSAgVml2YSwgTW9sZG92YSE%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D800x1200-focal_point%3D1167x399-focal_size%3D482x523-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1167x399-focal_size%3D482x523-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Lion Ceccah",
    "country": "LT",
    "songPath": "Sólo Quiero Más",
    "description": "https://www.youtube.com/watch?v=0H-PXnbhG7A&list=RD0H-PXnbhG7A&start_radio=1",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lithuaniajpg/Lithuania-fill_size%3D800x1200-focal_point%3D1306x690-focal_size%3D570x459-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1306x690-focal_size%3D570x459-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "Tamara Živković",
    "country": "ME",
    "songPath": "Nova Zora",
    "description": "https://www.youtube.com/watch?v=nuvy2d60HbI&list=RDnuvy2d60HbI&start_radio=1",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D800x1200-focal_point%3D1378x418-focal_size%3D308x368-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1378x418-focal_size%3D308x368-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "AIDAN",
    "country": "MT",
    "songPath": "Bella",
    "description": "https://www.youtube.com/watch?v=CW6mQLBh6Js&pp=ygUMQUlEQU4gIEJlbGxh",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/maltajpg/Malta-fill_size%3D800x1200-focal_point%3D1189x630-focal_size%3D317x302-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1189x630-focal_size%3D317x302-format%3Dwebp.webp",
    "year": "2026"
  },
  {
    "name": "LAVINA",
    "country": "RS",
    "songPath": "Kraj Mene",
    "description": "https://www.youtube.com/watch?v=FJTLKBOOE98&pp=ygURTEFWSU5BICBLcmFqIE1lbmU%3D",
    "imagePath": "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/serbia-lavina-photo-5-by-natasa-stamatovicjpg/Serbia%2C%20Lavina%2C%20photo%205%20by%20Nata%C5%A1a%20Stamatovi%C4%87-fill_size%3D800x1200-focal_point%3D1905x1014-focal_size%3D345x300-format%3Dwebp-fill_size%3D800x1200-focal_point%3D1905x1014-focal_size%3D345x300-format%3Dwebp.webp",
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
