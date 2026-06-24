/// Idempotent seeder for the Xonai Xasht (8-burchakli mehmonxona / costume hall)
/// photo gallery — the 2nd museum in the Sitorai Mohi Xosa complex.
/// Photos live in public/uploads/gallery/xonai-xasht/ and ship with the repo.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORY = "xonai-xasht";

type GalleryItem = {
  file: string;
  alt: string;
  order: number;
};

const ITEMS: GalleryItem[] = [
  { file: "xonai-xasht-01.jpg", order: 1, alt: "Long velvet chapan with gold zarduzi embroidery (purple)" },
  { file: "xonai-xasht-02.jpg", order: 2, alt: "Dark chapan with floral medallion pattern in gold thread" },
  { file: "xonai-xasht-03.jpg", order: 3, alt: "Striped chapan with embroidered roundel and gold trim" },
  { file: "xonai-xasht-04.jpg", order: 4, alt: "Two chapans on display — cream embroidered and checkered black-and-white" },
  { file: "xonai-xasht-05.jpg", order: 5, alt: "Saffron and magenta chapans in glass cases" },
  { file: "xonai-xasht-06.jpg", order: 6, alt: "Bukharan ikat-pattern chapan (adras)" },
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
