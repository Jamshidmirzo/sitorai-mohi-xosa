"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

type Branch = {
  number: number;
  name: Tri<string>;
  description: Tri<string>;
};

const HEAD: Tri<string> = {
  en: "Branches of the Bukhara Museum-Reserve",
  ru: "Филиалы Бухарского музея-заповедника",
  uz: "Buxoro davlat muzey-qo‘riqxonasi filiallari",
};

const SUB: Tri<string> = {
  en: "Sitorai Mohi Xossa is one of eighteen branches. Together they hold over 150 000 objects.",
  ru: "Ситораи Мохи Хосса — один из восемнадцати филиалов. Вместе они хранят более 150 000 предметов.",
  uz: "Sitorai Mohi Xossa — o‘n sakkizta filialdan biri. Birgalikda 150 000 dan ortiq buyumni saqlaydi.",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const STATS: Tri<string> = {
  en: "16 active branches · 2 permanent exhibitions · 150 000+ objects",
  ru: "16 действующих филиалов · 2 постоянные экспозиции · 150 000+ предметов",
  uz: "16 ta faol filial · 2 doimiy ekspozitsiya · 150 000+ buyum",
};

const SOURCE: Tri<string> = {
  en: "Source: master’s dissertation by Sh.K. Roziqulova, K. Behzod NRDI, Tashkent, 2026.",
  ru: "Источник: магистерская диссертация Розикуловой Ш.К., НИЖиД им. К. Бехзода, Ташкент, 2026.",
  uz: "Manba: Ro‘ziqulova Sh.K. magistrlik dissertatsiyasi, K. Behzod NRDI, Toshkent, 2026.",
};

const BRANCHES: Branch[] = [
  {
    number: 1,
    name: { en: "Ark Citadel Local-History Museum", ru: "Краеведческий музей цитадели Арк", uz: "Ark o‘lkashunoslik muzeyi" },
    description: {
      en: "The main branch — three departments (History, Art & Ethnography, Nature) inside the fortified citadel that ruled Bukhara for nine centuries.",
      ru: "Основной филиал — три отдела (История, Искусство и этнография, Природа) внутри укреплённой цитадели, правившей Бухарой девять веков.",
      uz: "Asosiy filial — uchta bo‘lim (Tarix, San’at va etnografiya, Tabiat) Buxoroni to‘qqiz asr boshqargan mustahkam qo‘rg‘on ichida.",
    },
  },
  {
    number: 2,
    name: { en: "Sitorai Mohi Xossa — Folk Decorative Art", ru: "Ситораи Мохи Хосса — народное прикладное искусство", uz: "Sitorai Mohi Xossa — xalq amaliy bezak san‘ati" },
    description: {
      en: "This museum. Summer palace of the last Emirs of Bukhara, opened as a museum in 1931.",
      ru: "Этот музей. Летняя резиденция последних эмиров Бухары, открыта как музей в 1931 году.",
      uz: "Mana bu muzey. Buxoro so‘nggi amirlarining yozgi qarorgohi, 1931-yilda muzey sifatida ochilgan.",
    },
  },
  {
    number: 3,
    name: { en: "Bukhara Museum of Fine Arts", ru: "Бухарский музей изобразительных искусств", uz: "Buxoro tasviriy san‘at muzeyi" },
    description: {
      en: "Founded in 1982 by initiative of Sharof Rashidov in the former Azov-Don Bank building (built 1912, architects Margulis and Sakovich) over the Shahrud canal.",
      ru: "Основан в 1982 году по инициативе Шарафа Рашидова в здании бывшего Азово-Донского банка (1912, архитекторы Маргулис и Сакович) над каналом Шахруд.",
      uz: "1982-yilda Sharof Rashidov tashabbusi bilan sobiq Azov-Don banki binosida (1912-y., me‘mor Margulis va Sakovich) Shoxrud arig‘i ustida tashkil etilgan.",
    },
  },
  {
    number: 4,
    name: { en: "Bukhara Law & Jurisprudence Museum", ru: "Бухарский музей права и законодательства", uz: "Buxoro huquq va qonunchilik muzeyi" },
    description: {
      en: "Documents, manuscripts and court paraphernalia tracing the legal traditions of Mawarannahr and the Bukharan Emirate.",
      ru: "Документы, манускрипты и судебные предметы, прослеживающие правовые традиции Мавераннахра и Бухарского эмирата.",
      uz: "Movarounnahr va Buxoro amirligi huquqiy an‘analarini kuzatuvchi hujjatlar, qo‘lyozmalar va sud anjomlari.",
    },
  },
  {
    number: 5,
    name: { en: "Bukhara Water Supply History Museum", ru: "Музей истории водоснабжения Бухары", uz: "Buxoro suv ta‘minoti tarixi muzeyi" },
    description: {
      en: "From the medieval hauz (city reservoir) to the modern aqueduct — how an oasis city engineered water across one thousand years.",
      ru: "От средневекового хауза (городского водохранилища) до современного акведука — как город-оазис управлял водой на протяжении тысячелетия.",
      uz: "O‘rta asr hovuzidan zamonaviy akveduklargacha — vohada joylashgan shahar suvni ming yil davomida qanday boshqargan.",
    },
  },
  {
    number: 6,
    name: { en: "Carpet Museum", ru: "Музей ковров", uz: "Gilamlar muzeyi" },
    description: {
      en: "Bukharan, Turkmen and Iranian carpets — knot-by-knot wool grammars of nomadic and settled life across two centuries.",
      ru: "Бухарские, туркменские и иранские ковры — узловая «грамматика» шерсти кочевой и осёдлой жизни за два столетия.",
      uz: "Buxoro, turkman va eron gilamlari — ko‘chmanchi va o‘troq hayotning ikki asrlik junli grammatikasi.",
    },
  },
  {
    number: 7,
    name: { en: "Ancient Poykent Museum", ru: "Музей древнего Пайкента", uz: "Qadimgi Poykent tarixi muzeyi" },
    description: {
      en: "Archaeological finds from one of the great Sogdian merchant cities, on the western edge of the Bukhara oasis.",
      ru: "Археологические находки из одного из великих согдийских торговых городов, на западной окраине Бухарского оазиса.",
      uz: "Buxoro vohasining g‘arbiy chekkasidagi buyuk sug‘d savdo shaharlaridan birining arxeologik topilmalari.",
    },
  },
  {
    number: 8,
    name: { en: "Romitan District History Museum", ru: "Музей истории Ромитанского района", uz: "Romitan tumani tarixi muzeyi" },
    description: {
      en: "Local-history collection of one of the oldest rural districts north of Bukhara, on the ancient Caravan road.",
      ru: "Краеведческое собрание одного из старейших сельских районов севернее Бухары, на древней Караванной дороге.",
      uz: "Buxoro shimolidagi qadimiy karvon yo‘lida joylashgan eng eski qishloq tumanlaridan birining o‘lkashunoslik to‘plami.",
    },
  },
  {
    number: 9,
    name: { en: "Bukhara Literature History Museum", ru: "Музей истории бухарской литературы", uz: "Buxoro adabiyoti tarixi muzeyi" },
    description: {
      en: "Manuscripts, divans and printed editions — from Rudaki and Ibn Sina through to the twentieth century.",
      ru: "Манускрипты, диваны и печатные издания — от Рудаки и Ибн Сины до XX века.",
      uz: "Qo‘lyozmalar, devonlar va bosma nashrlar — Rudakiy va Ibn Sinodan to XX asrgacha.",
    },
  },
  {
    number: 10,
    name: { en: "Naqshbandiya Tariqat Museum", ru: "Музей суфийского ордена Накшбандия", uz: "Naqshbandiya tariqati muzeyi" },
    description: {
      en: "Centre of the Naqshbandi Sufi order founded in Bukhara — the spiritual lineage, texts and dhikr practice that shaped Central Asian Islam.",
      ru: "Центр суфийского ордена Накшбандия, основанного в Бухаре — духовная преемственность, тексты и практика зикра, формировавшие центральноазиатский ислам.",
      uz: "Buxoroda tashkil topgan Naqshbandiya tariqatining markazi — Markaziy Osiyo islomini shakllantirgan ma’naviy silsila, matnlar va zikr amaliyoti.",
    },
  },
  {
    number: 11,
    name: { en: "Bukhara Calligraphy Museum", ru: "Музей бухарской каллиграфии", uz: "Buxoro xattotchiligi san’ati muzeyi" },
    description: {
      en: "The hand at work: reed pens, inks, papers and the schools of nastaliq, naskh and shikasta as practised by Bukharan scribes.",
      ru: "Рука за работой: тростниковые перья, чернила, бумага и школы насталика, насха и шикасте бухарских писцов.",
      uz: "Qoʻl ish ustida: qamish qalamlar, siyohlar, qogʻozlar va Buxoro xattotlari amal qilgan nastaliq, nasx va shikasta maktablari.",
    },
  },
  {
    number: 12,
    name: { en: "Blacksmithing History Workshop-Museum", ru: "Музей-мастерская истории кузнечного дела", uz: "Temirchilik hunari tarixi muzey-ustaxonasi" },
    description: {
      en: "A working forge as well as a museum — anvil, bellows and tongs alongside the daggers, locks and farm implements they once produced.",
      ru: "Работающая кузница, одновременно музей — наковальня, мехи и щипцы рядом с кинжалами, замками и сельхозинвентарём, которые здесь когда-то ковали.",
      uz: "Ham ishlovchi temirchilik, ham muzey — sandon, koʻra va omburlar yonida bir vaqtlar bu yerda yasalgan qilich, qulf va qishloq xoʻjaligi asboblari.",
    },
  },
  {
    number: 13,
    name: { en: "Imam al-Bukhari Memorial Museum", ru: "Мемориальный музей имама аль-Бухари", uz: "Imom al-Buxoriy memorial muzeyi" },
    description: {
      en: "Devoted to the great hadith-scholar Muhammad ibn Ismail al-Bukhari (810–870) — manuscripts of the «Sahih», related documents and the masterʼs lineage.",
      ru: "Посвящён великому хадисоведу Мухаммаду ибн Исмаилу аль-Бухари (810–870) — манускрипты «Сахиха», сопутствующие документы и преемственность его школы.",
      uz: "Buyuk muhaddis Muhammad ibn Ismoil al-Buxoriyga (810–870) bagʻishlangan — «Sahih» qoʻlyozmalari, oid hujjatlar va ustaning ilmiy silsilasi.",
    },
  },
  {
    number: 14,
    name: { en: "Abu Ali Ibn Sina Memorial Museum", ru: "Мемориальный музей Абу Али ибн Сины", uz: "Abu Ali ibn Sino memorial muzeyi" },
    description: {
      en: "Avicenna’s «Canon of Medicine» in early Bukharan editions, instruments and herbaria from the medical tradition he founded.",
      ru: "«Канон врачебной науки» Авиценны в ранних бухарских изданиях, инструменты и гербарии медицинской традиции, основанной им.",
      uz: "Avitsennaning «Tib qonunlari»ning erta Buxoro nashrlari, u asos solgan tibbiy an‘ana asboblari va gerbariylari.",
    },
  },
  {
    number: 15,
    name: { en: "Wealthy Bukharan Merchant House-Museum", ru: "Дом-музей бухарского богатого купца", uz: "Buxorolik boy savdogar xonadoni uy-muzeyi" },
    description: {
      en: "An entire merchant household preserved as-was: living quarters, workshops, account-books and the courtyard around which it all turned.",
      ru: "Целиком сохранённый торговый дом — жилые покои, мастерские, бухгалтерские книги и двор, вокруг которого всё крутилось.",
      uz: "Toʻliq saqlangan savdogar uyi — turar joylar, ustaxonalar, hisob daftarlari va hammasi atrofida aylangan hovli.",
    },
  },
  {
    number: 16,
    name: { en: "Mutal Burhonov House-Museum", ru: "Дом-музей Мутала Бурханова", uz: "Mutal Burxonov uy-muzeyi" },
    description: {
      en: "Composer Mutal Burhonov’s house, gifted by the Bukhara regional authorities in 1997 and opened as a museum on 28 August 2018. Four rooms — four sections of his life and work.",
      ru: "Дом композитора Мутала Бурханова, подаренный хокимиятом Бухарской области в 1997 году и открытый как музей 28 августа 2018 года. Четыре комнаты — четыре раздела жизни и творчества.",
      uz: "Bastakor Mutal Burxonovning uyi: 1997-yilda Buxoro viloyati hokimligi sovgʻa qilgan va 2018-yil 28-avgustda muzey sifatida ochilgan. Toʻrt xona — uning hayot va ijodining toʻrt boʻlimi.",
    },
  },
  {
    number: 17,
    name: { en: "Bukhara Woodcarving History Museum-Exhibition", ru: "Музей-выставка истории бухарской резьбы по дереву", uz: "Buxoro yog‘och o‘ymakorligi tarixi muzey-ko‘rgazmasi" },
    description: {
      en: "Doors, ceilings, columns and screens — the carved-wood corpus of Bukhara, with master-attribution where the workshops can be traced.",
      ru: "Двери, потолки, колонны и решётки — корпус бухарской резьбы по дереву с атрибуцией мастера там, где мастерская прослеживается.",
      uz: "Eshiklar, shiftlar, ustunlar va panjaralar — Buxoroning yogʻoch oʻymakorligi korpusi, ustaxona izlanadigan joyda usta atributsiyasi bilan.",
    },
  },
  {
    number: 18,
    name: { en: "Ancient Varakhsha & Bukhara Pottery Museum-Exhibition", ru: "Музей-выставка истории древней Варахши и бухарской керамики", uz: "Qadimgi Varaxsha va Buxoro kulolchiligi tarixi muzey-ko‘rgazmasi" },
    description: {
      en: "Sogdian-era painted clay from Varakhsha alongside the long Bukharan tradition of slipware, lustreware and blue-and-white.",
      ru: "Согдийская расписная глина из Варахши рядом с давней бухарской традицией ангобной, люстровой и сине-белой керамики.",
      uz: "Varaxshadan sugʻd davri bo‘yalgan loylari va Buxoroning angob, lustr va ko‘k-oq kulolchilik an’anasi yonma-yon.",
    },
  },
];

export function BranchesView() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, var(--mid) 0%, var(--mid2) 100%)",
        color: "#F3ECDD",
        paddingTop: 56,
        paddingBottom: 96,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "rgba(247,238,222,.7)",
              textDecoration: "none",
            }}
          >
            ‹ {BACK[locale]}
          </Link>
          <div
            style={{
              display: "inline-flex",
              gap: 4,
              padding: "4px 6px",
              borderRadius: 24,
              border: "1px solid rgba(216,185,120,.28)",
              background: "rgba(255,255,255,.04)",
            }}
          >
            {LANGS.map((L) => {
              const active = L === locale;
              return (
                <button
                  key={L}
                  onClick={() => router.replace(pathname, { locale: L })}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 20,
                    border: 0,
                    background: active ? "#D8B978" : "transparent",
                    color: active ? "#221E17" : "rgba(247,238,222,.78)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {L}
                </button>
              );
            })}
          </div>
        </div>

        <header style={{ textAlign: "center", marginBottom: 64 }}>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontSize: "clamp(34px, 5vw, 56px)",
              lineHeight: 1.06,
              color: "#FBF5E8",
              margin: 0,
            }}
          >
            {HEAD[locale]}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "#d8c79c",
              marginTop: 18,
              maxWidth: 640,
              marginInline: "auto",
              lineHeight: 1.5,
            }}
          >
            {SUB[locale]}
          </p>
          <div
            style={{
              marginTop: 22,
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 22,
              border: "1px solid rgba(216,185,120,.32)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.85)",
            }}
          >
            {STATS[locale]}
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
          {BRANCHES.map((b, i) => (
            <article
              key={b.number}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr",
                gap: 24,
                padding: "28px 0",
                borderTop:
                  i === 0
                    ? "1px solid rgba(216,185,120,.16)"
                    : "1px solid rgba(216,185,120,.08)",
                borderBottom:
                  i === BRANCHES.length - 1
                    ? "1px solid rgba(216,185,120,.16)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 500,
                  fontSize: 42,
                  color: "#D8B978",
                  lineHeight: 1,
                  letterSpacing: ".01em",
                }}
              >
                {b.number.toString().padStart(2, "0")}
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 500,
                    fontSize: 22,
                    color: "#F3ECDD",
                    margin: 0,
                    lineHeight: 1.18,
                  }}
                >
                  {b.name[locale]}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.72,
                    color: "#b9bccb",
                    margin: "10px 0 0",
                    maxWidth: 680,
                    textWrap: "pretty",
                  }}
                >
                  {b.description[locale]}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 64,
            paddingTop: 28,
            borderTop: "1px solid rgba(216,185,120,.16)",
            fontSize: 12,
            lineHeight: 1.7,
            color: "#8c90a6",
            fontStyle: "italic",
            maxWidth: 640,
            marginInline: "auto",
            textAlign: "center",
          }}
        >
          {SOURCE[locale]}
        </p>
      </div>
    </div>
  );
}
