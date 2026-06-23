/// Batch-6 additive seeder. Idempotent.
/// Adds the bedroom suite (Xonai Xob), the Italian ambassador's mirrors,
/// the recreated 19th-century Bukharan town-house interior, and expands the
/// porcelain story with the 200-250-sheep valuation and 500+ vases from the
/// confiscated Emir's estate.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };
const LOCS = ["en", "ru", "uz"] as const;

const HALLS = [
  {
    slug: "xonai-xob",
    number: 14,
    name: {
      en: "Xonai Xob — Bedroom Suite",
      ru: "Хонаи Хоб — спальня",
      uz: "Xonai Xob — yotoqxona",
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
    slug: "italian-ambassadors-mirrors",
    order: 26,
    featured: true,
    bg: "linear-gradient(155deg,#3b4a5e,#1f2a37 70%,#0f1620)",
    shot: "[ Venetsiya · Italiya qiroli elchisi sovgʻasi ]",
    hallSlug: "xonai-xob",
    categorySlug: "glass",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Venetian crystal mirror in carved walnut frame; mercury silvering",
      ru: "Венецианское хрустальное зеркало в резной ореховой раме; ртутное серебрение",
      uz: "Yong‘och ramkali Venetsiya billur oynasi; simob kumushlash",
    },
    tag: { en: "Bedroom Vestibule", ru: "Тамбур спальни", uz: "Yotoqxona dahlizi" },
    name: {
      en: "The Italian Ambassador’s Mirrors",
      ru: "Зеркала итальянского посла",
      uz: "Italiya qiroli elchisining oynalari",
    },
    story: {
      en: "Set into the vestibule of the bedroom, flanking the door, stand two Venetian crystal mirrors. They were brought to Bukhara not as merchandise but as a personal gift from the ambassador of the King of Italy on his official visit to the Emir. Diplomatic gifts of this scale — Murano-grade glass, set in carved walnut, mercury-silvered, taller than a man — were how nineteenth-century European courts confirmed that Bukhara still mattered to them.",
      ru: "В тамбуре спальни, по обе стороны двери, стоят два венецианских хрустальных зеркала. Они были привезены в Бухару не как товар, а как личный дар посла итальянского короля по случаю официального визита к эмиру. Дипломатические подарки такого масштаба — муранский хрусталь в резной ореховой раме, ртутное серебрение, ростом выше человека — были тем, чем европейские дворы XIX века подтверждали: Бухара по-прежнему важна для них.",
      uz: "Yotoqxona dahlizida, eshikning ikki tomonida ikkita Venetsiya billur oynasi turibdi. Ular Buxoroga tovar sifatida emas, balki Italiya qiroli elchisining amirga rasmiy tashrifidagi shaxsiy sovg‘asi sifatida keltirilgan. Bunday miqyosdagi diplomatik sovg‘alar — Murano sifatidagi shisha, o‘yilgan yong‘och ramkada, simobdan kumushlangan, odam bo‘yidan baland — XIX asr yevropa saroylari Buxoro hanuz ular uchun ahamiyatga ega ekanligini shu tarzda tasdiqlardi.",
    },
  },
  {
    slug: "xonai-xob-bedroom",
    order: 27,
    featured: false,
    bg: "linear-gradient(155deg,#4a3424,#291c12 70%,#140d08)",
    shot: "[ Xonai Xob · 6.5×6.5 m · holland uslub kamin ]",
    hallSlug: "xonai-xob",
    categorySlug: "interior",
    period: { en: "Early 20th c.", ru: "Начало XX в.", uz: "XX asr boshi" },
    material: {
      en: "Fired brick fireplace in the Dutch style, carved ganch ornament, walnut entrance door (two-leaf, carved), painted shirma divider",
      ru: "Обожжённый кирпич в голландском стиле, резной ганч, ореховая входная двустворчатая дверь, расписной ширма-разделитель",
      uz: "Pishiq g‘ishtdan holland uslubidagi pech, o‘yilgan ganch bezak, yong‘och ikki tabaqali kashtali eshik, bo‘yalgan shirma to‘sin",
    },
    tag: { en: "Bedroom", ru: "Спальня", uz: "Yotoqxona" },
    name: {
      en: "Xonai Xob — The Emir’s Bedroom",
      ru: "Хонаи Хоб — спальня эмира",
      uz: "Xonai Xob — amir yotoqxonasi",
    },
    story: {
      en: "Reached through a double-leaf carved walnut door from the vestibule, the bedroom is a square room, 6.5 × 6.5 metres. Its single decorative anchor is the Dutch-style fireplace built of fired brick and faced with carved ganch — a hybrid that no other Bukharan room produced. The palace was a summer residence, but the fireplace was lit on cold mornings in early spring and late autumn to take the chill off the stone walls. A painted shirma — a hinged Persian room-divider — separated the bedding from the rest of the space and held back the morning light.",
      ru: "В спальню ведёт двустворчатая резная ореховая дверь из тамбура. Это квадратная комната, 6,5 × 6,5 метра. Её единственный декоративный центр — голландский камин из обожжённого кирпича, облицованный резным ганчом, — гибрид, которого больше нет нигде в Бухаре. Дворец был летним, но камин растапливали холодными утрами ранней весной и поздней осенью, чтобы согреть каменные стены. Расписной ширма — раскладной персидский разделитель — отделял постель от остальной комнаты и сдерживал утренний свет.",
      uz: "Yotoqxonaga dahlizdan ikki tabaqali o‘yilgan yong‘och eshik orqali kiriladi. Bu kvadrat shaklidagi xona, 6,5 × 6,5 metr. Yagona bezak nuqtasi — pishiq g‘ishtdan tiklangan, o‘yilgan ganch bilan bezatilgan holland uslubidagi kamin — Buxoroda boshqa hech qaerda uchramaydigan duragay. Saroy yozgi edi, lekin erta bahor va kech kuzning sovuq tonglarida pech yoqilib, tosh devorlarni isitardi. Bo‘yalgan shirma — fors uslubidagi to‘sin — to‘shakni qolgan xonadan ajratib, tongning yorug‘ini ushlab turadi.",
    },
  },
  {
    slug: "xonai-xasht-19c-interior",
    order: 28,
    featured: false,
    bg: "linear-gradient(155deg,#5e3f24,#321f10 70%,#160c06)",
    shot: "[ XIX asr · Buxoro shahri uyi · beshik · sandal ]",
    hallSlug: "khonai-xasht-costume",
    categorySlug: "interior",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Recreated interior: ko‘rpa-to‘shak bedding, traditional household objects, cradle, sandal-heater, dutar and musical instruments",
      ru: "Реконструированный интерьер: курпа-тушак (постель), традиционная домашняя утварь, колыбель (бешик), сандал-обогреватель, дутар и музыкальные инструменты",
      uz: "Qayta tiklangan interyer: ko‘rpa-to‘shak, an’anaviy uy jihozlari, beshik, sandal, dutor va musiqa asboblari",
    },
    tag: { en: "Reconstructed interior", ru: "Реконструкция интерьера", uz: "Interyer rekonstruksiyasi" },
    name: {
      en: "A 19th-century Bukharan Town House",
      ru: "Интерьер бухарского городского дома XIX века",
      uz: "XIX asr Buxoro shahar uyi",
    },
    story: {
      en: "In one of the bedrooms of the Xonai Xasht pavilion, the museum has built a single full-room reconstruction of an ordinary 19th-century Bukharan town-dweller’s home. Folded ko‘rpa-to‘shak bedding leans against the wall. A carved walnut cradle sits in the corner; a sandal — the low table-heater that warms the family in winter, the whole household sitting around it under a single shared quilt — stands at the centre. Dutars, doiras and other instruments lean in their stand. The contrast with the Emir’s rooms next door is the point: visitors learn what daily life looked like outside the palace.",
      ru: "В одной из спальных комнат павильона Хонаи Хашт музей выстроил полную реконструкцию обычного дома бухарского горожанина XIX века. Сложенные у стены курпа-тушак (постель), резная ореховая колыбель в углу; в центре — сандал, низкий нагревательный столик, вокруг которого собиралась вся семья под одним общим одеялом зимой. Дутары, дойры и другие инструменты в подставке. Контраст с эмирскими покоями рядом — это и есть смысл: посетитель видит, как выглядела повседневная жизнь за стенами дворца.",
      uz: "Xonai Xasht pavilonining yotoqxonalaridan birida muzey XIX asr oddiy buxorolik shahar aholisining uyini to‘liq qayta tiklagan. Devor yoniga taxlangan ko‘rpa-to‘shak, burchakda o‘yilgan yong‘och beshik; markazda esa sandal — qishda butun oila bitta umumiy ko‘rpa ostida atrofiga to‘planadigan past isitgich-stol. Tagliklarda dutorlar, doiralar va boshqa asboblar. Yondagi amir xonalari bilan kontrast — ma'noli: tashrifchi saroy devorlari ortidagi kundalik turmushni ko‘radi.",
    },
  },
];

const STORY_PATCHES: { slug: string; locale: "en" | "ru" | "uz"; appendStory: string }[] = [
  {
    slug: "chinese-japanese-porcelain",
    locale: "en",
    appendStory:
      "\n\nA single Chinese vase of the 18th–19th centuries was valued at the price of two hundred and fifty sheep. When Sayyid Olim-Khan’s personal estate was confiscated after 1920, the inventory took down over five hundred such vases — alongside the celadon bowls of the 14th century, the Kulja dishes of the 16th, and the Kashgar plates of the 17th. The 1937–38 «Chinese Porcelain» exhibition, designed with P. A. Goncharova and L. I. Rempel and catalogued by the Uzbek Republican Art Museum, was the first time these were shown to the public as a systematic collection — and the first scientific catalogue of a Bukharan museum exhibition.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "ru",
    appendStory:
      "\n\nОдна китайская ваза XVIII–XIX веков ценилась как двести пятьдесят баранов. Когда после 1920 года конфисковали личное имущество Саида Олим-хана, в опись попали более пятисот таких ваз — рядом с селадоновыми чашами XIV века, кульджинскими блюдами XVI и кашгарскими тарелками XVII. Экспозиция «Китайский фарфор» 1937–38 годов, спроектированная П.А. Гончаровой и Л.И. Ремпелем и каталогизированная Республиканским художественным музеем Узбекистана, стала первым публичным показом коллекции как системного целого — и первым научным каталогом бухарской музейной экспозиции.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "uz",
    appendStory:
      "\n\nXVIII–XIX asrlardagi bitta xitoy vazasi ikki yuz ellik qo‘yning narxiga teng baholanardi. Sayyid Olimxonning shaxsiy mol-mulki 1920-yildan keyin musodara qilinganda, ro‘yxatga shunday vazalardan 500 dan ortig‘i — XIV asr seladon kosachalari, XVI asr Kulja taqlari va XVII asr Qashqar laganlarining yonida — kirgan. P.A. Goncharova va L.I. Rempel bilan loyihalashtirilgan va O‘zbekiston Respublika Badiiy muzeyi tomonidan katalog qilingan 1937–38-yillardagi «Xitoy chinnisi» ekspozitsiyasi bu to‘plamning omma uchun tizimli butun sifatida birinchi marta ko‘rsatilishi va Buxoro muzeyining birinchi ilmiy katalogi bo‘ldi.",
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
  console.log("✓ dissertation seed v4 complete");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
