import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { GalleryGrid } from "./gallery-grid"
import { getCategoryLabel, getCategoryOrder } from "@/lib/gallery-categories"
import blurMap from "@/lib/gallery-blur.json"
import captionsMap from "@/lib/gallery-captions.json"
import { getGalleryImages } from "@/lib/static-data"

type BlurEntry = { width: number; height: number; blurDataURL: string }
const BLUR: Record<string, BlurEntry> = blurMap as Record<string, BlurEntry>
type Caption = { en: string; ru: string; uz: string }
const CAPTIONS: Record<string, Caption> = captionsMap as Record<string, Caption>

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("gallery")

  const images = getGalleryImages()

  const counts = new Map<string, number>()
  for (const img of images) {
    if (!img.category) continue
    counts.set(img.category, (counts.get(img.category) ?? 0) + 1)
  }

  const categories = Array.from(counts.entries())
    .map(([slug, count]) => ({
      slug,
      label: getCategoryLabel(slug, locale),
      count,
      order: getCategoryOrder(slug),
    }))
    .sort((a, b) => a.order - b.order)

  const loc = (locale === "ru" || locale === "uz" || locale === "en"
    ? locale
    : "en") as "en" | "ru" | "uz"

  const serializedImages = images.map((img) => {
    const meta = BLUR[img.url]
    const caption = CAPTIONS[img.url]
    return {
      id: img.id,
      url: img.url,
      alt: caption?.[loc] ?? img.alt ?? "",
      category: img.category ?? "",
      width: meta?.width ?? 1000,
      height: meta?.height ?? 1333,
      blurDataURL: meta?.blurDataURL ?? null,
    }
  })

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #161a2e 0%, #0c1018 55%, #07090f 100%)",
        color: "#F7EEDE",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mb-10 flex flex-col items-start gap-3 sm:mb-14">
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.78)",
            }}
          >
            Sitorai Mohi Xosa
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.05,
              margin: 0,
              color: "#F7EEDE",
            }}
          >
            {t("title")}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(247,238,222,.66)",
              maxWidth: 560,
              margin: 0,
            }}
          >
            {t("subtitle")}
          </p>
        </div>
        <Suspense>
          <GalleryGrid
            images={serializedImages}
            categories={categories}
            allLabel={t("all")}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  )
}
