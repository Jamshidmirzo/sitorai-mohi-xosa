/// One-shot: scans every image under public/uploads/gallery/** and writes
/// a sidecar JSON to src/lib/gallery-blur.json mapping URL → {width, height,
/// blurDataURL}. Consumed by the gallery page so next/image can render a
/// soft LQIP placeholder while the real photo loads.
///
/// Re-run after adding new photos:
///   npx tsx scripts/generate-gallery-blur.ts

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "uploads", "gallery");
const OUT_FILE = path.join(ROOT, "src", "lib", "gallery-blur.json");

type Entry = { width: number; height: number; blurDataURL: string };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function processFile(file: string): Promise<[string, Entry]> {
  const rel = "/" + path.relative(path.join(ROOT, "public"), file).replace(/\\/g, "/");
  const img = sharp(file);
  const meta = await img.metadata();
  const blurBuf = await sharp(file)
    .resize(12, undefined, { fit: "inside" })
    .jpeg({ quality: 50 })
    .toBuffer();
  const blurDataURL = `data:image/jpeg;base64,${blurBuf.toString("base64")}`;
  return [
    rel,
    {
      width: meta.width ?? 1000,
      height: meta.height ?? 1333,
      blurDataURL,
    },
  ];
}

async function main() {
  const files = await walk(GALLERY_DIR);
  console.log(`Found ${files.length} images`);
  const result: Record<string, Entry> = {};
  for (const file of files) {
    const [url, entry] = await processFile(file);
    result[url] = entry;
    console.log(`  + ${url} (${entry.width}×${entry.height})`);
  }
  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(result, null, 2));
  console.log(`Wrote ${OUT_FILE} (${files.length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
