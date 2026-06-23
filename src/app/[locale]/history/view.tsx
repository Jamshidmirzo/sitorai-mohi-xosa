"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

type Era = {
  year: string;
  ruler?: string;
  headline: Tri<string>;
  body: Tri<string>;
};

const TITLE: Tri<string> = {
  en: "A century of one palace",
  ru: "Век одного дворца",
  uz: "Bir saroyning bir asri",
};

const SUBTITLE: Tri<string> = {
  en: "From the first stones laid for an Emir to a state-protected museum",
  ru: "От первых камней эмирской усадьбы до государственного музея-заповедника",
  uz: "Amir uchun qoʻyilgan birinchi toshlardan davlat muhofazasidagi muzey-qoʻriqxonagacha",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const SOURCE_NOTE: Tri<string> = {
  en: "Source: master’s dissertation by Sh.K. Roziqulova on the museification of Sitorai Mohi Xossa (XX–XXI cc.), National Institute of Painting and Design named after K. Behzod, Tashkent, 2026.",
  ru: "Источник: магистерская диссертация Розикуловой Ш.К. о процессах музеефикации Ситораи Мохи Хосса (XX–XXI вв.), Национальный институт живописи и дизайна имени К. Бехзода, Ташкент, 2026.",
  uz: "Manba: Roʻziqulova Sh.K. magistrlik dissertatsiyasi — Sitorai Mohi Xossa muzeylashtirish jarayonlari (XX–XXI asrlar), K. Behzod nomidagi Milliy rassomlik va dizayn instituti, Toshkent, 2026.",
};

const ERAS: Era[] = [
  {
    year: "1826–1860",
    ruler: "Nasrulla-khan",
    headline: {
      en: "First stones",
      ru: "Первые камни",
      uz: "Dastlabki toshlar",
    },
    body: {
      en: "Under Amir Nasrulla-khan the site north of Bukhara is chosen and the engineering basis of a future palace is laid down. The country keeps internal stability while its foreign policy slides towards Russia — and Bukharan rulers begin to make their wealth visible through buildings.",
      ru: "При амире Насрулла-хане выбран участок к северу от Бухары и заложены инженерные основы будущего дворца. Страна сохраняет внутреннюю стабильность, но во внешней политике начинается сближение с Россией — и бухарские правители всё чаще делают своё могущество видимым через здания.",
      uz: "Amir Nasrulloxon davrida Buxoroning shimolida hudud tanlanadi va boʻlajak saroyning muhandislik asoslari qoʻyiladi. Mamlakat ichki barqarorlikni saqlab turadi, biroq tashqi siyosatda Rossiya bilan munosabatlar yaqinlashadi — buxoro hukmdorlari oʻz qudratini binolar orqali namoyon qila boshlaydi.",
    },
  },
  {
    year: "1885–1910",
    ruler: "Abdulahad Bahodir-khan",
    headline: {
      en: "The palace takes form",
      ru: "Дворец обретает форму",
      uz: "Saroy oʻz qiyofasini topadi",
    },
    body: {
      en: "Amir Abdulahad Bahodir-khan turns the modest residence into a full complex. The main buildings, ayvans, rose gardens and courtyards rise; the two marble lions at the entrance — carved from Nurata stone — are commissioned by local masters. European volume meets Bukharan ornament, and the place is given its name: Sitorai Mohi Xosa — “the palace of a star resembling the moon”.",
      ru: "Амир Абдулахад Бахадур-хан превращает скромную резиденцию в полноценный комплекс. Возводятся основные здания, айваны, розарии и дворики; у входа местные мастера высекают двух мраморных львов из нуратского камня. Европейская объёмность встречается с бухарским орнаментом — и место получает имя: Ситораи Мохи Хоса, «дворец звезды, подобной луне».",
      uz: "Amir Abdulahad Bahodirxon oddiy qarorgohni toʻliq majmuaga aylantiradi. Asosiy binolar, ayvonlar, gulzorlar va hovlilar qad rostlaydi; kiraverishdagi ikkita marmar sher — Nurota toshidan — mahalliy ustalar tomonidan yoʻniladi. Yevropacha hajm Buxoro naqshlari bilan birlashadi va joy oʻz nomini oladi: Sitorai Mohi Xosa — «oyga oʻxshash yulduz saroyi».",
    },
  },
  {
    year: "1912–1914",
    ruler: "Sayyid Olim-khan",
    headline: {
      en: "The White Hall",
      ru: "Белый зал",
      uz: "Oq Zal",
    },
    body: {
      en: "Two years of carving by Usto Shirin Muradov and thirty masters. Mirror set into ganch multiplies a single candle into forty reflections. Outside in the Banquet Hall, Bukharan carvers Abdulla G‘afurov and Qori Cho‘bin work the figured ceiling; German fireplaces are installed, a Russian cabinet with Venetian glass arrives. Master architect Mirzo Ustomiddin Sarkor signs off on the whole structure.",
      ru: "Два года резьбы Усто Ширина Мурадова и тридцати мастеров. Зеркало в ганчевой решётке умножает одну свечу в сорок отражений. В Банкетном зале бухарские резчики Абдулла Гафуров и Кари Чубин работают фигурный потолок; устанавливают немецкие печи, прибывает российский шкаф с венецианским стеклом. Под общим руководством мастера-архитектора Мирзо Устомиддина Саркора.",
      uz: "Usto Shirin Murodov va oʻttiz ustaning ikki yillik oʻyma ishi. Ganchga oʻrnatilgan oyna bir shamning yorugʻini qirq aksga koʻpaytiradi. Ziyofat zalida buxorolik oʻymakorlar Abdulla Gʻafurov va Qori Choʻbin figurali shiftni ishlaydi; nemis pechlari oʻrnatiladi, Venetsiya shishali rus javoni keladi. Hammasiga me'mor Mirzo Ustomiddin Sarkor rahbarlik qiladi.",
    },
  },
  {
    year: "1917",
    headline: {
      en: "The last reception",
      ru: "Последний приём",
      uz: "Soʻnggi qabul",
    },
    body: {
      en: "Six hundred candles, no electric light. The Emir’s photographer Sergei Prokudin-Gorsky says afterwards he has never seen a room so full of light from so few sources. Three years later the emirate is gone.",
      ru: "Шестьсот свечей, без электрического света. Фотограф эмира Сергей Прокудин-Горский потом скажет, что никогда не видел комнаты, в которой столько света исходило бы из такого малого числа источников. Через три года эмират прекратит существование.",
      uz: "Olti yuz sham, elektr yoʻq. Amirning fotografi Sergey Prokudin-Gorskiy keyin: «Men hech qachon shuncha oz manbadan shuncha yorugʻ boʻlgan xonani koʻrmaganman», deydi. Uch yildan keyin amirlik tamom boʻladi.",
    },
  },
  {
    year: "1920",
    headline: {
      en: "The emirate ends",
      ru: "Конец эмирата",
      uz: "Amirlik tugaydi",
    },
    body: {
      en: "On 2 September 1920 the rule of Sayyid Olim-khan formally ends. The palace is closed, the inventory drawn up. Usto Shirin Muradov refuses to flee with the Emir to Afghanistan and stays.",
      ru: "2 сентября 1920 года формально завершается правление Саида Олим-хана. Дворец закрывают, имущество описывают. Усто Ширин Мурадов отказывается бежать с эмиром в Афганистан и остаётся.",
      uz: "1920-yil 2-sentyabrda Sayyid Olimxonning hukmronligi rasman tugaydi. Saroy yopiladi, ashyolar roʻyxatga olinadi. Usto Shirin Murodov amir bilan Afgʻonistonga qochib ketishni rad etib, oʻz yurtida qoladi.",
    },
  },
  {
    year: "1922",
    headline: {
      en: "Bukhara’s first museum",
      ru: "Первый бухарский музей",
      uz: "Buxoroning birinchi muzeyi",
    },
    body: {
      en: "On 8 November 1922 the city’s first official museum opens in the former Russo-Chinese bank building — Bukhara State Museum. The proposal at the opening: name it after Qori Yoʻldosh. Five rooms, a theatre, a library and a club share the building.",
      ru: "8 ноября 1922 года в здании бывшего Русско-Китайского банка открывается первый официальный музей города — Бухарский государственный музей. На церемонии открытия звучит предложение: назвать его именем Кари Юлдоша. Пять залов, театр, библиотека и клуб делят здание.",
      uz: "1922-yil 8-noyabrda sobiq Rus-Xitoy banki binosida shahar birinchi rasmiy muzeyi — Buxoro davlat muzeyi ochiladi. Ochilish marosimida muzeyni Qori Yoʻldosh nomi bilan atash taklif qilinadi. Besh xona, teatr, kutubxona va klub bir binoda joylashadi.",
    },
  },
  {
    year: "1931",
    headline: {
      en: "The palace becomes a museum",
      ru: "Дворец становится музеем",
      uz: "Saroy muzeyga aylanadi",
    },
    body: {
      en: "Sitorai Mohi Xosa begins life as a museum. The garden is partially turned into a sanatorium. The household goods, jewellery and ethnographic objects of the Emir’s court — those that survived inventory — go on display for a public visiting where their owners once banqueted.",
      ru: "Ситораи Мохи Хоса начинает работать как музей. Часть бога превращают в санаторий. Утварь, ювелирные изделия и этнографические предметы эмирского двора — те, что пережили инвентаризацию, — выставляют для публики там, где когда-то пировали их владельцы.",
      uz: "Sitorai Mohi Xosa muzey sifatida faoliyat boshlaydi. Bogʻning bir qismi sanatoriyga aylantiriladi. Amir saroyining roʻzgʻor buyumlari, zargarlik va etnografik ashyolar — roʻyxatdan oʻtganlari — egalari ziyofat qilgan joylarda omma uchun namoyish etiladi.",
    },
  },
  {
    year: "1937",
    headline: {
      en: "Vinogradov’s drawings",
      ru: "Чертежи Виноградова",
      uz: "Vinogradov chizmalari",
    },
    body: {
      en: "Architect-restorer Vinogradov, an academician, draws the palace sheet by sheet — walls of two and one storeys, the deep niches and ayvans, the carved ceilings. His blueprints become the reference document for every restoration that follows.",
      ru: "Архитектор-реставратор академик Виноградов чертит дворец лист за листом — стены в два и один этаж, глубокие ниши и айваны, резные потолки. Его чертежи станут эталонным документом для каждой последующей реставрации.",
      uz: "Akademik me'mor-restavrator Vinogradov saroyni varaq-varaq qilib chizadi — ikki va bir qavatli devorlar, chuqur tokchalar va ayvonlar, oʻyilgan shiftlar. Uning chizmalari bundan keyingi har bir restavratsiya uchun mezon hujjat boʻladi.",
    },
  },
  {
    year: "1983",
    headline: {
      en: "Museum-reserve status",
      ru: "Статус музея-заповедника",
      uz: "Muzey-qoʻriqxona maqomi",
    },
    body: {
      en: "By resolution of the Council of Ministers of the Uzbek SSR (16 May 1983, No. 308), the museum becomes the Bukhara State Historical-Architectural Museum-Reserve. More than a thousand cultural monuments and 603 state-protected objects fall under its care.",
      ru: "Постановлением Совета Министров Узбекской ССР от 16 мая 1983 года № 308 музей получает наименование «Бухарский государственный историко-архитектурный музей-заповедник». В его ведение переходят более тысячи памятников культуры и 603 объекта государственной охраны.",
      uz: "Oʻzbekiston SSR Vazirlar Kengashining 1983-yil 16-maydagi 308-sonli qarori bilan muzey «Buxoro davlat tarixiy-meʼmorchilik muzey-qoʻriqxonasi» nomini oladi. Uning tarkibiga 1000 dan ortiq madaniy yodgorlik va 603 ta davlat muhofazasidagi obyekt kiritiladi.",
    },
  },
  {
    year: "2017",
    headline: {
      en: "A new chapter",
      ru: "Новая глава",
      uz: "Yangi sahifa",
    },
    body: {
      en: "President Mirziyoyev’s visit in March 2017 sets in motion a programme to expand Bukhara’s tourism potential and to restore the Ark citadel to its original form. By Resolution No. 975, the body becomes the “Bukhara State Museum-Reserve”. Today its collection holds more than 150 000 objects across 16 branches and 2 permanent exhibitions.",
      ru: "Визит президента Мирзиёева в марте 2017 года запускает программу расширения туристического потенциала Бухары и восстановления цитадели Арк в её первоначальном виде. Постановлением Кабмина № 975 структура переименовывается в «Бухарский государственный музей-заповедник». Сегодня в её собрании — более 150 000 экспонатов в 16 филиалах и двух постоянных экспозициях.",
      uz: "Prezident Mirziyoyevning 2017-yil mart oyidagi tashrifi Buxoro turizm salohiyatini kengaytirish va Ark qoʻrgʻonini asl koʻrinishida tiklash dasturini boshlab beradi. Vazirlar Mahkamasining 975-sonli qarori bilan tashkilot «Buxoro davlat muzey-qoʻriqxonasi» nomini oladi. Bugungi kunda uning saqlovida 16 ta filial va 2 doimiy ekspozitsiyada 150 mingdan ortiq eksponat saqlanmoqda.",
    },
  },
];

export function HistoryView() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, var(--mid) 0%, var(--mid2) 100%)",
        color: "#F3ECDD",
        paddingTop: 56,
        paddingBottom: 96,
      }}
    >
      {/* twinkle stars sprinkle */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          { left: "8%", top: "6%", size: 2, delay: ".2s" },
          { left: "84%", top: "10%", size: 3, delay: "1.1s" },
          { left: "12%", top: "30%", size: 2, delay: ".7s" },
          { left: "90%", top: "55%", size: 2, delay: "1.8s" },
          { left: "62%", top: "80%", size: 3, delay: ".4s" },
        ].map((st, i) => (
          <span
            key={i}
            className="wtwk"
            style={{
              position: "absolute",
              left: st.left,
              top: st.top,
              width: st.size,
              height: st.size,
              borderRadius: "50%",
              background: "#f4e9cf",
              animationDelay: st.delay,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 920,
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top bar */}
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

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.85)",
              marginBottom: 18,
            }}
          >
            1826 — 2026
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.04,
              color: "#FBF5E8",
              margin: 0,
              letterSpacing: ".01em",
            }}
          >
            {TITLE[locale]}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.7vw, 20px)",
              color: "#d8c79c",
              marginTop: 22,
              maxWidth: 640,
              marginInline: "auto",
            }}
          >
            {SUBTITLE[locale]}
          </p>
        </header>

        {/* Timeline */}
        <div
          style={{
            position: "relative",
            paddingLeft: 32,
            borderLeft: "1px solid rgba(216,185,120,.22)",
          }}
        >
          {ERAS.map((era, i) => (
            <article
              key={era.year}
              style={{
                position: "relative",
                paddingBottom: i === ERAS.length - 1 ? 0 : 56,
              }}
            >
              {/* dot */}
              <span
                style={{
                  position: "absolute",
                  left: -41,
                  top: 8,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #D8B978, #8a6520 70%)",
                  boxShadow:
                    "0 0 0 4px rgba(14,22,48,1), 0 0 18px rgba(216,185,120,.45)",
                }}
              />

              {/* year + ruler */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 500,
                    fontSize: 30,
                    color: "#FBF5E8",
                    letterSpacing: ".01em",
                  }}
                >
                  {era.year}
                </div>
                {era.ruler && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      color: "rgba(216,185,120,.75)",
                    }}
                  >
                    {era.ruler}
                  </span>
                )}
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 500,
                  fontSize: 24,
                  color: "#F3ECDD",
                  marginTop: 6,
                  marginBottom: 14,
                }}
              >
                {era.headline[locale]}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.78,
                  color: "#b9bccb",
                  maxWidth: 640,
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {era.body[locale]}
              </p>
            </article>
          ))}
        </div>

        {/* Source colophon */}
        <p
          style={{
            marginTop: 80,
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
          {SOURCE_NOTE[locale]}
        </p>
      </div>
    </div>
  );
}
