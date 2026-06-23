/// Additive seeder: brings in new halls, new exhibits, and updates the
/// stories of selected existing exhibits using primary-source content from
/// Roziqulova Sh.K. (master’s dissertation, K. Behzod NRDI, 2026).
///
/// Idempotent: re-running this script does not duplicate data.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };
const LOCS = ["en", "ru", "uz"] as const;

// ============ HALLS ============
const HALLS: { slug: string; number: number; name: Trans<string> }[] = [
  {
    slug: "banquet-hall",
    number: 6,
    name: {
      en: "Banquet Hall (Xonai Ovqat Xo‘ri)",
      ru: "Банкетный зал (Хонаи Овкат Хури)",
      uz: "Ziyofat zali (Xonai Ovqat Xo‘ri)",
    },
  },
  {
    slug: "mirzo-khona",
    number: 7,
    name: {
      en: "Mirzo-xona — the Chancellery",
      ru: "Мирзо-хона — канцелярия",
      uz: "Mirzo-xona — kanselyariya",
    },
  },
  {
    slug: "chess-room",
    number: 8,
    name: {
      en: "Shaxmat Zali — Chess Room",
      ru: "Шахмат-зали — Шахматный зал",
      uz: "Shaxmat zali",
    },
  },
  {
    slug: "tea-house",
    number: 9,
    name: {
      en: "Choyxona / Gulxona — Tea House",
      ru: "Чойхона / Гулхона — чайный зал",
      uz: "Choyxona / Gulxona",
    },
  },
];

const CATS: { slug: string; name: Trans<string> }[] = [
  { slug: "paintings", name: { en: "Paintings", ru: "Живопись", uz: "Tasviriy san'at" } },
  { slug: "interior", name: { en: "Interior fittings", ru: "Интерьер", uz: "Interer jihozlari" } },
  { slug: "horology", name: { en: "Clocks & Time", ru: "Часы и время", uz: "Soatlar va vaqt" } },
];

// ============ NEW EXHIBITS ============
type ExhibitSeed = {
  slug: string;
  order: number;
  featured: boolean;
  bg: string;
  shot: string;
  hallSlug: string;
  categorySlug: string;
  photos?: string[];
  period: Trans<string>;
  material: Trans<string>;
  tag: Trans<string>;
  name: Trans<string>;
  story: Trans<string>;
};

const EXHIBITS: ExhibitSeed[] = [
  {
    slug: "dutch-fireplace-bavarian-scene",
    order: 13,
    featured: false,
    bg: "linear-gradient(155deg,#6b3422,#3a1d15 70%,#1a0d09)",
    shot: "[ Olmoniya pech · Bavariya pivoxo‘rligi ]",
    hallSlug: "banquet-hall",
    categorySlug: "interior",
    period: { en: "Early 20th c., 1913", ru: "Начало XX в., 1913", uz: "XX asr boshi, 1913-yil" },
    material: {
      en: "Glazed ceramic tile, cast iron, painted figural scene",
      ru: "Глазурованная плитка, чугун, расписная фигуративная сцена",
      uz: "Sirlangan keramik kafel, cho‘yan, bo‘yalgan figurativ sahna",
    },
    tag: { en: "Banquet Hall", ru: "Банкетный зал", uz: "Ziyofat zali" },
    name: {
      en: "Dutch Fireplace with a Bavarian Beerhouse Scene",
      ru: "Голландская печь со сценой баварской пивной",
      uz: "Bavariya pivoxo‘rligi tasvirlangan «Golland» pechi",
    },
    story: {
      en: "Two tall fireplaces were set into the long walls of the Banquet Hall — fired and assembled in Germany, then shipped to Bukhara in pieces. Their tile colour was matched to the room’s decoration. On the upper panel of one of them a scene of a Bavarian beerhouse is painted in enamel — a small picture of European bourgeois pleasure dropped into a Bukharan palace. The fireplaces were never lit; they were a display of cosmopolitan reach.",
      ru: "В двух длинных стенах Банкетного зала установлены две высокие печи. Их обжигали и собирали в Германии, затем доставляли в Бухару в разобранном виде. Цвет кафеля подобран к убранству зала. На верхней панели одной из них эмалью изображена сценка баварской пивной — маленькая европейская картинка бюргерского досуга, спущенная во дворец бухарского эмира. Печи никогда не растапливали — они были демонстрацией космополитического размаха.",
      uz: "Ziyofat zalining ikki uzun devoriga ikkita baland pech o‘rnatilgan. Ular Olmoniyada quyilib, parcha-parcha qilib Buxoroga keltirilgan. Kafel rangi zal bezagiga moslab tanlangan. Ulardan birining yuqori paneliga emal bilan Bavariya pivoxo‘rligining sahnasi chizilgan — buxoro saroyiga tushib qolgan yevropa burjuasining kichik manzarasi. Pechlar hech qachon yoqilmagan — ular kosmopolit qudratning namoyishi edi.",
    },
  },
  {
    slug: "venetian-glass-refrigerator-cabinet",
    order: 14,
    featured: false,
    bg: "linear-gradient(155deg,#2f4d5c,#1a2e3a 70%,#0d1820)",
    shot: "[ Venetsiya oynasi · sovutgich javon ]",
    hallSlug: "banquet-hall",
    categorySlug: "glass",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Russian cabinetry, Venetian crystal glass panels, brass fittings",
      ru: "Российская столярная работа, панели венецианского хрусталя, латунная фурнитура",
      uz: "Rossiya mebelchiligi, Venetsiya billur paneli, jez aksessuarlar",
    },
    tag: { en: "Banquet Hall", ru: "Банкетный зал", uz: "Ziyofat zali" },
    name: {
      en: "Venetian-Glass Cooling Cabinet",
      ru: "Шкаф-холодильник с венецианским стеклом",
      uz: "Venetsiya oynali sovutgich-javon",
    },
    story: {
      en: "Built in Russia for the chilling of drinks at the Emir’s banquets, this cabinet has its long doors set with thick Murano crystal panels. Inside, fresh ice from the palace ice-house kept wines, sherbet and milk cold. The cabinet sat permanently in the Banquet Hall, framed by the imperial portraits above and the parquet floor below — a still-life of imported European service.",
      ru: "Изготовлен в России специально для охлаждения напитков на эмирских пиршествах. Длинные дверцы — толстые панели из венецианского муранского хрусталя. Внутрь укладывали лёд из дворцового ледника: он сохранял вина, шербет и молоко холодными. Шкаф постоянно стоял в Банкетном зале — натюрморт европейского сервиса в обрамлении портретов эмиров и паркета.",
      uz: "Amir ziyofatlarida ichimliklarni sovutish uchun Rossiyada yasalgan. Uzun eshiklari yo‘g‘on Venetsiya billuri bilan jihozlangan. Ichiga saroy muz omboridan muz solinar va sharob, sharbat hamda sutni sovuq holda saqlardi. Javon Ziyofat zalida doimiy o‘rnida turardi — yevropa servis san’atining naturmorti.",
    },
  },
  {
    slug: "emir-abdulahad-khan-portrait",
    order: 15,
    featured: false,
    bg: "linear-gradient(155deg,#3b2716,#1e140b 70%,#100a07)",
    shot: "[ Amir Abdulahadxon · portret ]",
    hallSlug: "banquet-hall",
    categorySlug: "paintings",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Oil on canvas, carved gilt wooden frame",
      ru: "Масло, холст, резная позолоченная рама",
      uz: "Yog‘li bo‘yoq, kanvas, o‘yilgan zarhal yog‘och ramka",
    },
    tag: { en: "Banquet Hall", ru: "Банкетный зал", uz: "Ziyofat zali" },
    name: {
      en: "Portrait of Emir Abdulahad-Khan",
      ru: "Портрет эмира Абдулахад-хана",
      uz: "Amir Abdulahadxon portreti",
    },
    story: {
      en: "Abdulahad Bahodir Khan (1885–1910) was the patron who turned a modest summer retreat into the full Sitorai Mohi Xosa — bringing in carved ayvans, the rose gardens, the marble lions at the entrance carved from Nurata stone. His portrait hangs in a richly carved gilt frame in the Banquet Hall above the Venetian-glass cabinet. Painted in oil during the last years of his reign, it is the closest the museum still keeps to the man whose taste shaped every corner of these rooms.",
      ru: "Абдулахад Бахадур-хан (1885–1910) — заказчик, превратившший скромную летнюю резиденцию в полноценный комплекс Ситораи Мохи Хоса: резные айваны, розарии, мраморные львы у входа, выточенные из нуратского камня. Его портрет висит в роскошно резной позолоченной раме в Банкетном зале над венецианским шкафом. Написан маслом в последние годы правления — это самое близкое, что музей сохранил от человека, чей вкус определил каждую деталь этих залов.",
      uz: "Abdulahad Bahodirxon (1885–1910) — oddiy yozgi qarorgohni to‘liq Sitorai Mohi Xosa majmuasiga aylantirgan amir: o‘yilgan ayvonlar, gulzorlar, Nurota marmaridan yo‘nilgan sher haykallari. Uning portreti Ziyofat zalida Venetsiya javoni tepasida boy o‘yilgan zarhal ramkada osig‘liq. Hukmronligining so‘nggi yillarida yog‘li bo‘yoq bilan chizilgan — bu xonalarning har bir burchagini shakllantirgan amirning saroyga eng yaqin xotirasidir.",
    },
  },
  {
    slug: "forty-maidens-trellage-mirror",
    order: 16,
    featured: true,
    bg: "linear-gradient(155deg,#384e6b,#1d2a3e 70%,#0e1521)",
    shot: "[ Qirq qiz oynasi · trelyaj ]",
    hallSlug: "mirzo-khona",
    categorySlug: "glass",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Russian-made trellage mirror; multi-panel quicksilver glass on walnut frame",
      ru: "Российский трюмо-трельяж; ртутное стекло в три створки на ореховой раме",
      uz: "Rossiya trelyaj oynasi; uch tabaqali simob oyna yong‘oq ramkada",
    },
    tag: { en: "Mirzo-xona", ru: "Мирзо-хона", uz: "Mirzo-xona" },
    name: {
      en: "“Forty Maidens” Trellage Mirror",
      ru: "Зеркало «Сорок дев»",
      uz: "«Qirq qiz oynasi»",
    },
    story: {
      en: "A three-panel Russian trellage mirror was set in the chancellery where the Emir’s scribes worked — its three quicksilver leaves returning twenty reflections to each side at once. Local storytellers gave it the name «Forty Maidens’ Mirror». One legend said that if you step inside the mirror and silently make three wishes, all three will be granted. Another whispered that anyone who stares without blinking grows younger by the minute. Both legends were tributes to the unnaturally clear and large glass — a thing of rumour as much as of furniture.",
      ru: "В канцелярии, где работали мирзы-писцы эмира, поставлено трёхстворчатое зеркало-трюмо российского производства. Три ртутных полотна возвращают по двадцать отражений с каждой стороны одновременно. В народе его прозвали «зеркалом сорока дев». Одна легенда говорит: войди в зеркало, загадай три желания молча — все сбудутся. Другая шепчет: тот, кто будет смотреть, не моргая, молодеет на глазах. Обе легенды — дань необыкновенной чистоте и размеру стекла, предмета слухов не меньше, чем мебели.",
      uz: "Amir mirzalari ish olib boradigan Mirzo-xonada Rossiyada yasalgan uch tabaqali trelyaj oyna o‘rnatilgan. Uning uchta simob varag‘i bir vaqtda yigirma aksni har tomonga qaytaradi. Mahalliy aholi uni «qirq qiz oynasi» deb atadi. Bir rivoyat: oyna ichiga kirib, jim turib uch tilak tilasangiz — uchchovi ham ushaladi. Boshqasi: kim ko‘zini ochib-yummasdan unga qarab tursa, har daqiqa yashargani sezilarmish. Ikkala rivoyat ham shisha noyob tinniqligi va kattaligiga bag‘ishlangan hurmat — mato bo‘lib, mish-mish ham bo‘lib.",
    },
  },
  {
    slug: "emirs-silver-calendar-book",
    order: 17,
    featured: false,
    bg: "linear-gradient(155deg,#4a4632,#27241a 70%,#15140e)",
    shot: "[ kumush taqvim · 1903–1912 ]",
    hallSlug: "chess-room",
    categorySlug: "metalwork",
    period: { en: "1902", ru: "1902 г.", uz: "1902-yil" },
    material: {
      en: "Engraved silver, gilt highlights, set engraved-stone tablet",
      ru: "Гравированное серебро, позолоченные акценты, вставная гравированная каменная плашка",
      uz: "O‘yilgan kumush, zarhal urg‘ular, gravür qilingan tosh varaqcha",
    },
    tag: { en: "Chess Room", ru: "Шахматный зал", uz: "Shaxmat zali" },
    name: {
      en: "The Emir’s Silver Calendar-Book",
      ru: "Серебряный календарь-книга эмира",
      uz: "Amirning kumush taqvim-kitobi",
    },
    story: {
      en: "Worked into the shape of a small leather-bound book and made entirely of silver, this calendar covers the nine years 1903–1912. A dome-shaped key turns and the years roll over; the months and days roll the same way. A thermometer is set into one face. A small engraved stone slab on the other side lets the user write a fresh note each day. The opening years tell us it was made in 1902, during the reign of Abdulahad-Khan — a piece of mechanical jewellery for keeping time, conversation and memory all at once.",
      ru: "Выполнен в виде маленькой книги в кожаном переплёте, но целиком из серебра. Календарь покрывает девять лет — с 1903 по 1912. Купольный ключик поворачиваешь — год меняется; так же сменяются месяцы и дни. В одну створку встроен термометр. На обратной стороне — гравированная каменная плашка для ежедневной короткой записи. По начальной дате понятно: сделан в 1902 году, при Абдулахад-хане. Механическое ювелирное изделие, в котором одновременно живут время, разговор и память.",
      uz: "Kichik teri muqovali kitob shaklida, lekin to‘liq kumushdan ishlangan. Taqvim 1903–1912-yillarni qamraydi. Qubba shaklidagi kalitchani burasangiz — yili o‘zgaradi; oylar va kunlar ham shu tarzda almashinadi. Bir betiga termometr o‘rnatilgan. Boshqa tomonida — har kuni qisqa yozuv qoldirish uchun tosh varaqcha. Yillarning boshlanishidan ma'lum: 1902-yilda, Abdulahadxon davrida yasalgan. Vaqt, suhbat va xotirani bir vaqtda saqlaydigan mexanik zargarlik buyumi.",
    },
  },
  {
    slug: "emirs-silver-oftoba",
    order: 18,
    featured: true,
    bg: "linear-gradient(155deg,#6a521e,#382b10 70%,#1b150a)",
    shot: "[ kumush oftoba · 48 brilliant ]",
    hallSlug: "chess-room",
    categorySlug: "metalwork",
    period: { en: "Early 20th c.", ru: "Начало XX в.", uz: "XX asr boshi" },
    material: {
      en: "Silver chased and gilt-washed, polychrome enamel, 48 brilliants",
      ru: "Серебро в технике кандакори, позолота, многоцветная эмаль, 48 бриллиантов",
      uz: "Kumush kandakorlik, oltin suvi, ko‘p rangli emal, 48 ta brilliant",
    },
    tag: { en: "Chess Room", ru: "Шахматный зал", uz: "Shaxmat zali" },
    name: {
      en: "The Emir’s Silver Oftoba",
      ru: "Серебряный офтоба эмира",
      uz: "Amirning kumush oftobasi",
    },
    story: {
      en: "An oftoba is the long-necked vessel used for the hand-washing ritual — by Islamic custom it is made of clay or copper. The Emir’s own oftoba breaks the rule: chased silver washed with gold, the surface tiled with coloured enamel, and on each side of the flattened belly a medallion set with 48 brilliants. It is a piece made for the Emir personally and for no one else — a private exception worked in private silver. The chased style is kandakori, the technique by which Bukharan silversmiths were once known across three empires.",
      ru: "Офтоба — кувшин с длинным горлом для ритуала омовения рук; по канонам ислама он должен быть глиняным или медным. Личный офтоба эмира нарушает правило: чеканное серебро, прокатанное по золоту, поверхность вымощена цветной эмалью, на каждой стороне плоского брюшка — медальон с 48 бриллиантами. Сделан лично для эмира и ни для кого больше — частное исключение в частном серебре. Техника чеканки — кандакори, благодаря которой бухарские серебряники прославились на три империи.",
      uz: "Oftoba — qo‘l yuvish marosimi uchun uzun bo‘yinli idish; shariatga ko‘ra u sopol yoki misdan bo‘lishi kerak. Amirning shaxsiy oftobasi qoidani buzadi: kandakorlikda ishlangan kumush, oltin suvi yugurtirilgan, yuzasi rangli emal bilan qoplangan, yassi qornining ikki tomonidagi medallarda 48 tadan brilliant terilgan. Amir uchun, faqat amir uchun yasalgan — kumushdagi shaxsiy istisno. Naqshlash uslubi — kandakori, buxorolik zargarlarni uch imperiyada tanitgan texnika.",
    },
  },
];

// ============ EXISTING EXHIBIT STORY UPDATES ============
// Adds the master / architect names from the dissertation.
const STORY_PATCHES: { slug: string; locale: "en" | "ru" | "uz"; appendStory: string }[] = [
  {
    slug: "the-throne",
    locale: "en",
    appendStory:
      "\n\nThe whole palace, including the Banquet Hall and this throne room, was built under master architect Mirzo Ustomiddin Sarkor. After the fall of the emirate in September 1920, the throne was left in place — and decades later, in 1937, the architect-restorer Vinogradov drew up the room sheet by sheet so the next generations could rebuild it if anything were lost.",
  },
  {
    slug: "the-throne",
    locale: "ru",
    appendStory:
      "\n\nВесь дворец, включая Банкетный зал и тронный, строил архитектор Мирзо Устомиддин Саркор. После падения эмирата в сентябре 1920 года трон остался на своём месте — а спустя десятилетия, в 1937 году, архитектор-реставратор Виноградов поставил зал на чертёж, лист за листом, чтобы будущим поколениям было с чего восстанавливать, если что-то будет утрачено.",
  },
  {
    slug: "the-throne",
    locale: "uz",
    appendStory:
      "\n\nButun saroy, jumladan, Ziyofat zali va taxt xonasini me'mor Mirzo Ustomiddin Sarkor qurgan. 1920-yil sentabrida amirlik qulagandan keyin taxt o‘z joyida qoldi — o‘nlab yillar o‘tib, 1937-yilda me'mor-restavrator Vinogradov xonani varaq-varaq qilib chizib chiqdi, toki bo‘lajak avlodlar yo‘qotilgan narsani tiklash uchun chizmaga ega bo‘lishsin.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "en",
    appendStory:
      "\n\nThe panel’s woodwork base was carved by the Bukharan masters Abdulla G‘afurov and Qori Cho‘bin — the same two hands that produced the figured ceiling and the wall panels of the Banquet Hall. Their style of guldor jimjimador carving runs through the whole palace like a signature.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "ru",
    appendStory:
      "\n\nДеревянная основа панели вырезана бухарскими мастерами Абдуллой Гафуровым и Кари Чубином — теми же двумя руками, что сделали фигурные потолки и стенные панели Банкетного зала. Их «гулдор-джимджимадор» резьба идёт сквозь весь дворец как подпись.",
  },
  {
    slug: "carved-ganch-panel",
    locale: "uz",
    appendStory:
      "\n\nPanelning yog‘och asosi buxorolik ustalar Abdulla G‘afurov va Qori Cho‘bin tomonidan o‘yilgan — Ziyofat zalining figurali shifti va devor panellarini ham aynan shu ikki qo‘l ishlagan. Ularning «guldor jimjimador» o‘ymakorligi butun saroy bo‘ylab imzodek o‘tadi.",
  },
  {
    slug: "venetian-mirror",
    locale: "en",
    appendStory:
      "\n\nUsto Shirin Muradov was a master of difficult biography. By legend he was once jailed for blasphemy in Abdulahad-Khan’s time, then sent to military service in Karmana, then pardoned and brought to court specifically to decorate the throne room. After completing the palace, he refused Sayyid Olim-Khan’s offer to escape to Afghanistan with him in 1920 — and lived to build a Bukhara hall in the Navoi Theatre in Tashkent in 1946–48, for which he received a State Prize.",
  },
  {
    slug: "venetian-mirror",
    locale: "ru",
    appendStory:
      "\n\nУ Усто Ширина Мурадова была непростая биография. По легенде, при Абдулахад-хане его обвинили в кощунстве и заточили в зиндан, затем отправили в кармановский гарнизон, и оттуда уже привели ко двору — специально, чтобы отделать тронный зал. После завершения работы во дворце в 1920 году он отказался бежать с Саидом Олим-ханом в Афганистан — и дожил до того, что в 1946–48 годах построил Бухарский зал в театре имени Навои в Ташкенте, за что получил Государственную премию.",
  },
  {
    slug: "venetian-mirror",
    locale: "uz",
    appendStory:
      "\n\nUsto Shirin Murodovning hayoti murakkab edi. Rivoyatlarga ko‘ra, Abdulahadxon davrida u shakkoklikda ayblanib zindonband qilingan, keyin Karmana sarbozligiga jo‘natilgan, ammo amir uni ozod qilib taxt zalini bezashga chaqirgan. Saroyni tugatgach, 1920-yilda Sayyid Olimxonning Afg‘onistonga birga qochish taklifini rad etdi — va shunday yashadiki, 1946–48-yillarda Toshkentdagi Navoiy nomidagi katta teatrda Buxoro zalini qurib, Davlat mukofotiga sazovor bo‘ldi.",
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

async function upsertCategory(slug: string, name: Trans<string>) {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.category.create({
    data: {
      slug,
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
  if (ex.photos?.length) {
    await prisma.exhibitImage.createMany({
      data: ex.photos.map((url, i) => ({
        exhibitId: created.id,
        url,
        alt: ex.name.en,
        order: i,
      })),
    });
  }
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
    // Don't double-append if already patched (idempotency check).
    if (tr.story?.includes(p.appendStory.trim().slice(0, 50))) continue;
    await prisma.exhibitTranslation.update({
      where: { exhibitId_locale: { exhibitId: ex.id, locale: p.locale } },
      data: { story: (tr.story ?? "") + p.appendStory },
    });
    console.log(`  ✏ patched story: ${p.slug} (${p.locale})`);
  }
}

async function main() {
  console.log("→ upserting halls");
  const hallIds = new Map<string, string>();
  for (const h of HALLS) {
    const row = await upsertHall(h.slug, h.number, h.name);
    hallIds.set(h.slug, row.id);
  }

  console.log("→ upserting categories");
  const catIds = new Map<string, string>();
  for (const c of CATS) {
    const row = await upsertCategory(c.slug, c.name);
    catIds.set(c.slug, row.id);
  }
  // Existing categories from the main seed are needed too — fetch all that the exhibits reference.
  const allCats = await prisma.category.findMany();
  for (const c of allCats) catIds.set(c.slug, c.id);

  console.log(`→ inserting ${EXHIBITS.length} new exhibits (skip if slug exists)`);
  for (const ex of EXHIBITS) {
    await insertExhibitIfMissing(ex, hallIds, catIds);
  }

  console.log(`→ patching existing exhibit stories with primary-source content`);
  await patchExistingStories();

  console.log("✓ dissertation seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
