import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

type Trans<T> = { en: T; ru: T; uz: T };

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
  /// Photo URLs (first becomes primary; renders over the gradient bg).
  photos?: string[];
  questions: QuestionSeed[];
};

type QuestionSeed = {
  type: "choice" | "text";
  order: number;
  correctIndex?: number;
  accept?: string[];
  q: Trans<string>;
  options?: Trans<string[]>;
  answerText?: Trans<string>;
  explain: Trans<string>;
};

const HALLS: { slug: string; number: number; name: Trans<string> }[] = [
  {
    slug: "khonai-khasht",
    number: 1,
    name: {
      en: "Khonai Khasht — Costume Hall",
      ru: "Хонаи Хашт — зал костюма",
      uz: "Xonai Xasht — kostyum zali",
    },
  },
  {
    slug: "reception-rooms",
    number: 2,
    name: {
      en: "Reception Rooms",
      ru: "Парадные залы",
      uz: "Qabul xonalari",
    },
  },
  {
    slug: "harem",
    number: 3,
    name: {
      en: "Harem Quarters",
      ru: "Гарем",
      uz: "Harem",
    },
  },
  {
    slug: "white-hall",
    number: 4,
    name: {
      en: "Oq Zal · White Hall",
      ru: "Ок-Зал · Белый зал",
      uz: "Oq Zal",
    },
  },
  {
    slug: "garden-pavilion",
    number: 5,
    name: {
      en: "Garden Pavilion",
      ru: "Садовый павильон",
      uz: "Bog' shiyponi",
    },
  },
];

const CATEGORIES: { slug: string; name: Trans<string> }[] = [
  { slug: "textiles", name: { en: "Textiles", ru: "Текстиль", uz: "To'qimachilik" } },
  { slug: "ceramics", name: { en: "Ceramics & Porcelain", ru: "Керамика и фарфор", uz: "Sopol va chinni" } },
  { slug: "woodwork", name: { en: "Woodwork & Gilt", ru: "Резьба и золочение", uz: "Yog'och va zarhal" } },
  { slug: "glass", name: { en: "Glass & Mirrors", ru: "Стекло и зеркала", uz: "Shisha va oynalar" } },
  { slug: "metalwork", name: { en: "Metalwork", ru: "Металл", uz: "Metall" } },
  { slug: "manuscripts", name: { en: "Manuscripts", ru: "Рукописи", uz: "Qo'lyozmalar" } },
  { slug: "jewelry", name: { en: "Jewelry", ru: "Ювелирные изделия", uz: "Zargarlik" } },
  { slug: "instruments", name: { en: "Instruments", ru: "Инструменты", uz: "Asboblar" } },
];

const EXHIBITS: ExhibitSeed[] = [
  {
    slug: "emirs-gold-chapan",
    order: 1,
    featured: true,
    bg: "linear-gradient(155deg,#7a1f24,#43121a 70%,#250b12)",
    shot: "[ robe · gold embroidery ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mahomed-Alim-Khan.jpg?width=900",
    ],
    hallSlug: "khonai-khasht",
    categorySlug: "textiles",
    period: {
      en: "Late 19th – early 20th c.",
      ru: "Конец XIX – начало XX в.",
      uz: "XIX asr oxiri – XX asr boshi",
    },
    material: {
      en: "Silk velvet, couched gold thread (zarduzi)",
      ru: "Шёлковый бархат, золотное шитьё (зардузи)",
      uz: "Ipak baxmal, oltin ip kashtasi (zarduzi)",
    },
    tag: { en: "Costume Hall", ru: "Зал костюма", uz: "Kostyum zali" },
    name: {
      en: "The Emir’s Gold Chapan",
      ru: "Золотой чапан эмира",
      uz: "Amirning oltin chopon",
    },
    story: {
      en: "Bukhara’s zarduzi masters couched real gold thread onto deep silk velvet, building dense arabesque so heavy it could stand on its own. This ceremonial chapan was worn by the Emir at court — cuffs and collar worked in the densest stitch, a quiet statement of an entire city’s craft.\n\nThe technique is older than the palace: zarduzi means “gold-work,” and the masters who practised it sat cross-legged for sixteen-hour days, anchoring each filament with a fine silk catch-stitch so the gold would never lie flat against the cloth. Light catches it differently from any angle — what looks like solid metal at noon turns into rivers of warm shadow by candlelight.\n\nThe garment carried weight in two senses. Physically, a fully finished court chapan could weigh nearly five kilograms; symbolically, each motif — pomegranates for fertility, almonds for protection, the eight-petalled rosette that recurs throughout the palace — was a vow the wearer made to the city behind him. A chapan like this was not bought. It was commissioned for a single ceremony and then folded away in a cedar trunk between sheets of waxed paper, brought out perhaps a dozen times in the Emir’s lifetime.\n\nAfter the fall of the emirate in 1920, most ceremonial chapans were broken up — the gold was scraped off and melted for currency. The handful that survived intact, this one among them, were saved by curators who hid them in the cellars of the palace before the inventory teams arrived.",
      ru: "Бухарские мастера зардузи прикрепляли настоящую золотую нить к глубокому шёлковому бархату, создавая плотный арабеск, способный держаться сам по себе. Этот церемониальный чапан эмир носил при дворе — манжеты и воротник прошиты самым плотным стежком: тихое заявление о ремесле целого города.\n\nТехника старше самого дворца: зардузи означает «работа с золотом», и мастера, владевшие ею, сидели скрестив ноги по шестнадцать часов в день, прихватывая каждую нить тончайшим шёлковым стежком — чтобы золото никогда не легло плашмя на ткань. Свет ловит его по-разному с любой точки: то, что в полдень кажется сплошным металлом, при свечах превращается в реки тёплой тени.\n\nОдеяние весило в двух смыслах. Физически полностью отделанный придворный чапан весил почти пять килограммов; символически — каждый мотив (гранат — плодородие, миндаль — защита, восьмилепестковая розетка, повторяющаяся по всему дворцу) был обетом, который носящий давал городу. Такой чапан не покупали. Его заказывали к одной церемонии, а потом откладывали в кедровый сундук между листами вощёной бумаги — за всю жизнь эмира его доставали, может быть, десяток раз.\n\nПосле падения эмирата в 1920 году большинство церемониальных чапанов были разобраны — золото соскоблено и переплавлено в валюту. Те немногие, что уцелели, в их числе этот, были спасены хранителями, которые спрятали их в подвалах дворца до прихода инвентаризационных команд.",
      uz: "Buxoroning zarduzi ustalari haqiqiy oltin ipni ipak baxmalga shu qadar zich qadab tikkanki, arabesk naqsh o'z-o'zicha turishi mumkin edi. Bu marosim choponini amir saroyda kiyardi — yenglari va yoqasi eng zich kashtada — butun bir shahar hunarining tinch bayoni.\n\nTexnika saroydan ham qadimiyroq: zarduzi «oltin ish» degani, va uni qo'llagan ustalar chalishti o'tirib o'n olti soatlab har bir ipni nozik ipak chok bilan mahkamlardi — toki oltin matoga tekis yotmasin. Yorug'lik unga har burchakdan boshqacha tushadi: tushda yaxlit metaldek ko'ringan narsa sham yorug'ida iliq soyalar daryosiga aylanadi.\n\nLibos ikki ma'noda og'ir edi. Jismonan to'liq tugallangan saroy choponi qariyb besh kilogramm tortardi; ramziy ma'noda har bir naqsh — anor (xosildorlik), bodom (himoya), saroy bo'ylab takrorlanadigan sakkiz bargli rozetka — kiyuvchining shaharga bergan qasamiyodi edi. Bunday choponni sotib olmasdi. Uni bitta marosim uchun buyurtma qilishar, keyin mumlangan qog'oz oraliqlariga solib kedr sandig'iga qo'yishardi — amirning butun umri davomida balki o'n marta chiqarilgan.\n\n1920-yilda amirlikning qulashidan keyin marosim choponlarining ko'pi parchalandi — oltin qirilib, valuta uchun eritildi. Eson-omon qolganlari, jumladan, bu chopon, inventarizatsiya guruhlari kelishidan oldin saroyning yerto'lalariga yashirgan qo'riqchilar tomonidan saqlab qolingan.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "How was the gold worked into the Emir’s chapan?",
          ru: "Как наносили золото на чапан эмира?",
          uz: "Amirning choponiga oltin qanday tushirilgan?",
        },
        options: {
          en: ["Couched gold embroidery (zarduzi)", "Woven as ikat", "Carved into ganch", "Painted on as gilt"],
          ru: ["Золотное шитьё зардузи", "Тканое как икат", "Резка по ганчу", "Покрытие сусальным золотом"],
          uz: ["Zarduzi oltin kashta", "Ikat to'qishi", "Ganchga o'yib ishlangan", "Oltinlash bilan bo'yalgan"],
        },
        explain: {
          en: "Zarduzi masters couch real metal-gold thread onto the surface of the cloth.",
          ru: "Мастера зардузи прикрепляют настоящую металлическую золотую нить к поверхности ткани.",
          uz: "Zarduzi ustalari haqiqiy oltin ipni mato yuzasiga qadaydi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["velvet", "бархат", "baxmal", "baxmali"],
        q: {
          en: "Its base cloth is a deep-pile silk — silk ___.",
          ru: "Основа — глубокий ворс шёлка — шёлковый ___.",
          uz: "Asosi — chuqur tukli ipak — ipak ___.",
        },
        answerText: { en: "velvet", ru: "бархат", uz: "baxmal" },
        explain: {
          en: "Only heavy silk velvet was strong enough to carry the weight of the gold.",
          ru: "Только плотный шёлковый бархат выдерживал вес золота.",
          uz: "Faqat og'ir ipak baxmal oltinning og'irligini ko'tara olardi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "Which room shows the palace costume collection?",
          ru: "В каком зале показана коллекция костюмов дворца?",
          uz: "Saroyning kostyum to'plamini qaysi xona namoyish etadi?",
        },
        options: {
          en: ["Khonai Khasht", "The White Hall", "The greenhouse", "The gatehouse"],
          ru: ["Хонаи Хашт", "Белый зал", "Оранжерея", "Привратницкая"],
          uz: ["Xonai Xasht", "Oq Zal", "Issiqxona", "Darvozaxona"],
        },
        explain: {
          en: "The Khonai Khasht parlour holds the 19th-century dress.",
          ru: "В парадной Хонаи Хашт хранятся одежды XIX века.",
          uz: "Xonai Xasht xonasida XIX asr kiyimlari saqlanadi.",
        },
      },
    ],
  },
  {
    slug: "chinese-japanese-porcelain",
    order: 2,
    featured: true,
    bg: "linear-gradient(155deg,#1d3a52,#13283c 70%,#0a1622)",
    shot: "[ porcelain vases · still life ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_porcelain_in_the_Topkapı_Palace_Museum,_Istanbul_(7).jpg?width=900",
    ],
    hallSlug: "reception-rooms",
    categorySlug: "ceramics",
    period: { en: "18th – 19th c.", ru: "XVIII – XIX вв.", uz: "XVIII – XIX asrlar" },
    material: {
      en: "Glazed porcelain",
      ru: "Глазурованный фарфор",
      uz: "Sirlangan chinni",
    },
    tag: { en: "Reception Rooms", ru: "Парадные залы", uz: "Qabul xonalari" },
    name: {
      en: "Chinese & Japanese Porcelain",
      ru: "Китайский и японский фарфор",
      uz: "Xitoy va yapon chinnisi",
    },
    story: {
      en: "The Emir collected far beyond his borders. Blue-and-white from Jingdezhen and famille-rose from Japan arrived along the same routes that once carried silk, set beside Venetian glass and Russian furniture — the palace as a meeting-room of three empires.\n\nMost of the porcelain came overland on the long northern route through the Tianshan passes and then west by camel through Kashgar and Samarkand. A single shipment could take fourteen months to reach Bukhara; brokers in Kashgar quoted the Emir’s house in Russian roubles, Chinese tael, and English sterling on the same invoice. Pieces were wrapped four times: in oiled paper, in raw cotton, in thin felt, and finally in a wooden crate caulked with pitch — and even then a tenth of every shipment arrived broken.\n\nThe pieces displayed here were chosen for the Reception Rooms because they spoke to visiting envoys without a word. A pair of Kangxi blue-and-white vases sat with a French Empire console and a samovar from Tula on a single carpet — an arranged conversation between trade partners. Visitors who recognised any one of the three felt at home, and that was the point.\n\nAfter 1920, when the palace became a museum, the porcelain stayed in place because no Soviet inventory team knew where else to put it. The rooms have barely changed.",
      ru: "Эмир собирал коллекцию далеко за пределами своих границ. Бело-голубой фарфор из Цзиндэчжэня и famille-rose из Японии приходили теми же маршрутами, что и шёлк, и стояли рядом с венецианским стеклом и русской мебелью — дворец как зал встречи трёх империй.\n\nБольшая часть фарфора шла сухопутным северным путём через перевалы Тянь-Шаня, потом на запад верблюдами через Кашгар и Самарканд. Одна партия могла идти до Бухары четырнадцать месяцев; кашгарские брокеры выставляли счёт эмирскому дому одновременно в русских рублях, китайских лянах и английских фунтах. Каждый предмет упаковывали четырежды: в промасленную бумагу, в сырой хлопок, в тонкий войлок и, наконец, в деревянный ящик, проконопаченный смолой, — и всё равно десятая часть каждого груза приходила разбитой.\n\nЭкспонаты, выставленные здесь, выбирали для Парадных залов потому, что они без слов говорили с приезжими послами. Пара ваз времён Канси (бело-голубых) стояла рядом с французской консолью эпохи ампир и тульским самоваром на одном ковре — устроенный разговор между торговыми партнёрами. Гость, узнававший хотя бы один из трёх предметов, чувствовал себя дома — и в этом был весь смысл.\n\nПосле 1920 года, когда дворец стал музеем, фарфор остался на месте — потому что советская инвентаризационная комиссия не знала, куда его ещё переставить. Залы с тех пор почти не менялись.",
      uz: "Amir o'z chegarasidan ancha uzoqda yig'ar edi. Tszindechjendan ko'k-oq, Yaponiyadan famille-rose ipak yuradigan yo'llardan kelar, Venetsiya shishasi va rus mebellari yonida turardi — saroy uchta imperiyaning uchrashuv xonasidek edi.\n\nChinnining ko'pi quruqlik bo'ylab Tyanshan dovonlari orqali, keyin Qashqar va Samarqand orqali tuyalarda g'arbga ketardi. Bir partiya Buxoroga o'n to'rt oygacha yetib kelardi; Qashqar dallolari amir xonadoniga hisobni rus rubli, xitoy lyani va ingliz funtida bir vaqtda chiqarardi. Har bir buyum to'rt qatlamga o'rab qadoqlanardi: moylangan qog'oz, xom paxta, ingichka kigiz va nihoyat smola bilan tovqlangan yog'och quti — shunda ham har partiyaning o'ndan biri singan holda yetib kelardi.\n\nBu yerda namoyish etilgan buyumlar Qabul xonalariga tashrif buyurgan elchilar bilan so'zsiz suhbatlashish uchun tanlangan. Kansi davriga oid bir juft ko'k-oq vaza fransuz ampir konsoli va Tula samovari bilan bir gilam ustida turardi — savdo sheriklari o'rtasidagi uyushgan suhbat. Uchtasidan birortasini taniydigan mehmon o'zini uyda sezar edi — gap ham shunda edi.\n\n1920-yildan keyin saroy muzeyga aylangach, chinni o'z joyida qoldi — chunki sovet ro'yxat komissiyasi uni qayerga ko'chirishni bilmasdi. Xonalar shu zamondan beri deyarli o'zgarmadi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "The Emir’s porcelain came mainly from…",
          ru: "Фарфор эмира поступал в основном из…",
          uz: "Amirning chinnisi asosan qayerdan kelgan?",
        },
        options: {
          en: ["China & Japan", "England", "Persia", "India"],
          ru: ["Китая и Японии", "Англии", "Персии", "Индии"],
          uz: ["Xitoy va Yaponiya", "Angliya", "Eron", "Hindiston"],
        },
        explain: {
          en: "Blue-and-white and famille-rose travelled the old Silk Road routes.",
          ru: "Бело-голубой и famille-rose путешествовали по древним маршрутам Шёлкового пути.",
          uz: "Ko'k-oq va famille-rose qadimgi Ipak yo'li bo'ylab kelar edi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["white", "белый", "белого", "oq"],
        q: {
          en: "The classic Chinese palette is blue-and-___.",
          ru: "Классическая китайская палитра — сине-___.",
          uz: "Xitoyning klassik palitrasi — ko'k-___.",
        },
        answerText: { en: "white", ru: "белый", uz: "oq" },
        explain: {
          en: "Cobalt blue under a clear glaze on white porcelain.",
          ru: "Кобальтовый синий под прозрачной глазурью на белом фарфоре.",
          uz: "Oq chinniga shaffof sir ostida kobalt-ko'k.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "In the palace these vases stood beside European…",
          ru: "Во дворце эти вазы стояли рядом с европейским…",
          uz: "Saroyda bu vazalar yevropalik nima yonida turgan?",
        },
        options: {
          en: ["Venetian glass", "Greek marble", "Egyptian stone", "Roman bronze"],
          ru: ["венецианским стеклом", "греческим мрамором", "египетским камнем", "римской бронзой"],
          uz: ["Venetsiya shishasi", "Yunon marmari", "Misr toshi", "Rim bronzasi"],
        },
        explain: {
          en: "East-Asian porcelain met Venetian glass and Russian furniture in one room.",
          ru: "Восточноазиатский фарфор встречался с венецианским стеклом и русской мебелью в одной комнате.",
          uz: "Sharqiy Osiyo chinnisi Venetsiya shishasi va rus mebeli bilan bir xonada turardi.",
        },
      },
    ],
  },
  {
    slug: "suzani-embroidery",
    order: 3,
    featured: true,
    bg: "linear-gradient(155deg,#1e5b4f,#12463c 70%,#0a2620)",
    shot: "[ suzani · silk floral ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Suzani_19th_century.jpg?width=900",
    ],
    hallSlug: "harem",
    categorySlug: "textiles",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Silk floss on cotton ground",
      ru: "Шёлковая нить на хлопковой основе",
      uz: "Paxta asosga ipak ip",
    },
    tag: { en: "Harem", ru: "Гарем", uz: "Harem" },
    name: { en: "Suzani Embroidery", ru: "Сюзане", uz: "Suzana" },
    story: {
      en: "Stitched by women for a bride’s dowry, the suzani blooms with rosettes, vines and — fittingly — stars and crescent moons. Each was begun by the mother and finished by many hands, a textile autobiography of the household.\n\nThe word suzan means “needle” in Persian, and the cloth carries the trace of every needle that touched it: the mother set out the design in chalk and ink on a cotton ground stretched between two trestles, then cut it into long panels for her daughters, sisters, aunts and neighbours to stitch separately. When the panels were finally reassembled, the seams ran through the centres of flowers — every join was a record of which hand had stitched which petal.\n\nThe great suzanis of the late nineteenth century were nuptial cloths: a young woman’s passport into her husband’s family. The size — typically two metres by two and a half — was set so the cloth could serve as a wall hanging at the wedding feast, a coverlet for the marital bed, and later a swaddling blanket for the first child. A woman’s reputation as a needleworker travelled ahead of her, and a poorly stitched suzani was a quiet humiliation no household forgot.\n\nThis piece is from the Nurata workshops, recognisable by the deep terracotta ground and the soft transitions in the silk floss — Nurata dyers boiled their threads three times in madder for that exact shade, then finished them with pomegranate-rind mordant. Two hundred years later the red is still alive.",
      ru: "Сюзане шили женщины в приданое невесте: розетки, лозы и — что особенно к месту — звёзды и полумесяцы. Начинала мать, заканчивали многие руки — текстильная автобиография дома.\n\nСлово сюзан по-персидски значит «игла», и ткань несёт след каждой иглы, что коснулась её: мать выкладывала рисунок мелом и чернилами на хлопковой основе, натянутой между двух козел, затем разрезала на длинные полотна — дочерям, сёстрам, тёткам и соседкам, чтобы шили по отдельности. Когда полотна потом снова сшивали, швы проходили через сердцевины цветов — каждый стык был записью, какая рука вышила какой лепесток.\n\nБольшие сюзане конца XIX века были свадебными тканями — паспортом молодой женщины в семью мужа. Размер — обычно два на два с половиной метра — выбирали так, чтобы ткань могла служить настенным полотнищем на свадебном пиру, покрывалом для брачной постели, а позже — пелёнкой для первого ребёнка. Слава мастерицы шла впереди невесты, и плохо сшитое сюзане было тихим унижением, которое дом не забывал.\n\nЭто полотно из мастерских Нураты — его узнают по глубокой терракотовой основе и мягким переходам в шёлковой нити: нуратинские красильщики варили нити в марене трижды, чтобы получить ровно этот оттенок, потом закрепляли гранатовой коркой. Двести лет спустя красный всё ещё живой.",
      uz: "Suzana qiz uchun ayollar tomonidan tikilardi: rozetkalar, novdalar va — bu joyga mos — yulduzlar bilan oy. Onasi boshlab, ko'p qo'l tugatardi — uyning to'qima avtobiografiyasi.\n\n«Suzan» so'zi forschada «igna» ma'nosini bildiradi, va matoga unga tegib o'tgan har bir ignaning izi qoladi: ona ikki taxta o'rtasiga tortilgan paxta asosga bo'r va siyoh bilan naqshni chizar, keyin uni uzun po'lakchalarga kesib qizlari, opa-singillari, xolalari va qo'shnilariga alohida tikib chiqishga berardi. Po'lakchalar qayta birlashtirilganda choklar gullarning markazidan o'tardi — har bir birlashma qaysi qo'l qaysi gulbargni tikkanining yozuvi edi.\n\nXIX asr oxirining ulkan suzanalari to'y matolari edi — yosh qizning eri xonadoniga pasporti. O'lcham — odatda ikki metrga ikki yarim metr — qilib belgilanardi: mato to'y ziyofatida devorga ilinadigan parda, nikoh to'shagining yopinchig'i, keyinroq esa birinchi farzandning yo'rgagi bo'lib xizmat qilishi mumkin edi. Tikuvchining shuhrati kelinning oldida yurar, yomon tikilgan suzana esa xonadon hech qachon unutmaydigan sokin sharmandalik edi.\n\nBu buyum Nurota ustaxonalaridan — chuqur teracotta asosi va ipak ipdagi yumshoq o'tishlardan tanilib turibdi: nurotalik bo'yoqchilar shu rangni olish uchun iplarni ro'yan bilan uch marta qaynatar, keyin anor po'sti bilan mahkamlardi. Ikki yuz yil o'tib ham qizil hanuz tirik.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "A suzani is made by…",
          ru: "Сюзане выполняется техникой…",
          uz: "Suzana qanday tayyorlanadi?",
        },
        options: {
          en: ["Hand embroidery", "Knotting pile", "Block printing", "Loom weaving"],
          ru: ["Ручной вышивки", "Узелкового ворса", "Набивки", "Тканья на станке"],
          uz: ["Qo'lda kashta", "Tuk to'qish", "Bosma naqsh", "To'qish dastgohi"],
        },
        explain: {
          en: "Suzani means “needle” — silk embroidered onto a cotton ground.",
          ru: "Сюзане означает «игла» — шёлк, вышитый по хлопку.",
          uz: "Suzana «igna» ma'nosini bildiradi — paxta ustiga ipakda kashta.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["dowry", "приданое", "приданого", "sep", "sepi"],
        q: {
          en: "Suzani were stitched for a bride’s ___ (her marriage gift of goods).",
          ru: "Сюзане шили в ___ невесты (её свадебный набор).",
          uz: "Suzana qizning ___ uchun tikilardi (uning to'y sovg'asi).",
        },
        answerText: { en: "dowry", ru: "приданое", uz: "sepi" },
        explain: {
          en: "Begun by the mother, finished by many hands, for the bride’s dowry.",
          ru: "Начинала мать, заканчивали многие руки — для приданого невесты.",
          uz: "Onasi boshlab, ko'p qo'l tugatardi — qizning sepi uchun.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "Which motif suits this “stars and moon” palace?",
          ru: "Какой мотив подходит дворцу «звёзд и луны»?",
          uz: "«Yulduzlar va oy» saroyiga qaysi naqsh mos?",
        },
        options: {
          en: ["Crescents & stars", "Portraits", "Maps", "Heraldry"],
          ru: ["Полумесяцы и звёзды", "Портреты", "Карты", "Геральдика"],
          uz: ["Yarim oy va yulduzlar", "Portretlar", "Xaritalar", "Gerblar"],
        },
        explain: {
          en: "Rosettes, vines and crescent moons bloom across the cloth.",
          ru: "Розетки, лозы и полумесяцы расцветают по полотну.",
          uz: "Rozetkalar, novdalar va yarim oylar matoda gullaydi.",
        },
      },
    ],
  },
  {
    slug: "the-throne",
    order: 4,
    featured: true,
    bg: "linear-gradient(155deg,#3a3322,#241f14 70%,#15120b)",
    shot: "[ throne · gilt & silk ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Harem%20of%20Sitorai%20Mokhi-Khosa%20Palace%2001.jpg?width=900",
    ],
    hallSlug: "white-hall",
    categorySlug: "woodwork",
    period: { en: "Early 20th c.", ru: "Начало XX в.", uz: "XX asr boshi" },
    material: {
      en: "Carved wood, gilt, silk",
      ru: "Резное дерево, позолота, шёлк",
      uz: "O'yilgan yog'och, zarhal, ipak",
    },
    tag: { en: "White Hall", ru: "Белый зал", uz: "Oq Zal" },
    name: { en: "The Throne", ru: "Трон", uz: "Taxt" },
    story: {
      en: "Set against the carved white ganch and its forty-fold mirrors, the throne anchored the ceremonial White Hall. Gilt catches the light from the chandeliers above and the mirror-work behind, so the seat seems to float in a room without edges.\n\nIt was made in 1913 by a workshop the Emir kept on the palace grounds — three master carvers, two gilders, a Russian upholsterer, and an apprentice whose name has been lost. The frame is walnut; the gold is leaf, not paint, beaten so thin a single sheet weighs less than a sparrow’s feather. The silk on the back panel was woven in Margilan and embroidered locally with the Emir’s tughra, a calligraphic cypher that takes about three weeks to stitch correctly.\n\nThe throne was used only on ceremonial days — receptions for foreign envoys, the announcement of major edicts, the annual oath of allegiance from the city guilds. The rest of the year it stood unused, covered in plain white linen against the dust, and the room was kept locked. Visiting children of palace staff would peer through the keyhole and report the white shape inside as a ghost.\n\nThe arms still show wear in two places — the right slightly deeper than the left — from the Emir resting his hands during the long oath-taking ceremonies. Nothing else in the palace has quite this trace of one person’s body.",
      ru: "На фоне резного белого ганча и зеркал, повторяющих отражение сорок раз, трон был центром Белого зала. Позолота ловит свет люстр сверху и зеркал сзади — трон будто парит в комнате без границ.\n\nЕго сделали в 1913 году в мастерской, которую эмир держал на территории дворца, — три мастера-резчика, два позолотчика, русский обивщик и подмастерье, имя которого не сохранилось. Каркас из ореха; золото — сусальное, не краска, отбитое так тонко, что один лист весит меньше пера воробья. Шёлк на спинке ткали в Маргилане и вышивали на месте тугрой эмира — каллиграфической монограммой, на правильную вышивку которой уходило около трёх недель.\n\nТрон использовали только в церемониальные дни: приёмы иностранных послов, объявление крупных указов, ежегодная присяга городских ремесленных цехов. Остальное время он стоял без дела, накрытый простым белым полотном от пыли, и комнату держали запертой. Дети дворцовой прислуги заглядывали в замочную скважину и рассказывали, что внутри стоит белая фигура — призрак.\n\nПодлокотники до сих пор стёрты в двух местах — правый чуть глубже левого — от того, что эмир опирался на них во время длинных церемоний присяги. Больше нигде во дворце нет такого следа одного тела.",
      uz: "O'yilgan oq ganch va qirq baravar takrorlanadigan oynalar fonida taxt — marosim Oq Zaliing markazi. Zarhal yuqoridagi qandil va orqadagi oynaning yorug'ligini ushlaydi, taxt chegarasiz xonada suzayotgandek.\n\nU 1913-yilda amir saroyi ichida tutgan ustaxonada yasalgan — uchta o'ymakor usta, ikkita zarhalchi, rus mato qoplovchisi va ismi yo'qolgan shogird. Karkas yong'oqdan; oltin — bo'yoq emas, yaproq, shu qadar yupqalanganki, bitta varaqning og'irligi chumchuq patidan ham yengil. Orqa panelidagi ipak Marg'ilonda to'qilgan va joyida amirning tug'rosi bilan kashtalangan — to'g'ri tikish uchun qariyb uch hafta talab qiladigan xattotlik monogrammasi.\n\nTaxtdan faqat marosim kunlarida foydalanishgan — chet ellik elchilarni qabul qilish, katta farmonlarni e'lon qilish, shahar hunarmandlar sexlarining yillik qasamiyodi. Qolgan vaqt u qo'llanilmasdi, changdan saqlash uchun oddiy oq mato bilan yopilgan, xona qulflanardi. Saroy xizmatchilarining bolalari qulfning teshigiga qarab, ichida oq shakl turibdi — arvoh, deyishardi.\n\nQo'lboshlari hanuz ikki joyda — o'ng tomon chap tomondan biroz chuqurroq — eyilib qolgan: bu uzoq qasamiyod marosimlarida amir qo'llarini qo'yganidan. Saroyda bir tananing izi shu qadar aniq qolgan boshqa joy yo'q.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "The throne stood in the…",
          ru: "Трон стоял в…",
          uz: "Taxt qayerda turgan?",
        },
        options: {
          en: ["White Hall (Oq Zal)", "Harem", "Greenhouse", "Tea house"],
          ru: ["Белом зале (Ок-Зал)", "Гареме", "Оранжерее", "Чайхане"],
          uz: ["Oq Zal", "Haremda", "Issiqxonada", "Choyxonada"],
        },
        explain: {
          en: "The ceremonial White Hall was the throne room.",
          ru: "Парадный Белый зал служил тронным залом.",
          uz: "Marosim Oq Zali — taxt xonasi edi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["ganch", "ganj", "gunch", "ганч", "g'anch"],
        q: {
          en: "Carved white ___ (alabaster plaster) covers the hall’s walls.",
          ru: "Стены зала покрывает резной белый ___ (алебастровая штукатурка).",
          uz: "Zalning devorlarini o'yilgan oq ___ (alebastr suvog'i) qoplaydi.",
        },
        answerText: { en: "ganch", ru: "ганч", uz: "ganch" },
        explain: {
          en: "Ganch — carved alabaster plaster — is the hall’s signature.",
          ru: "Ганч — резная алебастровая штукатурка — фирменный знак зала.",
          uz: "Ganch — o'yilgan alebastr suvog'i — zalning belgisidir.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "How many times can its mirrors repeat one reflection?",
          ru: "Сколько раз зеркала повторяют одно отражение?",
          uz: "Oynalar bir aksni necha marta takrorlay oladi?",
        },
        options: {
          en: ["Up to 40", "Twice", "Ten", "A thousand"],
          ru: ["До 40", "Дважды", "Десять", "Тысячу"],
          uz: ["40 martagacha", "Ikki marta", "O'n", "Ming"],
        },
        explain: {
          en: "Mirror set into the lattice multiplies a reflection up to forty times.",
          ru: "Зеркало в ганчевой решётке умножает отражение до сорока раз.",
          uz: "Ganch panjarasiga o'rnatilgan oyna aksni 40 martagacha takrorlaydi.",
        },
      },
    ],
  },
  {
    slug: "venetian-mirror",
    order: 5,
    featured: true,
    bg: "linear-gradient(155deg,#39414f,#232a36 70%,#141922)",
    shot: "[ mirror · carved frame ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sitori-i-Mokhi%20Khosa%20palace%20harem%201.JPG?width=900",
    ],
    hallSlug: "white-hall",
    categorySlug: "glass",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Mercury glass, gilded frame",
      ru: "Ртутное стекло, золочёная рама",
      uz: "Simob oyna, zarhal ramka",
    },
    tag: { en: "White Hall", ru: "Белый зал", uz: "Oq Zal" },
    name: {
      en: "Venetian Mirror",
      ru: "Венецианское зеркало",
      uz: "Venetsiya oynasi",
    },
    story: {
      en: "Mirrors arrived from Venice and Japan in fancy frames, then were set into the ganch lattice so a single candle multiplied across the walls. In the White Hall a visitor counted a reflection returned as many as forty times — the fairy-tale effect the masters were chasing.\n\nThe Venetian glass came from the Murano workshops of the Barovier family, packed in crates of seaweed and shipped first to Trieste, then by rail to Tiflis, then overland by ox-cart for the last six weeks. Eight pieces left Murano in 1908; six arrived in Bukhara in late 1909. The other two were broken somewhere in the Caucasus, and the loss was billed back to the shipper in writing that survives in the palace archive.\n\nUsto Shirin Muradov refused to use any frame for these mirrors. Instead he cut openings directly into the carved ganch and let the silver back of the glass sit flush with the plaster — so the room would seem to dissolve at the corners. From a certain spot at the centre of the floor, with the chandeliers lit and the ganch turning the candlelight into thin shadows, a guest could count their own reflection coming back from forty different angles before losing track.\n\nThe palace’s last imperial reception, in 1917, was lit by these mirrors. Six hundred candles, no electricity. The Emir’s photographer, Prokudin-Gorsky, said afterwards that he had never seen a room so full of light from so few sources.",
      ru: "Зеркала прибывали из Венеции и Японии в изящных рамах и встраивались в ганчевую решётку, превращая одну свечу в множество отражений на стенах. В Белом зале посетитель насчитывал до сорока возвращений своего отражения — мастера гнались за сказочным эффектом.\n\nВенецианское стекло шло из мастерских Мурано — из дома Барбариго-Барбьери, упакованным в ящики с морскими водорослями, сначала в Триест, потом по железной дороге в Тифлис, и последние шесть недель — на воловьих повозках через горы. Из Мурано в 1908 году отправили восемь предметов; шесть пришли в Бухару в конце 1909-го. Два других разбили где-то на Кавказе, и убыток был выставлен перевозчику в письме, сохранившемся в дворцовом архиве.\n\nУсто Ширин Мурадов отказался ставить эти зеркала в рамы. Вместо этого он вырезал прорези прямо в резном ганче и посадил серебряную тыльную сторону стекла вровень со штукатуркой — чтобы комната словно растворялась по углам. С определённой точки в центре зала, при зажжённых люстрах и ганче, превращающем свет свечей в тонкие тени, гость насчитывал до сорока возвращений собственного отражения, прежде чем терял счёт.\n\nПоследний имперский приём во дворце, в 1917 году, освещали именно эти зеркала. Шестьсот свечей, без электричества. Фотограф эмира, Прокудин-Горский, потом говорил, что никогда не видел комнаты, в которой столько света исходило бы из такого малого числа источников.",
      uz: "Oynalar Venetsiya va Yaponiyadan chiroyli ramkalarda kelar, ganch panjarasiga o'rnatilar va bir sham yorug'ligini devorlarda ko'paytirar edi. Oq Zalda ziyoratchi aksni qirq martagacha qaytishini sanardi — ustalar ertaknamo samarani izlashardi.\n\nVenetsiya shishasi Muranoning ustaxonalaridan — Barovier xonadonidan — keldi: dengiz o'tlari solingan qutilarga qadoqlanib, avval Triestaga, keyin temir yo'l bilan Tiflisga, oxirgi olti hafta esa tog'lar bo'ylab ho'kiz arabalarida. Muranodan 1908-yilda sakkizta buyum jo'natildi; Buxoroga 1909-yilning oxirida oltitasi yetib keldi. Boshqa ikkitasi Kavkazning bir yerida sindi va zarar saroy arxivida saqlanib qolgan xat orqali ortga yo'nalganda ko'rsatildi.\n\nUsto Shirin Muradov bu oynalar uchun hech qanday ramka qo'yishni rad etdi. Buning o'rniga u o'yilgan ganchga to'g'ridan-to'g'ri teshiklar qildi va shishaning kumush orqa tomonini suvog'ga teng o'rnatdi — toki xona burchaklarda eriyaotgandek bo'lsin. Polning o'rtasidagi ma'lum bir nuqtadan qandillar yoqilganda va ganch sham yorug'ini ingichka soyalarga aylantirganda, mehmon o'z aksini qirq xil burchakdan qaytib kelganini hisoblar, keyin sanog'i adashar edi.\n\nSaroydagi oxirgi imperatorlik qabuli 1917-yilda mana shu oynalar bilan yoritildi. Olti yuz sham, elektr yo'q. Amirning fotografi Prokudin-Gorskiy keyin: «Men hech qachon shuncha oz manbadan shuncha yorug' bo'lgan xonani ko'rmaganman», degan edi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "The palace mirrors were imported from Venice and…",
          ru: "Зеркала дворца ввозили из Венеции и…",
          uz: "Saroy oynalari Venetsiya va qayerdan keltirilgan?",
        },
        options: {
          en: ["Japan", "Egypt", "Brazil", "Korea"],
          ru: ["Японии", "Египта", "Бразилии", "Кореи"],
          uz: ["Yaponiya", "Misr", "Braziliya", "Koreya"],
        },
        explain: {
          en: "Venetian and Japanese mirrors were set into fancy frames.",
          ru: "Венецианские и японские зеркала вставлялись в изящные рамы.",
          uz: "Venetsiya va yapon oynalari chiroyli ramkalarga o'rnatilardi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["shirin", "usto shirin", "ширин", "усто ширин"],
        q: {
          en: "Master ___ Muradov led the White Hall’s decoration.",
          ru: "Мастер ___ Мурадов руководил отделкой Белого зала.",
          uz: "Usta ___ Muradov Oq Zal bezagiga rahbarlik qilgan.",
        },
        answerText: { en: "Shirin", ru: "Ширин", uz: "Shirin" },
        explain: {
          en: "Usto Shirin Muradov directed the carving and mirror-work.",
          ru: "Усто Ширин Мурадов руководил резьбой и зеркальной работой.",
          uz: "Usto Shirin Muradov o'yma va oyna ishlariga rahbarlik qilgan.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "Mirror set into ganch could multiply the light of a single…",
          ru: "Зеркало в ганчевой решётке могло умножить свет одной…",
          uz: "Ganchga o'rnatilgan oyna qaysi yorug'likni ko'paytira olardi?",
        },
        options: {
          en: ["Candle", "Window", "Street lamp", "Bonfire"],
          ru: ["свечи", "окна", "уличного фонаря", "костра"],
          uz: ["Sham", "Deraza", "Ko'cha chiroq", "Gulxan"],
        },
        explain: {
          en: "One candle, multiplied across the walls, lit the room like a dream.",
          ru: "Одна свеча, умноженная по стенам, освещала комнату как сон.",
          uz: "Bir sham, devorlarda ko'paygan, xonani tushdek yoritardi.",
        },
      },
    ],
  },
  {
    slug: "peacock-of-the-gardens",
    order: 6,
    featured: false,
    bg: "linear-gradient(155deg,#0f5a4e,#1a3e36 70%,#0a2620)",
    shot: "[ peacock · enamel pin ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pavo_cristatus_in_Tierpark_Friedrichsfelde_2014.jpg?width=900",
    ],
    hallSlug: "garden-pavilion",
    categorySlug: "jewelry",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Silver, cloisonné enamel, garnet eyes",
      ru: "Серебро, перегородчатая эмаль, гранатовые глаза",
      uz: "Kumush, kloisonne emal, granat ko'zlar",
    },
    tag: { en: "Garden Pavilion", ru: "Садовый павильон", uz: "Bog' shiyponi" },
    name: {
      en: "Peacock of the Gardens",
      ru: "Павлин из садов",
      uz: "Bog' tovusi",
    },
    story: {
      en: "Peacocks still cross the rose gardens — this small enamel brooch keeps the bird inside the house. Cloisonné cells trap turquoise and lapis blues against silver, the tail unfurled in a fan no wider than a palm.",
      ru: "Павлины и сейчас гуляют по розариям — эта маленькая эмалевая брошь хранит птицу в стенах дома. Перегородки удерживают бирюзу и лазурь на серебре, хвост раскрыт веером не шире ладони.",
      uz: "Tovuslar bog'larni hanuz kezadi — bu kichik emal yoqaga gul qush bilan birga uyga kiradi. Kumush ustida kloisonne katakchalari turkuaz va lazurit ranglarni ushlaydi, dum kaft kengligiga teng yelpig'ichday ochilgan.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "Which technique builds the brooch’s coloured cells?",
          ru: "Какой техникой набраны цветные ячейки броши?",
          uz: "Yoqaning rangli katakchalari qaysi texnika bilan terilgan?",
        },
        options: {
          en: ["Cloisonné enamel", "Niello", "Filigree", "Granulation"],
          ru: ["Перегородчатая эмаль", "Чернение", "Скань", "Зернь"],
          uz: ["Kloisonne emal", "Qoraytirish", "Filigran", "Granulyatsiya"],
        },
        explain: {
          en: "Cloisonné sets wire cells filled with coloured glass enamel.",
          ru: "Перегородчатая эмаль — проволочные ячейки, заполненные цветным стекловидным эмалем.",
          uz: "Kloisonne — rangli shisha emal bilan to'ldirilgan sim katakchalar.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["silver", "серебро", "kumush"],
        q: {
          en: "The brooch’s body is forged in ___.",
          ru: "Корпус броши выкован из ___.",
          uz: "Yoqa tanasi ___ dan kovlangan.",
        },
        answerText: { en: "silver", ru: "серебро", uz: "kumush" },
        explain: {
          en: "Silver gives the enamel its bright contrast.",
          ru: "Серебро даёт эмали яркий контраст.",
          uz: "Kumush emalga yorqin kontrast beradi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "Which bird, kept in the palace gardens, inspired the piece?",
          ru: "Какая птица, живущая в дворцовых садах, вдохновила вещь?",
          uz: "Saroy bog'larida yashaydigan qaysi qush bu buyumga ilhom bo'lgan?",
        },
        options: {
          en: ["Peacock", "Crane", "Falcon", "Hoopoe"],
          ru: ["Павлин", "Журавль", "Сокол", "Удод"],
          uz: ["Tovus", "Turna", "Lochin", "Hudhud"],
        },
        explain: {
          en: "Peacocks still walk the palace rose gardens.",
          ru: "Павлины и сегодня прогуливаются по розариям дворца.",
          uz: "Tovuslar saroyning gulzorlarida hozir ham yuradi.",
        },
      },
    ],
  },
  {
    slug: "ikat-coat-of-the-court",
    order: 7,
    featured: false,
    bg: "linear-gradient(155deg,#6a2d56,#3b1830 70%,#1c0c18)",
    shot: "[ ikat · adras silk ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ikat_central_asian.jpg?width=900",
    ],
    hallSlug: "khonai-khasht",
    categorySlug: "textiles",
    period: { en: "Mid 19th c.", ru: "Середина XIX в.", uz: "XIX asr o'rtasi" },
    material: {
      en: "Adras (silk-cotton ikat), bound-resist dyed",
      ru: "Адрас (шёлково-хлопковый икат), резерваж",
      uz: "Adras (ipak-paxta ikat), bog'lab-bo'yash",
    },
    tag: { en: "Court Costume", ru: "Придворный костюм", uz: "Saroy kostyumi" },
    name: { en: "Ikat Coat of the Court", ru: "Икатный халат двора", uz: "Saroy ikat to'ni" },
    story: {
      en: "Before the cloth is even woven, the warp is tied off in patches and dipped — the pattern is dyed into the threads themselves. The result is the soft-edged thunder of Central Asian ikat: lightning, almonds, and combs you can read like a calendar of the road.",
      ru: "Узор «заваривают» в нитях ещё до ткачества: основу перевязывают и окунают. Получается смягчённая молния среднеазиатского иката — молнии, миндалины и гребни, которые читаются как календарь дорог.",
      uz: "Mato to'qilmasdan oldin asos iplari joy-joyiga bog'lanib bo'yaladi — naqsh iplarning o'ziga singdiriladi. Natija — O'rta Osiyo ikatining yumshoq qirrali momaqaldirog'i: chaqmoq, bodom va taroq — yo'l taqvimidek o'qiladi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "Ikat dyes the pattern into the…",
          ru: "В икате узор красят в…",
          uz: "Ikatda naqsh nimaga bo'yaladi?",
        },
        options: {
          en: ["Threads before weaving", "Cloth after weaving", "A printed block", "An embroidered top layer"],
          ru: ["Нити до ткачества", "Ткань после ткачества", "Печатный блок", "Вышитый верхний слой"],
          uz: ["To'qishdan oldin iplarga", "To'qilgan matoga", "Bosma blokga", "Tikilgan yuqori qatlamga"],
        },
        explain: {
          en: "Warp threads are bound and dipped — the cloth shows the pattern when woven.",
          ru: "Основа перевязывается и окунается — узор проявляется уже при ткачестве.",
          uz: "Asos iplari bog'lanadi va bo'yaladi — naqsh to'qish vaqtida ochiladi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["adras", "адрас"],
        q: {
          en: "The silk-cotton ikat cloth used here is called ___.",
          ru: "Шёлково-хлопковый икат здесь называют ___.",
          uz: "Bu yerda foydalanilgan ipak-paxta ikat ___ deyiladi.",
        },
        answerText: { en: "adras", ru: "адрас", uz: "adras" },
        explain: {
          en: "Adras blends silk warp and cotton weft for shimmer and weight.",
          ru: "Адрас сочетает шёлковую основу и хлопковый уток — для блеска и веса.",
          uz: "Adras ipak asos va paxta arqoqni birlashtiradi — yaltirash va og'irlik uchun.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "A characteristic ikat motif is the…",
          ru: "Характерный мотив иката —",
          uz: "Ikatning xarakterli naqshi —",
        },
        options: {
          en: ["Almond / boteh", "Latin cross", "Heraldic lion", "Greek key"],
          ru: ["миндаль / боте", "латинский крест", "геральдический лев", "греческий меандр"],
          uz: ["bodom / bota", "lotin xochi", "gerb sheri", "yunon meandri"],
        },
        explain: {
          en: "The almond / boteh is a recurring ikat shape across the region.",
          ru: "Миндалевидный мотив (боте) встречается в икате повсеместно.",
          uz: "Bodom / bota shakli ikatda hududda keng tarqalgan.",
        },
      },
    ],
  },
  {
    slug: "samarkand-paper-quran",
    order: 8,
    featured: false,
    bg: "linear-gradient(155deg,#5a4423,#2e2210 70%,#1a130a)",
    shot: "[ manuscript · gold-illuminated leaf ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Quran-illumination.jpg?width=900",
    ],
    hallSlug: "reception-rooms",
    categorySlug: "manuscripts",
    period: { en: "18th c.", ru: "XVIII в.", uz: "XVIII asr" },
    material: {
      en: "Samarkand silk paper, ink, gold leaf",
      ru: "Самаркандская шёлковая бумага, чернила, сусальное золото",
      uz: "Samarqand ipak qog'ozi, siyoh, oltin yaproq",
    },
    tag: { en: "Library", ru: "Библиотека", uz: "Kutubxona" },
    name: { en: "Illuminated Qur’an", ru: "Иллюминированный Коран", uz: "Bezatilgan Qur'on" },
    story: {
      en: "Bukhara’s library shelves once held copies of the Qur’an on Samarkand silk paper — pages thin enough to see the lamp through, edged with gold so fine the script seems to sit on light.",
      ru: "На полках бухарской библиотеки лежали Кораны на самаркандской шёлковой бумаге — листы такие тонкие, что сквозь них видно лампу, с золотыми каймами, в которых буквы будто плавают по свету.",
      uz: "Buxoro kutubxonasi javonlarida bir vaqtlar Samarqand ipak qog'ozidagi Qur'on nusxalari turardi — choq orqali chiroq ko'rinardigan ingichka varaqlar, juda nozik oltin chekka — yozuv yorug'lik ustida turganday.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "What paper carries the manuscript?",
          ru: "На какой бумаге написан манускрипт?",
          uz: "Qo'lyozma qaysi qog'ozda yozilgan?",
        },
        options: {
          en: ["Samarkand silk paper", "Egyptian papyrus", "European wove", "Chinese rice paper"],
          ru: ["Самаркандская шёлковая бумага", "Египетский папирус", "Европейская веленевая", "Китайская рисовая"],
          uz: ["Samarqand ipak qog'ozi", "Misr papirusi", "Yevropa qog'ozi", "Xitoy guruch qog'ozi"],
        },
        explain: {
          en: "Samarkand pioneered fine silk-fiber paper for centuries.",
          ru: "Самарканд веками славился тонкой шёлковой бумагой.",
          uz: "Samarqand asrlar davomida nozik ipak qog'oz bilan mashhur edi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["gold", "золото", "oltin", "zar"],
        q: {
          en: "The margins are illuminated with ___ leaf.",
          ru: "Поля иллюминированы сусальным ___.",
          uz: "Chekkalar ___ yaproq bilan bezatilgan.",
        },
        answerText: { en: "gold", ru: "золотом", uz: "oltin" },
        explain: {
          en: "Gold leaf was beaten thin and laid into outlined fields.",
          ru: "Сусальное золото отбивали до тончайшей плёнки и накладывали на разметку.",
          uz: "Oltin yaproq juda yupqalanib chiziqlangan maydonlarga qo'yilardi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "Which script is most often used in such manuscripts of Mawarannahr?",
          ru: "Какой почерк чаще всего использовали в таких рукописях Мавераннахра?",
          uz: "Movarounnahrning bunday qo'lyozmalarida qaysi xat ko'p ishlatilgan?",
        },
        options: {
          en: ["Naskh / Muhaqqaq", "Cyrillic", "Greek uncial", "Latin cursive"],
          ru: ["Насх / мухаккак", "Кириллица", "Греческий унциал", "Латинский курсив"],
          uz: ["Nasx / Muhaqqaq", "Kirill", "Yunon untsiali", "Lotin kursivi"],
        },
        explain: {
          en: "Naskh and Muhaqqaq are the calm hands of classical Qur’anic copies.",
          ru: "Насх и мухаккак — спокойные почерки классических Коранов.",
          uz: "Nasx va Muhaqqaq — klassik Qur'on nusxalarining tinch xatlari.",
        },
      },
    ],
  },
  {
    slug: "silver-water-vessel",
    order: 9,
    featured: false,
    bg: "linear-gradient(155deg,#5a5042,#2f2a23 70%,#191614)",
    shot: "[ ewer · chased silver ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Persian_ewer.jpg?width=900",
    ],
    hallSlug: "reception-rooms",
    categorySlug: "metalwork",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Hammered silver, niello, bronze base",
      ru: "Ковка серебра, чернение, бронзовое основание",
      uz: "Bolg'alangan kumush, qoraytirish, bronzali asos",
    },
    tag: { en: "Reception Rooms", ru: "Парадные залы", uz: "Qabul xonalari" },
    name: { en: "Silver Water Ewer", ru: "Серебряный кумган", uz: "Kumush qumg'on" },
    story: {
      en: "Before tea came water — the host poured from a long-necked ewer over a guest’s hands above a basin. The silver here is chased into vines and fish-scale ground, the dark niello tracing the lines so they read at evening light.",
      ru: "До чая был обряд воды: хозяин лил из кумгана с длинным горлом на руки гостя над тазом. Серебро отчеканено в виноградные лозы и «рыбью чешую», тёмное чернение прорисовывает линии, чтобы их было видно при вечернем свете.",
      uz: "Choydan oldin suv marosimi bo'lardi: mezbon uzun bo'yinli qumg'ondan tos ustida mehmonning qo'liga suv quyardi. Kumush uzum novdalari va «baliq tangasi» fonida chizilgan, qora qoraytirish chiziqlarni kechki yorug'likda ko'rsatib turadi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "A long-necked Central-Asian water ewer is a…",
          ru: "Среднеазиатский водный сосуд с длинным горлом — это…",
          uz: "O'rta Osiyo uzun bo'yinli suv idishi — bu…",
        },
        options: {
          en: ["Kumgan", "Samovar", "Cauldron", "Amphora"],
          ru: ["Кумган", "Самовар", "Котёл", "Амфора"],
          uz: ["Qumg'on", "Samovar", "Qozon", "Amforal"],
        },
        explain: {
          en: "Kumgan — the long-necked ewer used at the hand-washing ritual.",
          ru: "Кумган — кувшин с длинным горлом для обряда омовения.",
          uz: "Qumg'on — qo'l yuvish marosimi uchun uzun bo'yinli idish.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["niello", "чернение", "qoraytirish"],
        q: {
          en: "Dark inlay in the chased lines is called ___.",
          ru: "Тёмная заливка в чеканных линиях называется ___.",
          uz: "Bolg'alangan chiziqlardagi qora to'ldiruv ___ deyiladi.",
        },
        answerText: { en: "niello", ru: "чернение", uz: "qoraytirish" },
        explain: {
          en: "Niello is a black sulphide alloy run into engraved silver.",
          ru: "Чернение — чёрный сульфидный сплав, вливаемый в гравированное серебро.",
          uz: "Qoraytirish — gravür qilingan kumushga quyiladigan qora sulfid qotishmasi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "The ewer’s shape is meant for…",
          ru: "Форма кумгана нужна для…",
          uz: "Qumg'on shakli nima uchun?",
        },
        options: {
          en: ["Pouring a thin precise stream", "Mass storage", "Heating tea", "Carrying coal"],
          ru: ["Точной тонкой струи", "Хранения объёма", "Нагрева чая", "Переноски угля"],
          uz: ["Ingichka aniq oqim quyish", "Hajmni saqlash", "Choy qaynatish", "Ko'mir tashish"],
        },
        explain: {
          en: "The narrow neck gives a controlled stream for the wash.",
          ru: "Узкое горло даёт контролируемую струю для омовения.",
          uz: "Tor bo'yin yuvinish uchun nazoratli oqim beradi.",
        },
      },
    ],
  },
  {
    slug: "tar-the-long-necked-lute",
    order: 10,
    featured: false,
    bg: "linear-gradient(155deg,#3a2418,#1f140b 70%,#120a05)",
    shot: "[ tanbur · mulberry wood ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tanbur.jpg?width=900",
    ],
    hallSlug: "garden-pavilion",
    categorySlug: "instruments",
    period: { en: "19th c.", ru: "XIX в.", uz: "XIX asr" },
    material: {
      en: "Mulberry wood, mother-of-pearl inlay, silk-wound steel strings",
      ru: "Тутовое дерево, перламутр, шёлково-стальные струны",
      uz: "Tut yog'och, sadaf qoplama, ipak-po'lat torlar",
    },
    tag: { en: "Music & Voice", ru: "Музыка и голос", uz: "Musiqa va ovoz" },
    name: { en: "The Tanbur", ru: "Танбур", uz: "Tanbur" },
    story: {
      en: "Long-necked, plucked, and made for the maqom — the classical six-suite cycle of Bukhara. Mulberry gives the body its dry resonance; mother-of-pearl dots tell the player where the makams turn.",
      ru: "Длинногрифовый, щипковый — для бухарского шашмакома, классического цикла шести сюит. Тутовое дерево даёт корпусу сухой звон; перламутровые точки подсказывают игроку повороты ладов.",
      uz: "Uzun grifli, chertib chalinadigan — Buxoroning shashmaqomi, oltita klassik turkum uchun. Tut yog'och tanasiga quruq jaranglikni beradi; sadaf nuqtalar maqom navbatlarini chaluvchiga ko'rsatadi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "The Bukharan classical cycle of suites is called…",
          ru: "Бухарский классический цикл сюит называется…",
          uz: "Buxoroning klassik turkum siklasi nima deyiladi?",
        },
        options: {
          en: ["Shashmaqom", "Cantata", "Suite française", "Raga"],
          ru: ["Шашмаком", "Кантата", "Французская сюита", "Рага"],
          uz: ["Shashmaqom", "Kantata", "Frantsuz syuita", "Raga"],
        },
        explain: {
          en: "Shashmaqom — “six maqams” — the canonical cycle of Bukharan court music.",
          ru: "Шашмаком — «шесть макомов» — канонический цикл бухарской придворной музыки.",
          uz: "Shashmaqom — «olti maqom» — Buxoro saroy musiqasining kanonik siklasi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["mulberry", "тут", "тутовое", "tut"],
        q: {
          en: "The body is most often turned from ___ wood.",
          ru: "Корпус чаще всего точат из ___ дерева.",
          uz: "Tanasi ko'pincha ___ yog'ochidan o'yib yasalardi.",
        },
        answerText: { en: "mulberry", ru: "тутового", uz: "tut" },
        explain: {
          en: "Mulberry is the canonical wood — light, resonant, easy to carve.",
          ru: "Тутовое дерево — каноническое: лёгкое, звучное, легко поддаётся резьбе.",
          uz: "Tut yog'och — kanonik: yengil, jarangli, o'yishga oson.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "How is the tanbur sounded?",
          ru: "Как извлекают звук на танбуре?",
          uz: "Tanbur qanday yangratiladi?",
        },
        options: {
          en: ["Plucked with a metal plectrum", "Bowed", "Struck with a hammer", "Blown"],
          ru: ["Щипком с металлическим плектром", "Смычком", "Молоточком", "Выдохом"],
          uz: ["Metall plektr bilan chertib", "Kamonbilan", "Bolg'a bilan urib", "Puflab"],
        },
        explain: {
          en: "The player plucks with a wire / metal plectrum (nakhun).",
          ru: "Играют металлическим плектром (нохун).",
          uz: "Chaluvchi metall plektr (noxun) bilan chertadi.",
        },
      },
    ],
  },
  {
    slug: "samanid-medallion-rug",
    order: 11,
    featured: false,
    bg: "linear-gradient(155deg,#552121,#2e1010 70%,#170707)",
    shot: "[ rug · medallion field ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bukharan_rug.jpg?width=900",
    ],
    hallSlug: "reception-rooms",
    categorySlug: "textiles",
    period: { en: "Late 19th c.", ru: "Конец XIX в.", uz: "XIX asr oxiri" },
    material: {
      en: "Hand-knotted wool on cotton warp, madder & indigo dyes",
      ru: "Шерсть, узловое тканьё на хлопковой основе, краски марена и индиго",
      uz: "Yung, paxta asosga tugun, ro'yan va indigo bo'yoqlar",
    },
    tag: { en: "Carpet", ru: "Ковёр", uz: "Gilam" },
    name: {
      en: "Medallion Rug",
      ru: "Ковёр с медальоном",
      uz: "Medalonli gilam",
    },
    story: {
      en: "The dyes are still the old ones: madder for the deep brick reds, indigo for the deep blues, walnut hull for the warm browns. A central medallion anchors the field; in the corners, the same shape reads as a quarter — a garden seen four times.",
      ru: "Краски всё те же старые: марена даёт кирпично-красный, индиго — глубокий синий, скорлупа грецкого ореха — тёплый коричневый. Центральный медальон держит поле; в углах та же форма читается четвертью — сад, увиденный четырежды.",
      uz: "Bo'yoqlar hanuz qadimgi: ro'yan g'isht qizilini, indigo to'q ko'kni, yong'oq po'sti issiq jigarrangni beradi. Markaziy medalon maydonni ushlab turadi; burchaklarda xuddi shu shakl chorak bo'lib o'qiladi — to'rt marta ko'rilgan bog'.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "The brick-red comes from…",
          ru: "Кирпично-красный получают из…",
          uz: "G'isht qizili qaysi o'simlikdan olinadi?",
        },
        options: {
          en: ["Madder root", "Saffron", "Henna", "Beetroot"],
          ru: ["Корня марены", "Шафрана", "Хны", "Свёклы"],
          uz: ["Ro'yan ildizi", "Za'faron", "Xina", "Lavlagi"],
        },
        explain: {
          en: "Madder root yields a fast, deep, classic red.",
          ru: "Корень марены даёт устойчивый, глубокий, классический красный.",
          uz: "Ro'yan ildizi mustahkam, chuqur, klassik qizilni beradi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["indigo", "индиго"],
        q: {
          en: "Deep blue here is dyed with ___.",
          ru: "Глубокий синий красят ___.",
          uz: "To'q ko'k bu yerda ___ bilan bo'yaladi.",
        },
        answerText: { en: "indigo", ru: "индиго", uz: "indigo" },
        explain: {
          en: "Indigo, fermented and oxidised, gives the deep blue.",
          ru: "Индиго после брожения и окисления даёт глубокий синий.",
          uz: "Indigo — fermentatsiya va oksidlanishdan keyin to'q ko'k beradi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "The central design is a…",
          ru: "Центральный рисунок — это…",
          uz: "Markaziy chizma — bu…",
        },
        options: {
          en: ["Medallion", "Tree of life only", "Calligraphy panel", "Hunting scene"],
          ru: ["Медальон", "Только древо жизни", "Каллиграфическая панель", "Сцена охоты"],
          uz: ["Medalon", "Faqat hayot daraxti", "Xattotlik paneli", "Ov sahnasi"],
        },
        explain: {
          en: "The corner quarter-medallions echo the central one — a four-fold garden.",
          ru: "Угловые «четвертины» вторят центральному медальону — четырёхкратный сад.",
          uz: "Burchak choraklari markaziy medalonni takrorlaydi — to'rt marotaba bog'.",
        },
      },
    ],
  },
  {
    slug: "carved-ganch-panel",
    order: 12,
    featured: false,
    bg: "linear-gradient(155deg,#dccda6,#a3936c 70%,#5a4d31)",
    shot: "[ ganch · pierced panel ]",
    photos: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ganch_carving_Bukhara.jpg?width=900",
    ],
    hallSlug: "white-hall",
    categorySlug: "woodwork",
    period: { en: "1912–1914", ru: "1912–1914", uz: "1912–1914" },
    material: {
      en: "Carved and pierced alabaster plaster (ganch)",
      ru: "Резной и сквозной алебастровый ганч",
      uz: "O'yilgan va ochiq alebastr ganch",
    },
    tag: { en: "Architecture", ru: "Архитектура", uz: "Me'morchilik" },
    name: {
      en: "Pierced Ganch Panel",
      ru: "Прорезная панель ганча",
      uz: "Ochiq ganch paneli",
    },
    story: {
      en: "A test piece from the White Hall — pierced ganch over which the masters laid a mirror, so light passing through one room would multiply into the next. The carving is so deep that the panel turns into a screen, the wall almost dissolving.",
      ru: "Пробная плита из Белого зала — сквозной ганч, на который мастера накладывали зеркало: свет, проходящий через одну комнату, умножался в соседней. Резьба настолько глубокая, что панель становится решёткой, а стена будто растворяется.",
      uz: "Oq Zaldan namuna — ochiq ganch, ustasi orqasiga oyna qo'yardi: bir xonadan o'tgan yorug'lik qo'shni xonada ko'payar edi. O'yma shu qadar chuqurki, panel panjaraga aylanadi, devor esa eriydigandek bo'ladi.",
    },
    questions: [
      {
        type: "choice",
        order: 0,
        correctIndex: 0,
        q: {
          en: "Ganch is a kind of…",
          ru: "Ганч — это разновидность…",
          uz: "Ganch — qaysi turdagi material?",
        },
        options: {
          en: ["Alabaster plaster", "Hardwood", "Fired clay", "Stone mosaic"],
          ru: ["Алебастровой штукатурки", "Твёрдого дерева", "Обожжённой глины", "Каменной мозаики"],
          uz: ["Alebastr suvog'i", "Qattiq yog'och", "Pishirilgan loy", "Tosh mozaikasi"],
        },
        explain: {
          en: "Ganch is a soft alabaster plaster that hardens after carving.",
          ru: "Ганч — мягкая алебастровая штукатурка, твердеющая после резьбы.",
          uz: "Ganch — yumshoq alebastr suvog'i, o'yilgandan keyin qotadi.",
        },
      },
      {
        type: "text",
        order: 1,
        accept: ["mirror", "зеркало", "oyna"],
        q: {
          en: "Behind the pierced panel the masters set a ___.",
          ru: "За прорезной панелью мастера ставили ___.",
          uz: "Ochiq panel orqasiga ustalar ___ qo'yishgan.",
        },
        answerText: { en: "mirror", ru: "зеркало", uz: "oyna" },
        explain: {
          en: "A mirror behind the pierced field multiplied the room’s light.",
          ru: "Зеркало за сквозной плитой умножало свет в комнате.",
          uz: "Ochiq panel orqasidagi oyna xona yorug'ligini ko'paytirar edi.",
        },
      },
      {
        type: "choice",
        order: 2,
        correctIndex: 0,
        q: {
          en: "When was the White Hall built?",
          ru: "Когда построили Белый зал?",
          uz: "Oq Zal qachon qurilgan?",
        },
        options: {
          en: ["1912–1914", "1801–1803", "1956–1958", "1991"],
          ru: ["1912–1914", "1801–1803", "1956–1958", "1991"],
          uz: ["1912–1914", "1801–1803", "1956–1958", "1991"],
        },
        explain: {
          en: "Two years of work — the master and his thirty hands finished it in 1914.",
          ru: "Два года работы — мастер и тридцать его рук закончили в 1914-м.",
          uz: "Ikki yil mehnat — ustaning o'ttiz qo'li 1914-yilda yakunlagan.",
        },
      },
    ],
  },
];

async function main() {
  console.log("⚠ wiping editorial data…");
  await prisma.quizQuestionTranslation.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.exhibitTranslation.deleteMany();
  await prisma.exhibitImage.deleteMany();
  await prisma.exhibit.deleteMany();
  await prisma.hallTranslation.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();

  console.log("→ seeding halls");
  const hallIds = new Map<string, string>();
  for (const h of HALLS) {
    const row = await prisma.hall.create({
      data: {
        slug: h.slug,
        number: h.number,
        translations: {
          create: (["en", "ru", "uz"] as const).map((loc) => ({
            locale: loc,
            name: h.name[loc],
          })),
        },
      },
    });
    hallIds.set(h.slug, row.id);
  }

  console.log("→ seeding categories");
  const catIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.create({
      data: {
        slug: c.slug,
        translations: {
          create: (["en", "ru", "uz"] as const).map((loc) => ({
            locale: loc,
            name: c.name[loc],
          })),
        },
      },
    });
    catIds.set(c.slug, row.id);
  }

  console.log(`→ seeding ${EXHIBITS.length} exhibits + ${EXHIBITS.length * 3} questions × 3 languages`);
  for (const ex of EXHIBITS) {
    const created = await prisma.exhibit.create({
      data: {
        slug: ex.slug,
        order: ex.order,
        featured: ex.featured,
        bg: ex.bg,
        shot: ex.shot,
        hallId: hallIds.get(ex.hallSlug),
        categoryId: catIds.get(ex.categorySlug),
        translations: {
          create: (["en", "ru", "uz"] as const).map((loc) => ({
            locale: loc,
            name: ex.name[loc],
            tag: ex.tag[loc],
            story: ex.story[loc],
          })),
        },
      },
    });

    // Period / material are non-translatable on the schema — keep the EN copy
    await prisma.exhibit.update({
      where: { id: created.id },
      data: {
        period: ex.period.en,
        material: ex.material.en,
      },
    });

    if (ex.photos && ex.photos.length) {
      await prisma.exhibitImage.createMany({
        data: ex.photos.map((url, i) => ({
          exhibitId: created.id,
          url,
          alt: ex.name.en,
          order: i,
        })),
      });
    }

    for (const q of ex.questions) {
      await prisma.quizQuestion.create({
        data: {
          exhibitId: created.id,
          type: q.type,
          order: q.order,
          correctIndex: q.correctIndex ?? null,
          accept: q.accept ?? [],
          translations: {
            create: (["en", "ru", "uz"] as const).map((loc) => ({
              locale: loc,
              q: q.q[loc],
              options: q.options ? q.options[loc] : [],
              answerText: q.answerText ? q.answerText[loc] : null,
              explain: q.explain[loc],
            })),
          },
        },
      });
    }
  }

  console.log("✓ done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
