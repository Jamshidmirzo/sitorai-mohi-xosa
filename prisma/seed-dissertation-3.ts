/// Batch-4 additive seeder. Idempotent.
/// Pulls more material from Roziqulova Sh.K. master’s dissertation (2026):
///   - Shohnoma silk carpet from 18th-c Shiraz (5×3 m), Bahrom Gur fighting the lion
///   - Khonai Xasht — the 8-room national costume museum
///   - Updates to existing exhibits with primary-source details:
///       throne hall: 0.5-tonne Warsaw chandelier, court poet Anbariy verses on ceiling,
///                    Shirin Muradov’s 2-year vow not to enter the palace
///       carved ganch panel: White Hall is 17×7 m × 6.7 m and never repeats a pattern
///       chinese-japanese porcelain: 1937–38 permanent "Chinese Porcelain" exhibition
///                    of 320 pieces — a milestone in Uzbek museography

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };
const LOCS = ["en", "ru", "uz"] as const;

const HALLS = [
  {
    slug: "khonai-xasht-costume",
    number: 13,
    name: {
      en: "Xonai Xasht — National Costume Museum",
      ru: "Хонаи Хашт — музей национального костюма",
      uz: "Xonai Xasht — milliy kiyimlar muzeyi",
    },
  },
];

type ExhibitSeed = {
  slug: string;
  order: number;
  featured: boolean;
  bg: string;
  shot: string;
  hallSlug: string;
  categorySlug: string;
  period: Trans<string>;
  material: Trans<string>;
  tag: Trans<string>;
  name: Trans<string>;
  story: Trans<string>;
};

const EXHIBITS: ExhibitSeed[] = [
  {
    slug: "shohnoma-shiraz-carpet",
    order: 24,
    featured: true,
    bg: "linear-gradient(155deg,#6a3329,#3b1c16 70%,#1c0d0a)",
    shot: "[ Sheroz · 5×3 m · Bahrom Gur ·  Shohnoma ]",
    hallSlug: "bath-room",
    categorySlug: "textiles",
    period: { en: "18th c.", ru: "XVIII в.", uz: "XVIII asr" },
    material: {
      en: "Hand-knotted Iranian wool on cotton warp; figural narrative miniature",
      ru: "Иранская ручная узловая работа, шерсть по хлопковой основе; фигуративная нарративная миниатюра",
      uz: "Eron qo‘l tugun ishi, paxta asosga jun; figurali hikoyali miniatyura",
    },
    tag: { en: "Shohnoma Cycle", ru: "Цикл «Шохнаме»", uz: "Shohnoma sikli" },
    name: {
      en: "Bahrom Gur and the Lion: a Shiraz Carpet from the Shohnoma",
      ru: "Бахром Гур и Лев: ширазский ковёр со сценой из «Шохнаме»",
      uz: "Bahrom Gur va Sher: Shohnomadan Sheroz gilami",
    },
    story: {
      en: "On the western wall of the corridor between palace and bathroom hangs a 5×3 metre Iranian carpet, woven in 18th-century Shiraz. It carries a miniature illustrating the Shohnoma — Ferdowsi’s great epic. The scene chosen is the duel of Shah Bahrom with the lion: Bahrom defeats the beast in single combat and earns the epithet «Gur», «the lion-tamer». A Persian classical text translated into wool, hung above European parquet, in a Bukharan emir’s bath corridor — three civilisations at one metre’s distance.",
      ru: "На западной стене коридора, ведущего из дворца в банный покой, висит ковёр размером 5×3 метра, тканный в XVIII веке в иранском Ширазе. На нём — миниатюра по эпосу «Шохнаме» Фирдоуси. Выбрана сцена поединка Шох Бахрома со львом: Бахром побеждает зверя в одиночном бою и получает прозвище «Гур», «Укротитель льва». Персидский классический текст, переведённый в шерсть, повешен над европейским паркетом в банном коридоре бухарского эмира — три цивилизации на расстоянии одного метра.",
      uz: "Saroy bilan vannaxona o‘rtasidagi dahlizning g‘arb tomon devorida 5×3 metrlik eron gilami osig‘liq turibdi — XVIII asrda Eronning Sheroz shahrida to‘qilgan. Unga Firdavsiyning «Shohnoma»sidan miniatyura tushirilgan. Tanlangan sahna — shox Bahromning sher bilan yakkama-yakka jangi: Bahrom yirtqichni yengadi va «Gur» — «sherni yenggan shox» laqabini oladi. Eron klassik matni junga aylantirilgan, yevropacha parket ustida, buxoro amiri hammomi yo‘lagida osilgan — uchta tsivilizatsiya bir metr masofada.",
    },
  },
  {
    slug: "khonai-xasht-pavilion",
    order: 25,
    featured: true,
    bg: "linear-gradient(155deg,#5a3b6f,#311e3d 70%,#170d1c)",
    shot: "[ 8 xonali pavilon · milliy kiyimlar · XIX–XX asrlar ]",
    hallSlug: "khonai-xasht-costume",
    categorySlug: "textiles",
    period: { en: "19th – 20th c.", ru: "XIX – XX вв.", uz: "XIX – XX asrlar" },
    material: {
      en: "Silk velvet, ikat, suzani embroidery, gold-thread zarduzi, woven hair-ornaments",
      ru: "Шёлковый бархат, икат, сюзане, золотное шитьё зардузи, тканые украшения для волос",
      uz: "Ipak baxmal, ikat, suzana, zarduzi oltin kashta, to‘qilgan soch bezaklari",
    },
    tag: {
      en: "National Costume Museum",
      ru: "Музей национального костюма",
      uz: "Milliy kiyimlar muzeyi",
    },
    name: {
      en: "Xonai Xasht — the Eight-Room Costume Pavilion",
      ru: "Хонаи Хашт — восьмикомнатный павильон костюма",
      uz: "Xonai Xasht — sakkiz xonali kiyim pavilonи",
    },
    story: {
      en: "An eight-room pavilion on the southern edge of the palace — Xonai Xasht — was turned in the late Soviet years into the Museum of 19th- and 20th-century Bukharan National Costume. Visitors walk from room to room past chapans of every social class, brides’ wedding dress, embroidered tubeteika caps, gold-thread paranja, woven hair-ornaments and the dyer’s tools. The fabrics are local — adras, banoras, silk velvet, hand-knotted cotton — and the dyes the same that the Nurata workshops boiled three times in madder root.",
      ru: "Восьмикомнатный павильон у южной границы дворца — Хонаи Хашт — в позднесоветские годы был превращён в музей бухарского национального костюма XIX–XX веков. Посетители проходят от комнаты к комнате мимо чапанов всех сословий, свадебных нарядов невест, вышитых тюбетеек, паранджи с золотным шитьём, тканых украшений для волос и инструментов красильщика. Ткани местные — адрас, банорас, шёлковый бархат, ручной хлопок — а краски те же, что и в нуратских мастерских.",
      uz: "Saroyning janubiy chekkasidagi sakkiz xonali pavilon — Xonai Xasht — sovet davrining oxirlarida XIX–XX asrlar Buxoro milliy kiyimlari muzeyiga aylantirildi. Tashrif buyuruvchilar xonadan xonaga o‘tib har xil tabaqaning choponlari, kelinlik liboslari, kashtali do‘ppilar, zardo‘zlik paranji, to‘qilgan soch bezaklari va bo‘yoqchi asboblari yonidan o‘tadi. Matolar mahalliy — adras, banoras, ipak baxmal, qo‘l paxtasi — bo‘yoqlar esa Nurota ustaxonalari ro‘yan ildizida uch marta qaynatib olgan o‘sha bo‘yoqlardir.",
    },
  },
];

const STORY_PATCHES: { slug: string; locale: "en" | "ru" | "uz"; appendStory: string }[] = [
  {
    slug: "the-throne",
    locale: "en",
    appendStory:
      "\n\nThe court poet Anbariy’s verses run along the ceiling in Persian script. The chandelier above the throne weighs half a tonne — its crystal panels were cut in Warsaw, the bulbs blown in Vienna, the motor turned in Germany. Before he began the work, master Shirin Muradov made a single condition: he would not be allowed to enter the palace until the entire structure was finished. Two years later the Emir Sayyid Olim-Khan walked into the White Hall and could only say «tashakkur» — «thank you».",
  },
  {
    slug: "the-throne",
    locale: "ru",
    appendStory:
      "\n\nСтихи придворного поэта Анбария идут по потолку арабской вязью на фарси. Люстра над троном весит полтонны — хрустальные грани резали в Варшаве, лампы дули в Вене, мотор обтачивали в Германии. Прежде чем начать работу, мастер Ширин Мурадов поставил единственное условие: его не должны пускать во дворец до самого конца стройки. Через два года эмир Саид Олим-хан вошёл в Белый зал и смог сказать только одно — «ташаккур», «спасибо».",
  },
  {
    slug: "the-throne",
    locale: "uz",
    appendStory:
      "\n\nSaroy shoiri Anbariyning baytlari shift bo‘ylab fors tilida arab yozuvida o‘tadi. Taxt ustidagi qandilning og‘irligi yarim tonna — uning billur qirralari Varshavada kesilgan, lampochkalari Venada puflangan, motori Olmoniyada yo‘nilgan. Ishni boshlashdan oldin usta Shirin Murodov bitta shart qo‘ydi: ish to‘liq tugamaguncha uni saroyga kiritmaslik. Ikki yil o‘tib amir Sayyid Olimxon Oq Zalga kirdi va ixtiyorsiz «tashakkur» dedi.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "en",
    appendStory:
      "\n\nThe White Hall is 17 metres long, 7 metres deep, 6.7 metres tall — unheard-of dimensions for the time. And yet no carved pattern is repeated anywhere in the room. The arches, the mukarnas above them, the sharafa cornices, every wall panel — all hand-cut into ganch by the master himself.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "ru",
    appendStory:
      "\n\nБелый зал — 17 метров в длину, 7 в глубину, 6,7 в высоту — неслыханные размеры для своего времени. И при этом ни один резной узор в зале не повторяется. Арки, мукарнас над ними, шарафа-карнизы, каждая стенная панель — всё прорезано в ганче рукой самого мастера.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "uz",
    appendStory:
      "\n\nOq Zal — uzunligi 17 metr, chuqurligi 7 metr, balandligi 6,7 metr — o‘sha davr uchun misli ko‘rilmagan o‘lcham. Va shunga qaramay zalda biror o‘yma naqsh takrorlanmagan. Ravoqlar, ularning ustidagi mukarnaslar, sharafa karnizlari, har bir devor paneli — hammasi ustaning o‘zining qo‘li bilan ganchga o‘yilgan.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "en",
    appendStory:
      "\n\nIn 1937–38 the museum opened a permanent exhibition of 320 selected pieces under the title «Chinese Porcelain» — a milestone in early-Soviet museography in Uzbekistan and one of the first large-scale ethnographic exhibitions in the country built on a scientific catalogue. The pieces shown today are descendants of that landmark display.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "ru",
    appendStory:
      "\n\nВ 1937–38 годах в музее открылась постоянная экспозиция из 320 отобранных предметов под названием «Китайский фарфор» — веха раннесоветской музеографии в Узбекистане и одна из первых крупных этнографических выставок в стране, построенная на научном каталоге. Экспонаты, что мы видим сегодня, — потомки той определяющей экспозиции.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "uz",
    appendStory:
      "\n\n1937–38-yillarda muzey 320 ta saralangan buyumdan iborat «Xitoy chinnisi» nomli doimiy ko‘rgazmani ochdi — bu O‘zbekistondagi erta sovet muzeografiyasining bosqichi va ilmiy katalogga asoslangan birinchi yirik etnografik ko‘rgazmalardan biri edi. Bugun ko‘rsatilayotgan buyumlar o‘sha hal qiluvchi ekspozitsiyaning avlodlaridir.",
  },
];

async function upsertHall(slug: string, number: number, name: Trans<string>) {
  const existing = await prisma.hall.findUnique({ where: { slug } });
  if (existing) {
    for (const loc of LOCS) {
      await prisma.hallTranslation.upsert({
        where: { hallId_locale: { hallId: existing.id, locale: loc } },
        create: { hallId: existing.id, locale: loc, name: name[loc] },
        update: { name: name[loc] },
      });
    }
    return existing;
  }
  return prisma.hall.create({
    data: {
      slug,
      number,
      translations: { create: LOCS.map((loc) => ({ locale: loc, name: name[loc] })) },
    },
  });
}

async function insertExhibitIfMissing(ex: ExhibitSeed, hallIds: Map<string, string>, catIds: Map<string, string>) {
  const existing = await prisma.exhibit.findUnique({ where: { slug: ex.slug } });
  if (existing) {
    console.log(`  ↺ skip (already exists): ${ex.slug}`);
    return;
  }
  await prisma.exhibit.create({
    data: {
      slug: ex.slug,
      order: ex.order,
      featured: ex.featured,
      bg: ex.bg,
      shot: ex.shot,
      period: ex.period.en,
      material: ex.material.en,
      hallId: hallIds.get(ex.hallSlug),
      categoryId: catIds.get(ex.categorySlug),
      translations: {
        create: LOCS.map((loc) => ({
          locale: loc,
          name: ex.name[loc],
          tag: ex.tag[loc],
          story: ex.story[loc],
        })),
      },
    },
  });
  console.log(`  + ${ex.slug}`);
}

async function patchExistingStories() {
  for (const p of STORY_PATCHES) {
    const ex = await prisma.exhibit.findUnique({ where: { slug: p.slug } });
    if (!ex) continue;
    const tr = await prisma.exhibitTranslation.findUnique({
      where: { exhibitId_locale: { exhibitId: ex.id, locale: p.locale } },
    });
    if (!tr) continue;
    if (tr.story?.includes(p.appendStory.trim().slice(0, 50))) continue;
    await prisma.exhibitTranslation.update({
      where: { exhibitId_locale: { exhibitId: ex.id, locale: p.locale } },
      data: { story: (tr.story ?? "") + p.appendStory },
    });
    console.log(`  ✏ patched story: ${p.slug} (${p.locale})`);
  }
}

async function main() {
  console.log("→ upserting halls (batch 4)");
  const hallIds = new Map<string, string>();
  for (const h of HALLS) {
    const row = await upsertHall(h.slug, h.number, h.name);
    hallIds.set(h.slug, row.id);
  }
  const allHalls = await prisma.hall.findMany();
  for (const h of allHalls) hallIds.set(h.slug, h.id);

  const catIds = new Map<string, string>();
  const allCats = await prisma.category.findMany();
  for (const c of allCats) catIds.set(c.slug, c.id);

  console.log(`→ inserting ${EXHIBITS.length} new exhibits`);
  for (const ex of EXHIBITS) {
    await insertExhibitIfMissing(ex, hallIds, catIds);
  }

  console.log(`→ patching existing exhibit stories`);
  await patchExistingStories();

  console.log("✓ dissertation seed v3 complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
