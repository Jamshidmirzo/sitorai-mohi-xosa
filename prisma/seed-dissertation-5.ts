/// Batch-7 additive seeder. Idempotent.
/// Adds the kanizakxona embroidery museum hall, three new exhibits about Bukhara
/// embroidery and Gʻijduvon pottery traditions, and a story patch about the
/// "unfinished element" religious-aesthetic principle.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };
const LOCS = ["en", "ru", "uz"] as const;

const HALLS = [
  {
    slug: "kanizakxona",
    number: 15,
    name: {
      en: "Kanizakxona — Bukharan Embroidery Museum",
      ru: "Канизакхана — музей бухарской вышивки",
      uz: "Kanizakxona — Buxoro kashtachilik muzeyi",
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
    slug: "bukhara-embroidery-school",
    order: 29,
    featured: true,
    bg: "linear-gradient(155deg,#5d2a4a,#321625 70%,#170a11)",
    shot: "[ Buxoro kashtachilik · so‘zani · ipak ]",
    hallSlug: "kanizakxona",
    categorySlug: "textiles",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Hand-spun silk thread, natural plant and mineral dyes on cotton, half-silk adras and shoyi grounds",
      ru: "Шёлковая нить ручной прядки, натуральные растительные и минеральные красители; основа — хлопок, полушёлк-адрас, шойи",
      uz: "Qo‘l yigirilgan ipak ip, tabiiy o‘simlik va mineral bo‘yoqlar; asos — paxta, yarim ipak adras, shoyi",
    },
    tag: { en: "Bukhara Embroidery", ru: "Бухарская вышивка", uz: "Buxoro kashtachilik" },
    name: {
      en: "The Bukhara Embroidery School",
      ru: "Бухарская школа вышивки",
      uz: "Buxoro kashtachilik maktabi",
    },
    story: {
      en: "Bukharan girls were set down to embroider at five or six years old — rich and poor alike. The cloth was different — bo‘z and malla cotton for poorer households, half-silk adras and shoyi for wealthy ones, plus Russian factory fabric from the late 19th century — but the schooling, the motifs and the discipline were the same. Six families of motif return again and again: anorgul (pomegranate), safsargul (saffron-flower), bodom (almond), qalampir (chilli), sebarg (clover) and free leaf-clusters. The silk thread was hand-spun at home and coloured with plant and mineral dyes; the cloth carried the embroidery onto everything from wall hangings to do‘ppi caps, kovush slippers, mahsi boots, and the layers underneath the chapan.",
      ru: "Бухарских девочек сажали за вышивание в пять-шесть лет — одинаково и в богатых, и в бедных семьях. Ткань разнилась — бо‘з и малла (хлопок) у бедных, полушёлковый адрас и шёлк-шойи у богатых, плюс русская фабричная ткань с конца XIX века — но школа, мотивы и дисциплина были общими. Шесть семейств мотивов повторяются снова и снова: аноргуль (гранат), сафсаргуль (шафран), бодом (миндаль), калампир (перец), себарг (клевер) и свободные листья. Шёлковую нить пряли дома и красили растительными и минеральными красителями; ткань несла вышивку всюду — на настенные сюзане, на до‘ппи (тюбетейки), на ковуш (туфли), на махси (сапоги) и на нижние слои под чапан.",
      uz: "Buxorolik qizlarni besh-olti yoshda kashta tikishga o‘rgatishar edi — boy ham, kambag‘al ham birday. Mato har xil edi — bo‘z va malla (paxta) — kambag‘al xonadonlarda, yarim ipak adras va shoyi — badavlat oilalarda, XIX asr oxiridan rus fabrika matosi qo‘shilar edi — biroq maktab, naqshlar va tarbiya bir xil edi. Olti oilali naqsh takror-takror qaytadi: anorgul, safsargul, bodom, qalampir, sebarg va erkin barg-tutamlari. Ipak ip uyda qo‘lda yigirilar va o‘simlik hamda mineral bo‘yoqlar bilan bo‘yalar edi; mato kashtani hamma yoqqa olib borardi — devor so‘zanasidan tortib, do‘ppi, kovush, mahsi va chopon ostidagi qatlamlarga qadar.",
    },
  },
  {
    slug: "gijduvon-pottery",
    order: 30,
    featured: false,
    bg: "linear-gradient(155deg,#3c352a,#1f1c14 70%,#0e0c08)",
    shot: "[ Gʻijduvon · 6 ranglar · mineral sir ]",
    hallSlug: "kanizakxona",
    categorySlug: "ceramics",
    period: { en: "19th – 20th c.", ru: "XIX – XX вв.", uz: "XIX – XX asrlar" },
    material: {
      en: "Local clay, six-colour palette ground from natural minerals, transparent glaze fired at 1000 °C",
      ru: "Местная глина, шестицветная палитра из натуральных минералов, прозрачная глазурь, обжиг при 1000 °C",
      uz: "Mahalliy loy, tabiiy minerallardan tayyorlangan olti rangli palitra, shaffof sir, 1000 °C harorat",
    },
    tag: { en: "Gʻijduvon school", ru: "Гиждуванская школа", uz: "G‘ijduvon maktabi" },
    name: {
      en: "Gʻijduvon Pottery — the Darker Bukharan School",
      ru: "Гиждуванская керамика — тёмная бухарская школа",
      uz: "G‘ijduvon kulolchiligi — to‘qroq Buxoro maktabi",
    },
    story: {
      en: "Where Rishtan in the Ferghana valley turned its bowls bright turquoise and cobalt, Gʻijduvon — twenty miles north-east of Bukhara — went the other way. Its potters ground their pigments from natural minerals and held to a six-colour palette of olive, umber, deep red, dust-yellow, ivory and the iron-black that gives the school its character. Animals, fish and pomegranate halves run around the rim of each plate; the body is left in slip white to make the figures legible. A century later the school still works, and most «Bukhara ceramics» seen in tourist shops is in fact Gʻijduvon ware.",
      ru: "Если ферганский Риштан красил свою посуду яркой бирюзой и кобальтом, Гиждуван — в двадцати километрах к северо-востоку от Бухары — пошёл противоположным путём. Гончары растирали пигменты из натуральных минералов и держались шестицветной палитры: оливковый, умбра, тёмно-красный, пыльно-жёлтый, ивори и железно-чёрный — это и есть «гиждуванская характеристика». По краю каждой тарелки идут животные, рыбы и половинки гранатов; тело тарелки оставлено в белом ангобе, чтобы фигуры читались. Век спустя школа всё ещё работает, и большая часть «бухарской керамики» в туристических лавках — это на самом деле гиждуванская работа.",
      uz: "Farg‘onaning Rishtoni o‘z idishlarini yorqin turkuaz va kobalt rangiga bo‘yagani holda, Buxorodan shimoli-sharqda yigirma chaqirim narida joylashgan G‘ijduvon teskari yo‘l tutdi. Uning kulollari bo‘yoqlarni tabiiy minerallardan ezar va olti rangli palitraga — zaytun, umbra, to‘q qizil, chang sariq, fil suyagi va temirsimon qora — sodiq qolardi. Bu maktabning xarakteristikasi. Har bir laganning chetida hayvonlar, baliqlar, anor yarimliklari aylanadi; idish tanasi figuralar o‘qilsin uchun oq angob qatlamida qoldiriladi. Bir asr o‘tib maktab hanuz ishlab turibdi, va turistik do‘konlarda ko‘rgan «Buxoro sopolining» ko‘pi aslida G‘ijduvon ishidir.",
    },
  },
  {
    slug: "modern-suzani-revival",
    order: 31,
    featured: false,
    bg: "linear-gradient(155deg,#6d4337,#3b231c 70%,#1d100d)",
    shot: "[ Nurota · Shofirkon · zamonaviy chevarlar ]",
    hallSlug: "kanizakxona",
    categorySlug: "textiles",
    period: { en: "1990s – present", ru: "1990-е – настоящее время", uz: "1990-yillar – hozirgacha" },
    material: {
      en: "Hand-embroidered cotton ground, hand-spun silk thread, plant dyes including madder and pomegranate-skin",
      ru: "Ручная вышивка по хлопку, шёлковая нить ручной прядки, растительные красители (марена, кожура граната)",
      uz: "Paxta asosga qo‘lda kashta, qo‘l yigirilgan ipak ip, o‘simlik bo‘yoqlari (ro‘yan, anor po‘sti)",
    },
    tag: { en: "Living tradition", ru: "Живая традиция", uz: "Jonli an‘ana" },
    name: {
      en: "The Revival: Nurota and Shofirkon Today",
      ru: "Возрождение: Нурата и Шофиркан сегодня",
      uz: "Tiklanish: bugungi Nurota va Shofirkon",
    },
    story: {
      en: "After 1991 the embroidery schools that nearly closed in the late Soviet years began to teach again. In Nurota Iqbol Bozorova; in Shofirkon Muhabbat Qoʻchqorova, Oliya Nurullayeva and Zuhro Obloberdiyeva — these are the masters who carried the school across the gap. The cloth coming off their frames now is shown beside the 19th-century suzanis in this room, and the difference between a young apprentice’s work and a fifty-year master’s shows immediately. There is one Bukharan superstition the masters keep: every finished embroidery leaves a small element deliberately incomplete — only Allah can finish a thing perfectly.",
      ru: "После 1991 года школы вышивки, почти закрывшиеся в позднесоветские годы, снова начали учить. В Нурате — Икбол Базарова; в Шофиркане — Мухаббат Кучкорова, Олия Нуруллаева, Зухра Облобердиева — мастерицы, которые пронесли школу через провал. То, что сходит с их пялец сейчас, показано в этой комнате рядом с сюзане XIX века — и разница между работой молодой ученицы и пятидесятилетней мастерицы видна сразу. Одну бухарскую традицию мастерицы держат: на каждой готовой вышивке намеренно остаётся маленький недошитый элемент — только Аллах может довести вещь до конца.",
      uz: "1991-yildan keyin sovet davrining oxirida deyarli yopilgan kashtachilik maktablari yana o‘rgatishni boshladilar. Nurotada Iqbol Bozorova; Shofirkonda Muhabbat Qo‘chqorova, Oliya Nurullayeva va Zuhro Obloberdiyeva — maktabni uzilishdan olib o‘tgan ustalar. Hozir ularning kashta tomidan tushadigan mato shu xonada XIX asr suzanalari yonida ko‘rsatiladi — va yosh shogirdning ishi bilan ellik yillik ustaning ishi orasidagi farq darhol ko‘rinadi. Ustalar bitta buxoro an‘anasini saqlaydi: har bir tugagan kashtada kichik bir element ataylab tugatilmagan qoldiriladi — narsani mukammal yakunlay oladigan faqat Olloh.",
    },
  },
];

const STORY_PATCHES: { slug: string; locale: "en" | "ru" | "uz"; appendStory: string }[] = [
  {
    slug: "suzani-embroidery",
    locale: "en",
    appendStory:
      "\n\nThere is a religious-aesthetic rule the Bukharan embroiderers keep to this day: each finished piece leaves a single small element deliberately unfinished. Only Allah, the rule says, can carry a thing to true completion. Look closely at any suzani in the museum and the unfinished moment is there — a half-stem, an empty inner cell of a rosette, the missing leaf next to the cluster.",
  },
  {
    slug: "suzani-embroidery",
    locale: "ru",
    appendStory:
      "\n\nЕсть религиозно-эстетическое правило, которое бухарские вышивальщицы держат до сих пор: на каждой готовой работе остаётся один маленький элемент намеренно недошитым. Только Аллах, говорит правило, может довести вещь до настоящего завершения. Присмотритесь к любому сюзане в музее — недошитый момент там есть: полстебля, пустая внутренняя ячейка розетки, отсутствующий лист рядом с гроздью.",
  },
  {
    slug: "suzani-embroidery",
    locale: "uz",
    appendStory:
      "\n\nBuxorolik chevarlar bugun ham saqlab kelayotgan diniy-estetik qoidasi bor: har bir tugagan ishda bitta kichik element ataylab tugatilmagan qoldiriladi. Qoida: narsani haqiqiy yakunga olib kelishni faqat Olloh qila oladi. Muzeydagi har qanday suzanaga diqqat bilan qarang — tugatilmagan o‘sha lahza shu yerda: yarim poya, rozetkaning bo‘sh ichki katakchasi, gulchambar yonidagi yo‘q barg.",
  },
];

async function upsertHall(slug: string, number: number, name: Trans<string>) {
  const existing = await prisma.hall.findUnique({ where: { slug } });
  if (existing) return existing;
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
  if (existing) { console.log(`  ↺ skip: ${ex.slug}`); return; }
  await prisma.exhibit.create({
    data: {
      slug: ex.slug, order: ex.order, featured: ex.featured, bg: ex.bg, shot: ex.shot,
      period: ex.period.en, material: ex.material.en,
      hallId: hallIds.get(ex.hallSlug), categoryId: catIds.get(ex.categorySlug),
      translations: { create: LOCS.map((loc) => ({ locale: loc, name: ex.name[loc], tag: ex.tag[loc], story: ex.story[loc] })) },
    },
  });
  console.log(`  + ${ex.slug}`);
}

async function patchStories() {
  for (const p of STORY_PATCHES) {
    const ex = await prisma.exhibit.findUnique({ where: { slug: p.slug } });
    if (!ex) continue;
    const tr = await prisma.exhibitTranslation.findUnique({ where: { exhibitId_locale: { exhibitId: ex.id, locale: p.locale } } });
    if (!tr) continue;
    if (tr.story?.includes(p.appendStory.trim().slice(0, 50))) continue;
    await prisma.exhibitTranslation.update({ where: { exhibitId_locale: { exhibitId: ex.id, locale: p.locale } }, data: { story: (tr.story ?? "") + p.appendStory } });
    console.log(`  ✏ patched: ${p.slug} (${p.locale})`);
  }
}

async function main() {
  for (const h of HALLS) await upsertHall(h.slug, h.number, h.name);
  const hallIds = new Map<string, string>();
  for (const h of await prisma.hall.findMany()) hallIds.set(h.slug, h.id);
  const catIds = new Map<string, string>();
  for (const c of await prisma.category.findMany()) catIds.set(c.slug, c.id);
  for (const ex of EXHIBITS) await insertExhibitIfMissing(ex, hallIds, catIds);
  await patchStories();
  console.log("✓ dissertation seed v5 complete");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
