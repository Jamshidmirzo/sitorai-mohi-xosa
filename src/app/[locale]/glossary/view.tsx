"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

const HEAD: Tri<string> = {
  en: "Glossary of museum-studies terms",
  ru: "Глоссарий музееведческих терминов",
  uz: "Muzeyshunoslik atamalari lugʻati",
};

const SUB: Tri<string> = {
  en: "A working vocabulary — what curators, conservators and museologists mean when they use these words. Definitions follow the dissertation.",
  ru: "Рабочий словарь — что кураторы, реставраторы и музеологи имеют в виду, когда используют эти слова. Определения по диссертации.",
  uz: "Ish lugʻati — kuratorlar, restavratorlar va muzeologlar bu soʻzlarni ishlatganida nimani nazarda tutadi. Taʼriflar dissertatsiyaga muvofiq.",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const SOURCE: Tri<string> = {
  en: "Source: Roziqulova Sh. K., master’s dissertation glossary, K. Behzod NRDI, 2026.",
  ru: "Источник: Розикулова Ш.К., глоссарий магистерской диссертации, НИЖиД им. К. Бехзода, 2026.",
  uz: "Manba: Roʻziqulova Sh. K., magistrlik dissertatsiyasi lugʻati, K. Behzod NRDI, 2026.",
};

type Term = {
  word: Tri<string>;
  def: Tri<string>;
};

const TERMS: Term[] = [
  {
    word: {
      en: "Conservation",
      ru: "Консервация",
      uz: "Konservatsiya",
    },
    def: {
      en: "The set of measures that ensure works of art, archaeological materials, archive documents and other museum objects are preserved in stable condition over long timescales. Temperature and humidity must be held constant; light and ventilation regulated; dust and insects kept out. Conservation is inseparable from museum restoration.",
      ru: "Совокупность мер по обеспечению долговременной сохранности произведений искусства, археологических материалов, архивных документов и других музейных предметов. Температура и влажность должны быть постоянными; свет и вентиляция — нормированными; пыль и насекомые не допускаются. Консервация неотделима от музейной реставрации.",
      uz: "San’at asarlari, arxeologik materiallar, arxiv hujjatlari va boshqa muzey buyumlarini uzoq vaqt yaxshi saqlash chora-tadbirlari. Harorat va havoning namligi doimo bir xil; yorug‘lik va ventilyatsiya bir me’yorda; chang va hasharotlar kirishiga yo‘l qo‘yilmasligi kerak. Konservatsiya muzeydagi ta’mirlash ishlari bilan uzviy bog‘liq.",
    },
  },
  {
    word: { en: "Complex (Majmua)", ru: "Комплекс (Маджмуа)", uz: "Majmua" },
    def: {
      en: "A historically formed cluster of monuments, buildings or structures whose mutual relationships with surrounding landscape carry historical, archaeological, architectural, aesthetic or socio-cultural value — including residential, religious, scientific, palace, trade, industrial works, painting, sculpture, decorative arts and architecture taken either separately or together. Sitorai Mohi Xossa is such a complex.",
      ru: "Исторически сложившаяся группа памятников, зданий или сооружений, чья взаимосвязь и связь с окружающим ландшафтом обладают исторической, археологической, архитектурной, эстетической или социально-культурной ценностью — жилые, религиозные, научные, дворцовые, торговые, производственные объекты, живопись, скульптура, прикладное искусство и архитектура отдельно или в сочетании. Ситораи Мохи Хосса — такой комплекс.",
      uz: "Tarixan tarkib topgan hududda aniq ko‘zga tashlanadigan, atrof manzarasi bilan umumiyligi yoki aloqadorligi tarixiy, arxeologik, me’moriy, estetik yoki ijtimoiy-madaniy qimmatga ega bo‘lgan, ijtimoiy, diniy, ilmiy, saroy, savdo, ishlab chiqarish ahamiyatiga molik hamda rassomlik, haykaltaroshlik, amaliy bezak san’ati va me’morlik asarlari bilan bog‘liqlikda alohida yoki o‘zaro birgalikda turgan yodgorliklar, imoratlar va inshootlar guruhlari. Sitorai Mohi Xossa — shunday majmua.",
    },
  },
  {
    word: { en: "Museum", ru: "Музей", uz: "Muzey" },
    def: {
      en: "A permanently operating cultural institution organised for the preservation, study and public display of museum objects and museum collections.",
      ru: "Постоянно действующее учреждение культуры, организованное для сохранения, изучения и публичного показа музейных предметов и музейных коллекций.",
      uz: "Muzey ashyolari va muzey kolleksiyalarini saqlash, oʻrganish hamda ommaga koʻrsatish uchun tashkil etilgan doimiy faoliyat yurituvchi madaniyat muassasasi.",
    },
  },
  {
    word: { en: "Museum object", ru: "Музейный предмет", uz: "Muzey ashyosi" },
    def: {
      en: "A monument whose particular qualities make its preservation and public display a public-interest matter.",
      ru: "Памятник, чьи особые свойства делают его сохранение и публичный показ делом общественного интереса.",
      uz: "Sifati yoki alohida belgilari jamiyat manfaatlari uchun saqlash va ommaga namoyish etish zaruratini taqozo etuvchi yodgorlik.",
    },
  },
  {
    word: { en: "Museum-reserve", ru: "Музей-заповедник", uz: "Muzey-qo‘riqxona" },
    def: {
      en: "An open-air museum that holds a living page of history within its historical-cultural and natural environment. The Bukhara State Museum-Reserve, of which Sitorai Mohi Xossa is one branch, is of this category.",
      ru: "Музей под открытым небом, удерживающий живую страницу истории в её историко-культурной и природной среде. Бухарский государственный музей-заповедник, одним из филиалов которого является Ситораи Мохи Хосса, относится к этой категории.",
      uz: "Tarixiy-madaniy va tabiiy muhitdagi jonli tarix sahifasini o‘zida aks ettiruvchi ochiq osmon muzeyi. Buxoro davlat muzey-qo‘riqxonasi — bu toifa, Sitorai Mohi Xossa uning bir filiali.",
    },
  },
  {
    word: { en: "Museum exposition", ru: "Музейная экспозиция", uz: "Muzey ekspozitsiyasi" },
    def: {
      en: "The display of a particular period or theme through museum objects. Composed and shown as a unified, purposeful sequence built on a scientific concept.",
      ru: "Подача конкретного периода или темы через музейные предметы. Композиция строится как целенаправленный, научно обоснованный ряд.",
      uz: "Muzey eksponatlari orqali ma’lum bir davr yoki mavzu taqdim qilinishi va namoyish etilishi. Bir maqsadga yo‘naltirilgan va ilmiy asoslangan konsepsiya asosida shakllantiriladi.",
    },
  },
  {
    word: { en: "Palace-museum", ru: "Дворец-музей", uz: "Muzey-saroy" },
    def: {
      en: "A historical-artistic museum organised on the basis of a palace ensemble inside or outside a city. The intact preservation and restoration of the architectural-artistic and decorative ensemble is the central task. Sitorai Mohi Xossa is exactly this kind of museum.",
      ru: "Историко-художественный музей, организованный на основе дворцового ансамбля в черте города или за его пределами. Главная задача — целостное сохранение и реставрация архитектурно-художественного и декоративного ансамбля. Ситораи Мохи Хосса — именно такой музей.",
      uz: "Shahar yoki shahar tashqarisida yaratilgan saroy ansambli asosida tashkil etilgan tarixiy-badiiy muzey. Me’moriy-badiiy va dekorativ ansamblni butunligicha saqlash va qayta tiklash markaziy vazifa. Sitorai Mohi Xossa aynan shu turdagi muzey.",
    },
  },
  {
    word: { en: "Museology", ru: "Музеология", uz: "Muzeyshunoslik (muzeologiya)" },
    def: {
      en: "The discipline studying the history and social functions of museums, the theory and methodology of museum work.",
      ru: "Дисциплина, изучающая историю и социальные функции музеев, теорию и методологию музейной работы.",
      uz: "Muzeylarning tarixi va ijtimoiy vazifalari, muzey ishining nazariyasi hamda uslubiyatini o‘rganadigan fan.",
    },
  },
  {
    word: { en: "Museification", ru: "Музеефикация", uz: "Muzeylashtirish" },
    def: {
      en: "A direction of museum work: the formation of historical-cultural or natural objects as the subject of museum exposition, undertaken to preserve and reveal their historical-cultural, scientific and artistic value to the maximum possible extent.",
      ru: "Направление музейной работы: формирование историко-культурных или природных объектов в качестве объекта музейной экспозиции с целью максимального сохранения и раскрытия их историко-культурной, научной и художественной ценности.",
      uz: "Muzey faoliyatining yo‘nalishi: tarixiy-madaniy yoki tabiiy obyektlarni muzey ekspozitsiyasi obyekti sifatida shakllantirish — ularning tarixiy-madaniy, ilmiy va badiiy qadriyatlarini maksimal darajada saqlab qolish va ochib berish maqsadida amalga oshiriladi.",
    },
  },
  {
    word: { en: "Replicas (mulyajlar)", ru: "Муляжи", uz: "Mulyajlar" },
    def: {
      en: "Exact reproductions that copy the volume, shape, colour and surface texture of an original. Built from precise measurements of the original, sometimes from drawings.",
      ru: "Точные копии, воспроизводящие объём, форму, цвет и фактуру оригинала. Изготавливаются по точным замерам, иногда по чертежам.",
      uz: "Asl nusxaning hajmini, shaklini, rangini va fakturasini aniq qilib takrorlaydi. Asl nusxa aniq o‘lchamlari, ba’zida esa chizmalari bo‘yicha yasaladi.",
    },
  },
  {
    word: { en: "Preservation", ru: "Сохранение", uz: "Saqlash" },
    def: {
      en: "The activity of creating the material and legal conditions under which the museum object and collection are kept in their original state.",
      ru: "Деятельность по созданию материальных и правовых условий для сохранения музейного предмета и музейной коллекции в исходном виде.",
      uz: "Muzeyning muzey ashyosi va muzey kolleksiyasi asl holatida saqlanishini ta’minlash uchun moddiy hamda huquqiy sharoitlar yaratilishini nazarda tutuvchi faoliyat turi.",
    },
  },
  {
    word: { en: "Restoration", ru: "Реставрация", uz: "Taʼmirlash" },
    def: {
      en: "Returning to its original state the parts of an artwork that have come off, broken or been damaged.",
      ru: "Восстановление до исходного состояния отвалившихся, сломанных или повреждённых частей произведения искусства.",
      uz: "San’at asarlarining uchgan, singan, buzilgan qismini tiklab, asl holiga keltirish.",
    },
  },
  {
    word: { en: "Exposition", ru: "Экспозиция", uz: "Ekspozitsiya" },
    def: {
      en: "Showing for view. Museum exposition is shaped on a purposeful and scientifically grounded concept, with artistic presentation harmonised with technical means of display.",
      ru: "Показ к просмотру. Музейная экспозиция формируется на целенаправленной и научно обоснованной концепции, где художественное оформление гармонировано с техническими средствами показа.",
      uz: "Tomosha qilish uchun namoyish etish. Muzey ekspozitsiyasi bir maqsadga yo‘naltirilgan va ilmiy asoslangan konsepsiya asosida shakllantiriladi. Unda badiiy jihatdan bezash texnik jihozlash bilan uyg‘unlashtiriladi.",
    },
  },
];

export function GlossaryView() {
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
      <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "0 32px" }}>
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

        <div>
          {TERMS.map((t, i) => (
            <article
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 28,
                padding: "26px 0",
                borderTop: "1px solid rgba(216,185,120,.10)",
                borderBottom: i === TERMS.length - 1 ? "1px solid rgba(216,185,120,.10)" : undefined,
                alignItems: "start",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 500,
                  fontSize: 22,
                  color: "#FBF5E8",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {t.word[locale]}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#b9bccb",
                  margin: 0,
                  textWrap: "pretty",
                  maxWidth: 640,
                }}
              >
                {t.def[locale]}
              </p>
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
