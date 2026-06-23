/// Batch-3 additive seeder. Idempotent.
/// Adds 3 more halls, 5 more exhibits, and patches existing stories with
/// primary-source content from the dissertation:
///   Sh.K. Roziqulova, K. Behzod NRDI master’s dissertation, 2026.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };
const LOCS = ["en", "ru", "uz"] as const;

const HALLS: { slug: string; number: number; name: Trans<string> }[] = [
  {
    slug: "entrance-portal",
    number: 10,
    name: {
      en: "Entrance Portal — the Marble Lions",
      ru: "Парадный портал — мраморные львы",
      uz: "Marosim portali — marmar sherlar",
    },
  },
  {
    slug: "waiting-room",
    number: 11,
    name: {
      en: "Kutish Zali — the Waiting Hall",
      ru: "Кутиш-зали — зал ожидания",
      uz: "Kutish zali — qabulxona",
    },
  },
  {
    slug: "bath-room",
    number: 12,
    name: {
      en: "Vannaxona — the Bathroom Suite",
      ru: "Ванна-хона — банный покой",
      uz: "Vannaxona",
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
    slug: "nurata-marble-lions",
    order: 19,
    featured: true,
    bg: "linear-gradient(155deg,#c2b08a,#7a6c4d 70%,#3d3725)",
    shot: "[ marmar sherlar · Abdurahim Turdi · 1913 ]",
    hallSlug: "entrance-portal",
    categorySlug: "woodwork",
    period: { en: "1913", ru: "1913", uz: "1913-yil" },
    material: {
      en: "Carved Nurata marble, full-round sculpture",
      ru: "Резной нуратский мрамор, круглая скульптура",
      uz: "O‘yilgan Nurota marmari, yumaloq haykal",
    },
    tag: { en: "Entrance", ru: "Вход", uz: "Kiraverish" },
    name: {
      en: "The Marble Lions of Nurota",
      ru: "Мраморные львы из Нураты",
      uz: "Nurota marmar sherlari",
    },
    story: {
      en: "Above the half-domed canopy at the entrance, two lions face the visitor — carved in 1913 by the stone-master Abdurahim Turdi from a single block of Nurata marble each. Lions stood across the entire Bukharan emirate as the emblem of justice, fairness and power; here they double as the formal threshold between the dusty road from Samarkand and the rose gardens inside. Visitors are still photographed beside them today.",
      ru: "Над полусводчатым навесом у входа смотрят на гостя два льва — выточенные в 1913 году каменотёсом Абдурахимом Турди, каждый из цельной глыбы нуратского мрамора. Львы по всему Бухарскому эмирату служили эмблемой справедливости, правосудия и власти; здесь они одновременно — формальный порог между пыльной дорогой из Самарканда и розариями внутри. Гости и сегодня фотографируются рядом с ними.",
      uz: "Kiraverishdagi yarim gumbazli ayvon ustida ikkita sher mehmonni qarshilaydi — 1913-yilda sangtarosh usta Abdurahim Turdi tomonidan Nurota marmarining yagona bo‘lagidan har biri yo‘nib chiqarilgan. Sherlar butun Buxoro amirligi bo‘ylab odillik, adolat va qudrat ramzi edi; bu yerda ular bir vaqtning o‘zida Samarqand yo‘lining changidan ichkari gulzorlarga olib o‘tadigan rasmiy ostona vazifasini bajaradi. Mehmonlar bugun ham ular yonida suratga tushishadi.",
    },
  },
  {
    slug: "hasanjon-umarov-painted-ceiling",
    order: 20,
    featured: true,
    bg: "linear-gradient(155deg,#7a5832,#3f2c19 70%,#1a120a)",
    shot: "[ rangli naqsh · Hasanjon Umarov ]",
    hallSlug: "waiting-room",
    categorySlug: "woodwork",
    period: { en: "1912–1914", ru: "1912–1914", uz: "1912–1914-yillar" },
    material: {
      en: "Tempera on plaster with natural binders (egg yolk, camel milk, fruit-tree resin, plant pigments, gold dust); pistachio-and-almond varnish",
      ru: "Темпера по штукатурке на натуральных связующих (яичный желток, верблюжье молоко, абрикосово-персиковая смола, растительные пигменты, золотая пудра); лак из фисташки и миндаля",
      uz: "Suvog‘ ustiga tabiiy bog‘lovchi bilan tempera (tuxum sarig‘i, tuya suti, o‘rik-shaftoli yelimi, o‘simlik bo‘yoqlari, oltin chang); pista va bodom loki",
    },
    tag: { en: "Waiting Hall", ru: "Зал ожидания", uz: "Kutish zali" },
    name: {
      en: "Hasanjon Umarov’s Painted Waiting-Room",
      ru: "Расписной потолок Хасанджона Умарова",
      uz: "Hasanjon Umarov bezagan kutish zali",
    },
    story: {
      en: "Where Usto Shirin Muradov worked the White Hall in pure white ganch, master Hasanjon Umarov did the opposite next door — flooding the waiting room in colour. Vases of all sizes are painted into the walls: some run from floor to ceiling at four metres tall, others fit small alcoves and hold tulips and weeping-willow stems. The pigments are entirely his own — bound with egg yolk, camel milk and apricot-tree gum, brightened with plant dyes and gold dust, then sealed under a pistachio-and-almond varnish that has held the colour for over a century.",
      ru: "Там, где Усто Ширин Мурадов резал Белый зал в чистом белом ганче, в соседней комнате мастер Хасанджон Умаров сделал противоположное — залил Зал ожидания цветом. На стенах нарисованы вазы всех размеров: одни — четырёхметровые, от пола до потолка, другие умещаются в маленьких нишах и держат тюльпаны и плакучие ивовые ветви. Пигменты — собственноручные: связаны яичным желтком, верблюжьим молоком и абрикосово-камедной смолой, расцвечены растительными красителями и золотой пудрой, и запечатаны лаком из фисташки и миндаля, который держит цвет уже больше века.",
      uz: "Usto Shirin Murodov Oq Zalni sof oq ganchda ishlagan bo‘lsa, qo‘shni xonada usta Hasanjon Umarov teskari yo‘l tutdi — Kutish zalini ranglarga to‘ldirdi. Devorlarga turli o‘lchamdagi guldonlar chizilgan: ba’zilari pol-shipga teng to‘rt metr balandlikda, boshqalari kichik tokchalarga sig‘ib lola va majnuntol shoxlarini ushlab turadi. Bo‘yoqlar ustaning o‘zi tomonidan tayyorlangan — tuxum sarig‘i, tuya suti va o‘rik yelimi bilan bog‘langan, o‘simlik bo‘yoqlari va oltin chang bilan yorqinlashtirilgan, keyin pista va bodom lokida muhrlangan, bu lok yuz yildan beri rangni saqlab kelmoqda.",
    },
  },
  {
    slug: "bekker-swiss-clock",
    order: 21,
    featured: false,
    bg: "linear-gradient(155deg,#2a2620,#15120e 70%,#0a0907)",
    shot: "[ Bekker zavodi · qora tosh · soat ]",
    hallSlug: "chess-room",
    categorySlug: "horology",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Black hardstone case, gilt-brass dial, mechanical movement (Becker factory, Switzerland)",
      ru: "Чёрный камень, циферблат из золочёной латуни, механизм фабрики Беккера (Швейцария)",
      uz: "Qora tosh korpus, zarhal jez sifrablat, Bekker zavodi mexanizmi (Shveysariya)",
    },
    tag: { en: "Chess Room", ru: "Шахматный зал", uz: "Shaxmat zali" },
    name: {
      en: "Bekker Swiss Mantel Clock",
      ru: "Швейцарские каминные часы Беккера",
      uz: "Bekker zavodi Shveysariya soati",
    },
    story: {
      en: "Imported from the Bekker factory in Switzerland and set on the central niche of the Chess Room. The chess room — also called «Xonai Bozi», the play room — saw not just chess and billiard but evening musical receptions; in the next room dancers performed at dinner. The clock is wholly mechanical; the case is cut from a single block of black hardstone, the dial inlaid in gilt brass.",
      ru: "Привезены с фабрики Беккера в Швейцарии и поставлены в центральной нише Шахматного зала. Шахматный зал, он же «Хонаи бози» — «игровой» — видел не только шахматы и бильярд, но и вечерние музыкальные приёмы; в соседнем зале танцевали. Часы полностью механические, корпус выточен из цельной глыбы чёрного твёрдого камня, циферблат — золочёная латунь.",
      uz: "Shveysariyadagi Bekker zavodidan keltirilib, Shaxmat zalining markaziy tokchasiga o‘rnatilgan. Shaxmat zali — «Xonai Bozi», o‘yin xonasi — faqat shaxmat va bilyard emas, kechki musiqali qabullarni ham ko‘rgan; qo‘shni zalda raqqosalar raqsga tushishgan. Soat to‘liq mexanik, korpusi yagona qora qattiq tosh bo‘lagidan o‘yilgan, sifrablat zarhal jez bilan jihozlangan.",
    },
  },
  {
    slug: "banquet-corner-statuettes",
    order: 22,
    featured: false,
    bg: "linear-gradient(155deg,#4a4030,#262017 70%,#13110c)",
    shot: "[ Pyotr I · Yermak · Turk ovchisi ]",
    hallSlug: "banquet-hall",
    categorySlug: "interior",
    period: { en: "Late 19th – early 20th c.", ru: "Конец XIX – начало XX в.", uz: "XIX asr oxiri – XX asr boshi" },
    material: {
      en: "Cast and patinated bronze, cast iron and gilt details, hardwood plinths",
      ru: "Литая патинированная бронза, чугун и позолоченные детали, цоколи из твёрдого дерева",
      uz: "Quyma patinaga ishlangan bronza, cho‘yan va zarhal detallar, qattiq yog‘och tagliklar",
    },
    tag: { en: "Banquet Hall", ru: "Банкетный зал", uz: "Ziyofat zali" },
    name: {
      en: "Statuettes of Peter I, Yermak and the Turkish Hunter",
      ru: "Статуэтки «Пётр I», «Ермак» и «Турецкий охотник»",
      uz: "«Pyotr I», «Yermak» va «Turk ovchisi» haykalchalari",
    },
    story: {
      en: "On three of the four corners of the Banquet Hall, on purpose-cut plinths, three small bronze statues face inward: Peter the Great, the Cossack chieftain Yermak, and a Turkish hunter. The selection is not casual. The Emir entertained Russian envoys here; pairing the founder of Russian westernisation with a frontier Cossack and a Turkic figure flatters the entire spectrum of guests at the same dinner. Even the room’s sculpture was a piece of diplomacy.",
      ru: "В трёх из четырёх углов Банкетного зала на специально вырезанных постаментах стоят три бронзовые статуэтки лицом внутрь зала: Пётр Великий, казачий атаман Ермак и турецкий охотник. Подбор не случаен. Эмир принимал здесь русских послов; объединить основателя российской вестернизации с фронтирным казаком и тюркской фигурой — значит польстить всему спектру гостей за одним столом. Даже скульптура зала была дипломатией.",
      uz: "Ziyofat zalining to‘rt burchagidan uchtasida maxsus yo‘nilgan tagliklarda uchta bronza haykalcha zal ichkarisiga qarab turibdi: Pyotr Buyuk, kazak atamani Yermak va turk ovchisi. Tanlov tasodifiy emas. Amir bu yerda rus elchilarini qabul qilardi; Rossiya g‘arblanishining asoschisini chegara kazagi va turkiy obraz bilan birlashtirish — bitta dasturxon ortidagi barcha mehmonlar uchun maqtov edi. Hatto zal haykallari ham diplomatiya edi.",
    },
  },
  {
    slug: "russian-porcelain-bath",
    order: 23,
    featured: false,
    bg: "linear-gradient(155deg,#4c4a48,#272524 70%,#131211)",
    shot: "[ chinni vanna · qo‘l nasos · Olmoniya pechka ]",
    hallSlug: "bath-room",
    categorySlug: "interior",
    period: { en: "Early 20th c.", ru: "Начало XX в.", uz: "XX asr boshi" },
    material: {
      en: "Russian porcelain bath; brass hand-pump; coal-fired tiled mobile stove (Germany); Turkmen / Iranian pile carpets; silk prayer rug; Venetian crystal mirror (19th c.)",
      ru: "Фарфоровая ванна российского производства; латунный ручной насос; угольная переносная кафельная печь (Германия); ковры туркмен и иран; шёлковый молитвенный коврик; венецианское хрустальное зеркало (XIX в.)",
      uz: "Rossiya chinni vannasi; jez qo‘l nasos; ko‘mir bilan ishlaydigan ko‘chma kafel pech (Olmoniya); turkman va eron tukli gilamlari; ipak joynamoz; XIX asr Venetsiya billur oynasi",
    },
    tag: { en: "Bathroom", ru: "Ванная", uz: "Vannaxona" },
    name: {
      en: "The Emir’s Bathroom: Russian Porcelain, German Stove",
      ru: "Ванная эмира: русский фарфор, немецкая печь",
      uz: "Amir vannaxonasi: rus chinnisi, nemis pechi",
    },
    story: {
      en: "A narrow corridor leads from the western side of the palace to the bathroom suite. On the way: a coal-fired tiled portable stove made in Germany; on the wall a thick pile carpet from Turkmen and Iranian kolinbof masters and a silk prayer rug; and on the corridor’s end wall a tall 19th-century Venetian crystal mirror. The bath itself is a Russian-made porcelain tub; water arrives through a hand-pump that the bather operates personally; the next room holds a porcelain water-closet. A modern bathroom delivered in pieces from St Petersburg, Murano, Tabriz, Berlin, and assembled here.",
      ru: "Узкий коридор ведёт из западной части дворца в банный покой. По пути: угольная переносная кафельная печь, сделанная в Германии; на стене толстый ворсовый ковёр работы туркменских и иранских мастеров-«колинбоф» и шёлковый молитвенный коврик; в торце коридора — высокое венецианское хрустальное зеркало XIX века. Сама ванна — фарфоровая, российской работы; вода подаётся ручным насосом, которым купающийся пользуется сам; в соседней каморке — фарфоровый ватерклозет. Современный санузел, привезённый по частям из Петербурга, Мурано, Тебриза, Берлина — и собранный здесь.",
      uz: "Saroyning g‘arbiy qismidan tor dahliz vannaxonaga olib boradi. Yo‘l-yo‘lakay: Olmoniyada yasalgan ko‘mir bilan ishlaydigan ko‘chma kafel pech; devorga turkman va eron «kolinbof» ustalarining qalin tukli gilami va ipak joynamoz; dahliz so‘ngida XIX asr Venetsiya billur oynasi baland turibdi. Vannaning o‘zi — Rossiyada yasalgan chinni; suv chuvuv olib turuvchining o‘zi ishlatadigan qo‘l nasos orqali keladi; qo‘shni xonachada chinni hojatxona o‘rnatilgan. Sankt-Peterburg, Murano, Tabriz, Berlindan qism-qism keltirilib, shu yerda yig‘ilgan zamonaviy sanuzel.",
    },
  },
];

const STORY_PATCHES: { slug: string; locale: "en" | "ru" | "uz"; appendStory: string }[] = [
  {
    slug: "chinese-japanese-porcelain",
    locale: "en",
    appendStory:
      "\n\nThe Tea House (Choyxona) — also called Gulxona, the “flower room” — was lined with carved alcoves to take this porcelain. A single 18th- or 19th-century Chinese vase was valued at the price of two hundred and fifty sheep; the Emir Sayyid Olim-Khan’s confiscated estate, when finally inventoried, held more than five hundred such vases. A 14th-century celadon bowl, 16th-century Kulja and 17th-century Kashgar dishes, gilt Japanese vases — every shelf is a length of Silk-Road trade compressed into clay and glaze.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "ru",
    appendStory:
      "\n\nЧойхона — она же Гулхона, «комната цветов» — была обнесена резными нишами специально под этот фарфор. Одна китайская ваза XVIII–XIX веков стоила цены двухсот пятидесяти баранов; в конфискованном имуществе эмира Саида Олим-хана при описи нашли более пятисот таких ваз. Селадоновая чаша XIV века, кульджинские блюда XVI века, кашгарские XVII века, позолоченные японские вазы — каждая полка это шёлковая дорога, спрессованная в глину и глазурь.",
  },
  {
    slug: "chinese-japanese-porcelain",
    locale: "uz",
    appendStory:
      "\n\nChoyxona — Gulxona, «gullar xonasi» ham deyiladi — bu chinniga maxsus o‘yilgan tokchalar bilan jihozlangan edi. XVIII–XIX asr bitta xitoy vazasining narxi ikki yuz ellik qo‘yning narxiga teng edi; Amir Sayyid Olimxonning musodara qilingan mulkida ro‘yxatga olishda 500 dan ortiq shunday vaza bor edi. XIV asr seladon kosachasi, XVI asr Kulja taqlari, XVII asr Qashqar laganlari, zarhal yapon vazalar — har bir tokcha loy va sirga siqilgan Ipak yo‘lining bo‘lagidir.",
  },
];

const HALL_NEEDED = new Set([...HALLS.map((h) => h.slug), ...EXHIBITS.map((e) => e.hallSlug)]);

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
  const created = await prisma.exhibit.create({
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
  console.log("→ upserting halls (batch 3)");
  const hallIds = new Map<string, string>();
  for (const h of HALLS) {
    const row = await upsertHall(h.slug, h.number, h.name);
    hallIds.set(h.slug, row.id);
  }
  const allHalls = await prisma.hall.findMany();
  for (const h of allHalls) hallIds.set(h.slug, h.id);

  // Ensure every referenced hall exists.
  for (const slug of HALL_NEEDED) {
    if (!hallIds.has(slug)) {
      console.warn(`  ! hall slug not found in DB: ${slug} — exhibit will have no hall`);
    }
  }

  const catIds = new Map<string, string>();
  const allCats = await prisma.category.findMany();
  for (const c of allCats) catIds.set(c.slug, c.id);

  console.log(`→ inserting ${EXHIBITS.length} new exhibits (skip if slug exists)`);
  for (const ex of EXHIBITS) {
    await insertExhibitIfMissing(ex, hallIds, catIds);
  }

  console.log(`→ patching existing exhibit stories`);
  await patchExistingStories();

  console.log("✓ dissertation seed v2 complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
