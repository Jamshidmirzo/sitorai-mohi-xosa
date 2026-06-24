/// Idempotent seeder for the Harem photo gallery — 3rd museum in the complex.
/// Photos live in public/uploads/gallery/harem/ and ship with the repo.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORY = "harem";

type GalleryItem = {
  file: string;
  alt: string;
  order: number;
};

const ITEMS: GalleryItem[] = [
  { file: "harem-01.jpg", order: 1, alt: "Harem building — exterior view with ornamented dome" },
  { file: "harem-02.jpg", order: 2, alt: "Twin tower pavilions in the harem garden" },
  { file: "harem-03.jpg", order: 3, alt: "Three Bukharan glazed ceramic plates" },
  { file: "harem-04.jpg", order: 4, alt: "Gijduvan ceramic plate by Ibadulla Narzullayev, early 20th century" },
  { file: "harem-05.jpg", order: 5, alt: "Hall corner with mirrored cabinet, ceramics and stained-glass window" },
  { file: "harem-06.jpg", order: 6, alt: "Women's costumes and suzani on the walls of the harem hall" },
  { file: "harem-07.jpg", order: 7, alt: "Large suzani embroidery with red-orange medallion pattern" },
  { file: "harem-08.jpg", order: 8, alt: "Display case with golden vase" },
  { file: "harem-09.jpg", order: 9, alt: "Suzani embroidery close-up with exhibit label" },
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
