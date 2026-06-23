"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

const HEAD: Tri<string> = {
  en: "Sources & references",
  ru: "Источники и литература",
  uz: "Manbalar va adabiyot",
};

const SUB: Tri<string> = {
  en: "Where the texts on this site come from — a working bibliography for researchers, students and visitors.",
  ru: "Откуда взяты тексты этого сайта — рабочая библиография для исследователей, студентов и посетителей.",
  uz: "Bu saytdagi matnlar qaydan olingan — tadqiqotchilar, talabalar va tashrif buyuruvchilar uchun ishchi bibliografiya.",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const PRIMARY_TITLE: Tri<string> = {
  en: "Primary source for this site",
  ru: "Основной источник этого сайта",
  uz: "Saytning asosiy manbasi",
};

const LIT_TITLE: Tri<string> = {
  en: "Museum studies & monographs on Sitorai Mohi Xossa",
  ru: "Музееведение и монографии по Ситораи Мохи Хосса",
  uz: "Muzeyshunoslik va Sitorai Mohi Xossa monografiyalari",
};

const LEGAL_TITLE: Tri<string> = {
  en: "Legal framework",
  ru: "Правовая база",
  uz: "Huquqiy asoslar",
};

const LEGAL_LEAD: Tri<string> = {
  en: "Decrees and resolutions governing the preservation, restoration and museification of Uzbek cultural heritage:",
  ru: "Указы и постановления, определяющие сохранение, реставрацию и музеефикацию культурного наследия Узбекистана:",
  uz: "O‘zbekistonda madaniy merosni saqlash, restavratsiya qilish va muzeylashtirishni belgilovchi farmon va qarorlar:",
};

type Entry = {
  authors: string;
  title: Tri<string>;
  meta: Tri<string>;
  note?: Tri<string>;
};

const PRIMARY: Entry = {
  authors: "Roziqulova Sh. K.",
  title: {
    en: "Processes of museification of the Sitorai Mohi Xossa historical monument (2nd half of XX – beginning of XXI c.)",
    ru: "Процессы музеефикации исторического памятника «Ситораи Мохи Хосса» (II половина XX – начало XXI в.)",
    uz: "«Sitorai Mohi Xossa» tarixiy obidasining muzeylashtirish jarayonlari (XX asr II yarmi – XXI asr boshi)",
  },
  meta: {
    en: "Master’s dissertation in Museum Studies. National Institute of Painting and Design named after K. Behzod, Tashkent, 2026.",
    ru: "Магистерская диссертация по специальности «Музееведение». Национальный институт живописи и дизайна имени К. Бехзода, Ташкент, 2026.",
    uz: "Muzeyshunoslik bo‘yicha magistrlik dissertatsiyasi. K. Behzod nomidagi Milliy rassomlik va dizayn instituti, Toshkent, 2026.",
  },
  note: {
    en: "All texts on the History timeline, Masters page, exhibit stories, the About page and the architecture descriptions are drawn from this dissertation. Names, dates, attributions and pigment recipes that would otherwise live only in the archive.",
    ru: "Все тексты на странице «Хронология», «Мастера», на карточках экспонатов, на «О музее» и в описаниях архитектуры взяты из этой диссертации. Имена, даты, атрибуции и рецепты пигментов, которые иначе остались бы только в архиве.",
    uz: "«Xronologiya» sahifasidagi, «Ustalar», eksponatlar kartochkalaridagi, «Muzey haqida» va me‘morchilik tavsiflaridagi barcha matnlar shu dissertatsiyadan olingan. Bo‘lmasa, faqat arxivda qoladigan ismlar, sanalar, atributsiyalar va bo‘yoq retseptlari.",
  },
};

const LITERATURE: Entry[] = [
  {
    authors: "Kryukov K. S.",
    title: {
      en: "Sitorai-Mokhi-Khasa",
      ru: "Ситораи-Махи-Хаса",
      uz: "Ситораи-Махи-Хаса",
    },
    meta: {
      en: "Tashkent: Uzbekistan, 1968 — 18 pp. The first methodological publication on the palace’s construction, architectural styles and interior decoration. A pocket-format primer that has been quietly reproduced in every guide since.",
      ru: "Ташкент: Узбекистан, 1968 — 18 с. Первая методическая публикация о постройке дворца, архитектурных стилях и внутреннем убранстве. Карманное издание, фактически переиздаваемое в каждом путеводителе с тех пор.",
      uz: "Toshkent: O‘zbekiston, 1968 — 18 b. Saroyning qurilishi, me‘moriy uslublari va ichki bezaklari haqida birinchi uslubiy nashr. Cho‘ntak formatdagi qo‘llanma, o‘shandan beri har bir yo‘riqnomada qayta nashr qilingan.",
    },
  },
  {
    authors: "Pugachenkova G. A.",
    title: {
      en: "Bukhara: An open-sky museum",
      ru: "Бухара. Музей под открытым небом",
      uz: "Buxoro. Ochiq osmon ostidagi muzey",
    },
    meta: {
      en: "Tashkent, 1981 — 291 pp. Canonical art-historical survey of Bukhara’s monuments by the leading scholar of Central Asian architectural history. A foundational reference cited across the dissertation.",
      ru: "Ташкент, 1981 — 291 с. Канонический искусствоведческий обзор памятников Бухары от ведущей исследовательницы архитектурной истории Центральной Азии. Базовый источник, на который ссылается вся диссертация.",
      uz: "Toshkent, 1981 — 291 b. Markaziy Osiyo me‘morchilik tarixining yetakchi tadqiqotchisidan Buxoro yodgorliklarining kanonik san‘atshunoslik sharhi. Dissertatsiya bo‘ylab tilga olingan asosiy manba.",
    },
  },
  {
    authors: "Sadikova N.",
    title: {
      en: "Museum work in Uzbekistan",
      ru: "Музейное дело в Узбекистане",
      uz: "O‘zbekistonda muzey ishi",
    },
    meta: {
      en: "Tashkent: Fan, 1975 — 290 pp. A monograph on the development of Uzbek museography from the 1920s — institutional history, exposition models, the role of state policy.",
      ru: "Ташкент: Фан, 1975 — 290 с. Монография о развитии узбекской музеографии с 1920-х годов: институциональная история, экспозиционные модели, роль государственной политики.",
      uz: "Toshkent: Fan, 1975 — 290 b. 1920-yillardan boshlab O‘zbek muzeografiyasining rivojlanishi haqida monografiya: institutsional tarix, ekspozitsiya modellari, davlat siyosatining roli.",
    },
  },
  {
    authors: "Muini R.",
    title: {
      en: "Architectural monuments of Bukhara",
      ru: "Архитектурные памятники Бухары",
      uz: "Buxoroning me‘moriy yodgorliklari",
    },
    meta: {
      en: "Tashkent, 2007 — 94 pp. A typology of Bukharan architectural objects — palaces, madrasas, caravanserais — with attention to construction techniques and decorative grammar.",
      ru: "Ташкент, 2007 — 94 с. Типология бухарских архитектурных объектов — дворцы, медресе, караван-сараи — с вниманием к технике постройки и декоративной грамматике.",
      uz: "Toshkent, 2007 — 94 b. Buxoro me‘moriy obyektlarining tipologiyasi — saroylar, madrasalar, karvonsaroylar — qurilish texnikasi va dekorativ grammatikasiga e‘tibor bilan.",
    },
  },
  {
    authors: "Mukhamedova M. S.",
    title: {
      en: "The role of national and international organisations in museum-studies development (XX–XXI cc.)",
      ru: "Роль национальных и международных организаций в развитии музееведения (XX–XXI вв.)",
      uz: "XX–XXI asrlarda muzeyshunoslik sohasini rivojlantirishda milliy va xalqaro tashkilotlar faoliyatining o‘rni",
    },
    meta: {
      en: "Monograph. Tashkent: Yosh Kuch Press, 2017 — 297 pp. ICOM, UNESCO and the national museum agencies — how the international standards arrived in the Uzbek museum sector.",
      ru: "Монография. Ташкент: Yosh Kuch Press, 2017 — 297 с. ICOM, ЮНЕСКО и национальные музейные ведомства — как международные стандарты пришли в узбекскую музейную отрасль.",
      uz: "Monografiya. Toshkent: Yosh Kuch Press, 2017 — 297 b. ICOM, YuNESKO va milliy muzey agentliklari — xalqaro standartlar O‘zbekiston muzey sohasiga qanday yetib kelgani.",
    },
  },
  {
    authors: "Nishanova K. S.",
    title: {
      en: "Trends in the development of Uzbekistan’s art museums in the XX–XXI centuries",
      ru: "Тенденции развития художественных музеев Узбекистана в XX–XXI веках",
      uz: "XX–XXI asrlarda O‘zbekiston badiiy muzeylarining rivojlanish tendentsiyalari",
    },
    meta: {
      en: "Monograph. Tashkent, 2021 — 151 pp. A typological history of Uzbek art museums covering the post-Soviet reform period — relevant to Sitorai Mohi Xossa’s repositioning after 1991.",
      ru: "Монография. Ташкент, 2021 — 151 с. Типологическая история узбекских художественных музеев, охватывающая постсоветский реформенный период — релевантна перепозиционированию Ситораи Мохи Хосса после 1991 года.",
      uz: "Monografiya. Toshkent, 2021 — 151 b. Sovetdan keyingi islohot davrini qamragan o‘zbek badiiy muzeylarining tipologik tarixi — 1991-yildan keyin Sitorai Mohi Xossaning qayta joylashtirilishiga tegishli.",
    },
  },
  {
    authors: "Boltayev A. H.",
    title: {
      en: "The Bukhara Museum as a Centre of Historical-Regional Studies",
      ru: "Бухарский музей как центр историко-краеведческих исследований",
      uz: "Buxoro muzeyi — tarixiy o‘lkashunoslik markazi sifatida",
    },
    meta: {
      en: "Tashkent: Navro‘z, 2019 — 70 pp. Studies the institutional role of the Bukhara museum in regional historical research; co-authored complementary material with J. Odilov on the palace as an ethnographic object.",
      ru: "Ташкент: Навруз, 2019 — 70 с. Изучение институциональной роли Бухарского музея в региональных исторических исследованиях; в соавторстве с Дж. Одиловым — параллельные работы о дворце как этнографическом объекте.",
      uz: "Toshkent: Navro‘z, 2019 — 70 b. Buxoro muzeyining mintaqaviy tarixiy tadqiqotlardagi institutsional rolini o‘rganadi; J. Odilov bilan birgalikda saroy haqida etnografik obyekt sifatida tegishli ishlar bajargan.",
    },
  },
  {
    authors: "Sodiqova N., Kuryazova D., Ismailova J., Nishanova K., Mukhamedova M.",
    title: {
      en: "Museum and Society",
      ru: "Музей и общество",
      uz: "Muzey va jamiyat",
    },
    meta: {
      en: "Reference monograph on modern museum studies — current trends, new types of museums, their educational and cultural-enlightening function. Frames the conceptual approach taken on this site.",
      ru: "Справочная монография по современному музееведению — современные тенденции, новые типы музеев, их образовательная и культурно-просветительная функция. Задаёт концептуальный подход, использованный на этом сайте.",
      uz: "Zamonaviy muzeyshunoslik bo‘yicha ma‘lumotnoma-monografiya — zamonaviy yo‘nalishlar, yangi turdagi muzeylar, ularning ta‘lim va madaniy-ma‘rifiy funksiyasi. Bu saytda qo‘llanilgan kontseptual yondashuvni belgilaydi.",
    },
  },
  {
    authors: "Ismailova J.",
    title: {
      en: "Foundations of modern museum studies",
      ru: "Основы современного музееведения",
      uz: "Zamonaviy muzeyshunoslik asoslari",
    },
    meta: {
      en: "Scholarly-methodological handbook. Reform of the Uzbek museum sector, principles of museum exposition design, and the dialogue between museums and society.",
      ru: "Научно-методическое пособие. Реформы музейной отрасли Узбекистана, принципы построения музейной экспозиции, диалог музея и общества.",
      uz: "Ilmiy-uslubiy qo‘llanma. O‘zbekiston muzey sohasidagi islohotlar, muzey ekspozitsiyalarini tashkil etish tamoyillari, muzey va jamiyat o‘rtasidagi muloqot.",
    },
  },
  {
    authors: "Jumayev Q.",
    title: {
      en: "Sitorai Mohi Xossa (art-historical articles)",
      ru: "Ситораи Мохи Хосса (искусствоведческие статьи)",
      uz: "Sitorai Mohi Xossa (san‘atshunoslik maqolalari)",
    },
    meta: {
      en: "Art-historical study of the palace by Bukharan scholar Q. Jumayev — a key source on attribution of decoration and provenance of furnishings.",
      ru: "Искусствоведческое исследование дворца бухарского учёного К. Жумаева — ключевой источник по атрибуции декора и провенансу убранства.",
      uz: "Buxorolik olim Q. Jumayev tomonidan saroy haqida san‘atshunoslik tadqiqoti — bezak atributsiyasi va jihozlarning provenans bo‘yicha asosiy manba.",
    },
  },
];

type Decree = {
  date: string;
  number: string;
  title: Tri<string>;
};

const LEGAL: Decree[] = [
  {
    date: "2010-03-23",
    number: "49",
    title: {
      en: "Resolution of the Cabinet of Ministers «On the state programme for the study, conservation, restoration and adaptation for modern use of the cultural heritage objects of Bukhara»",
      ru: "Постановление Кабинета Министров «О государственной программе изучения, консервации, реставрации и приспособления для современного использования объектов культурного наследия города Бухары»",
      uz: "Vazirlar Mahkamasining «Buxoro shahrining madaniy meros obyektlarini tadqiq etish, konservatsiya, restavratsiya va zamonaviy foydalanish uchun moslashtirish bo‘yicha davlat dasturi to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2017-12-11",
    number: "975 / programme",
    title: {
      en: "Resolution of the Cabinet of Ministers approving the comprehensive programme «Improvement of the activity and material-technical base of state museums in 2017–2027»",
      ru: "Постановление Кабинета Министров об утверждении комплексной программы «Совершенствование деятельности и укрепление материально-технической базы государственных музеев в 2017–2027 годах»",
      uz: "Vazirlar Mahkamasining «2017–2027-yillarda davlat muzeylari faoliyatini takomillashtirish va moddiy-texnik bazasini mustahkamlash bo‘yicha kompleks chora-tadbirlar dasturini tasdiqlash to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2019-10-18",
    number: "991",
    title: {
      en: "Resolution of the Cabinet of Ministers «On the rules for using material cultural heritage objects»",
      ru: "Постановление Кабинета Министров «О порядке использования объектов материального культурного наследия»",
      uz: "Vazirlar Mahkamasining «Moddiy madaniy meros obyektlaridan foydalanish tartibi to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2021-03-03",
    number: "119",
    title: {
      en: "Resolution of the Cabinet of Ministers «On measures to strengthen the protection of material cultural heritage objects and territories included in the UNESCO World Heritage List»",
      ru: "Постановление Кабинета Министров «О мерах по усилению охраны объектов материального культурного наследия и территорий, включённых в Список всемирного наследия ЮНЕСКО»",
      uz: "Vazirlar Mahkamasining «Moddiy madaniy meros obyektlari va YUNESKOning umumjahon merosi ro‘yxatiga kiritilgan hududlar muhofazasini kuchaytirish chora-tadbirlari to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2022-03-10",
    number: "110",
    title: {
      en: "Resolution of the Cabinet of Ministers «On measures to develop tourism and the infrastructure of cultural heritage objects in 2022»",
      ru: "Постановление Кабинета Министров «О мерах по развитию туризма и инфраструктуры объектов культурного наследия в 2022 году»",
      uz: "Vazirlar Mahkamasining «2022-yilda turizm va madaniy meros obyektlari infratuzilmasini rivojlantirish chora-tadbirlari to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2022-05-27",
    number: "PP-261",
    title: {
      en: "Resolution of the President of the Republic of Uzbekistan «On measures to develop services in museums»",
      ru: "Постановление Президента Республики Узбекистан «О мерах по развитию сферы услуг в музеях»",
      uz: "O‘zbekiston Respublikasi Prezidentining «Muzeylarda xizmatlar sohasini rivojlantirish chora-tadbirlari to‘g‘risida»gi qarori",
    },
  },
  {
    date: "2023-09-11",
    number: "PF-158",
    title: {
      en: "Decree of the President of the Republic of Uzbekistan «On the Uzbekistan-2030 Strategy»",
      ru: "Указ Президента Республики Узбекистан «О Стратегии «Узбекистан-2030»»",
      uz: "O‘zbekiston Respublikasi Prezidentining «O‘zbekiston – 2030 strategiyasi to‘g‘risida»gi farmoni",
    },
  },
];

function EntryRow({ entry, locale }: { entry: Entry; locale: Locale }) {
  return (
    <article style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, padding: "20px 0", borderTop: "1px solid rgba(216,185,120,.10)" }}>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 500,
            fontSize: 17,
            color: "#FBF5E8",
            lineHeight: 1.3,
          }}
        >
          {entry.authors}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 17,
            color: "#d8c79c",
            lineHeight: 1.4,
            marginBottom: 8,
          }}
        >
          {entry.title[locale]}
        </div>
        <div style={{ fontSize: 14, color: "#b9bccb", lineHeight: 1.65, maxWidth: 680 }}>
          {entry.meta[locale]}
        </div>
        {entry.note && (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "#8c90a6",
              marginTop: 10,
              padding: "10px 14px",
              borderLeft: "2px solid rgba(216,185,120,.3)",
              maxWidth: 680,
            }}
          >
            {entry.note[locale]}
          </div>
        )}
      </div>
    </article>
  );
}

export function SourcesView() {
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
        </header>

        <section style={{ marginBottom: 72 }}>
          <h2
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.75)",
              marginBottom: 16,
            }}
          >
            {PRIMARY_TITLE[locale]}
          </h2>
          <EntryRow entry={PRIMARY} locale={locale} />
        </section>

        <section style={{ marginBottom: 72 }}>
          <h2
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.75)",
              marginBottom: 16,
            }}
          >
            {LIT_TITLE[locale]}
          </h2>
          {LITERATURE.map((e) => (
            <EntryRow key={e.authors} entry={e} locale={locale} />
          ))}
        </section>

        <section>
          <h2
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.75)",
              marginBottom: 14,
            }}
          >
            {LEGAL_TITLE[locale]}
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#9aa0b5",
              marginBottom: 24,
              maxWidth: 640,
            }}
          >
            {LEGAL_LEAD[locale]}
          </p>
          {LEGAL.map((d, i) => (
            <article
              key={d.date}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 80px 1fr",
                gap: 18,
                padding: "16px 0",
                borderTop: "1px solid rgba(216,185,120,.10)",
                borderBottom:
                  i === LEGAL.length - 1
                    ? "1px solid rgba(216,185,120,.10)"
                    : undefined,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  color: "rgba(216,185,120,.85)",
                }}
              >
                {d.date}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  color: "#8c90a6",
                }}
              >
                № {d.number}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: "#d8d3c6", maxWidth: 680 }}>
                {d.title[locale]}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
