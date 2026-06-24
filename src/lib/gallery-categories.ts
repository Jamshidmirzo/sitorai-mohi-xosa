/// Single source of truth for gallery category metadata.
/// Used by the gallery page to render localized chip labels with museum numbers.
/// Slugs here must match GalleryImage.category values emitted by the seeders.

export type GalleryCategoryMeta = {
  slug: string;
  /// Museum / hall number — drives display order. 1 = first chip after "All".
  number: number;
  labels: { en: string; ru: string; uz: string };
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
  },
  {
    slug: "xonai-xasht",
    number: 2,
    labels: {
      en: "Xonai Xasht",
      ru: "Хонаи Хашт",
      uz: "Xonai Xasht",
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
  },
];

export function getCategoryLabel(slug: string, locale: string): string {
  const meta = GALLERY_CATEGORIES.find((c) => c.slug === slug);
  if (!meta) return slug;
  const loc = (locale as "en" | "ru" | "uz") in meta.labels ? (locale as "en" | "ru" | "uz") : "en";
  return meta.labels[loc];
}

export function getCategoryOrder(slug: string): number {
  return GALLERY_CATEGORIES.find((c) => c.slug === slug)?.number ?? 999;
}
