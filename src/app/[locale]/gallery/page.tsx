export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { GalleryGrid } from "./gallery-grid"
import { getCategoryLabel, getCategoryOrder } from "@/lib/gallery-categories"
import blurMap from "@/lib/gallery-blur.json"

type BlurEntry = { width: number; height: number; blurDataURL: string }
const BLUR: Record<string, BlurEntry> = blurMap as Record<string, BlurEntry>

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("gallery")

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

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

  const serializedImages = images.map((img) => {
    const meta = BLUR[img.url]
    return {
      id: img.id,
      url: img.url,
      alt: img.alt ?? "",
      category: img.category ?? "",
      width: meta?.width ?? 1000,
      height: meta?.height ?? 1333,
      blurDataURL: meta?.blurDataURL ?? null,
    }
  })

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-2 sm:mb-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
          Sitorai Mohi Xosa
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </div>
      <GalleryGrid
        images={serializedImages}
        categories={categories}
        allLabel={t("all")}
        locale={locale}
      />
    </div>
  )
}
