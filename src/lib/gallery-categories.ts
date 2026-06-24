/// Single source of truth for gallery category metadata.
/// Used by the gallery page to render localized chip labels with museum numbers
/// and the active-category banner.
/// Slugs here must match GalleryImage.category values emitted by the seeders.

type TriLang = { en: string; ru: string; uz: string };

export type GalleryCategoryMeta = {
  slug: string;
  /// Museum / hall number — drives display order. 1 = first chip after "All".
  number: number;
  labels: TriLang;
  /// Short subtitle shown in the active-category banner (under the title).
  subtitle: TriLang;
};

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [
  {
    slug: "salomxona",
    number: 1,
    labels: {
      en: "Salomxona",
      ru: "Саломхона",
      uz: "Salomxona",
    },
    subtitle: {
      en: "Reception Palace · 1912–1914 · porcelain & silver",
      ru: "Дворец приёмов · 1912–1914 · фарфор и серебро",
      uz: "Qabulxona · 1912–1914 · chinni va kumush",
    },
  },
  {
    slug: "xonai-xasht",
    number: 2,
    labels: {
      en: "Xonai Xasht",
      ru: "Хонаи Хашт",
      uz: "Xonai Xasht",
    },
    subtitle: {
      en: "Eight-room Costume Hall · chapans, ikat, zarduzi",
      ru: "Восьмикомнатный зал костюма · чапаны, икат, зардузи",
      uz: "Sakkiz xonali kiyim zali · choponlar, ikat, zardo‘zlik",
    },
  },
  {
    slug: "harem",
    number: 3,
    labels: {
      en: "Harem",
      ru: "Гарем",
      uz: "Haram",
    },
    subtitle: {
      en: "Private quarters · Gijduvan ceramics & suzani",
      ru: "Личные покои · керамика Гиждувана и сюзане",
      uz: "Shaxsiy xonalar · G‘ijduvon sopol va suzani",
    },
  },
];

export function getCategoryLabel(slug: string, locale: string): string {
  const meta = GALLERY_CATEGORIES.find((c) => c.slug === slug);
  if (!meta) return slug;
  const loc = (locale as "en" | "ru" | "uz") in meta.labels ? (locale as "en" | "ru" | "uz") : "en";
  return meta.labels[loc];
}

export function getCategorySubtitle(slug: string, locale: string): string | null {
  const meta = GALLERY_CATEGORIES.find((c) => c.slug === slug);
  if (!meta) return null;
  const loc = (locale as "en" | "ru" | "uz") in meta.subtitle ? (locale as "en" | "ru" | "uz") : "en";
  return meta.subtitle[loc];
}

export function getCategoryOrder(slug: string): number {
  return GALLERY_CATEGORIES.find((c) => c.slug === slug)?.number ?? 999;
}
