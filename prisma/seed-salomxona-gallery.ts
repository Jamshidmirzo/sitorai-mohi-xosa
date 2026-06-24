/// Idempotent seeder for the Salomxona (Qabulxona / Reception) photo gallery.
/// Photos live in public/uploads/gallery/salomxona/ and ship with the repo.
/// Captions intentionally minimal — long-form descriptions land later as Posts
/// when text material from the museum arrives.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORY = "salomxona";

type GalleryItem = {
  file: string;
  alt: string;
  order: number;
};

const ITEMS: GalleryItem[] = [
  { file: "salomxona-01.jpg", order: 1, alt: "Salomxona — Chinese and Japanese porcelain vases in the arched-window hall" },
  { file: "salomxona-02.jpg", order: 2, alt: "Qabulxona binosi — historical plaque (uz/ru/en), built 1912–1914 under Sayyid Olim Khan" },
  { file: "salomxona-03.jpg", order: 3, alt: "Reception building — exterior facade with carved kiosk pavilion" },
  { file: "salomxona-04.jpg", order: 4, alt: "Grand white hall with central chandelier and ceremonial seating" },
  { file: "salomxona-05.jpg", order: 5, alt: "Writing instruments — calligraphy brushes and paper, late 19th century" },
  { file: "salomxona-06.jpg", order: 6, alt: "Decorative miniature cup set in mirrored display case" },
  { file: "salomxona-07.jpg", order: 7, alt: "Pair of large decorative porcelain plates" },
  { file: "salomxona-08.jpg", order: 8, alt: "Carved wooden kursi against star-pattern wall paneling" },
  { file: "salomxona-09.jpg", order: 9, alt: "Japanese porcelain vase — late 19th century (Guldonlar · Chinni · Yaponiya)" },
  { file: "salomxona-10.jpg", order: 10, alt: "Tall wooden cabinet with mirror" },
  { file: "salomxona-11.jpg", order: 11, alt: "Russian service table — wood and glass, end of 19th century" },
  { file: "salomxona-12.jpg", order: 12, alt: "Silver-rimmed display case with silver vessel" },
  { file: "salomxona-13.jpg", order: 13, alt: "Hall corner — portrait of the Emir, longcase clock, mirrored cabinet" },
  { file: "salomxona-14.jpg", order: 14, alt: "Yermak — metal sculpture, Russia, end of 19th century" },
  { file: "salomxona-15.jpg", order: 15, alt: "Silver winged-horse sculpture and antique tea cart" },
];

async function main() {
  console.log(`Seeding gallery category «${CATEGORY}» (${ITEMS.length} items)`);
  let added = 0;
  let updated = 0;

  for (const item of ITEMS) {
    const url = `/uploads/gallery/${CATEGORY}/${item.file}`;
    const existing = await prisma.galleryImage.findFirst({ where: { url } });
    if (existing) {
      await prisma.galleryImage.update({
        where: { id: existing.id },
        data: { alt: item.alt, category: CATEGORY, order: item.order },
      });
      updated += 1;
      continue;
    }
    await prisma.galleryImage.create({
      data: { url, alt: item.alt, category: CATEGORY, order: item.order },
    });
    added += 1;
  }

  console.log(`  + added: ${added}`);
  console.log(`  ↺ updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
