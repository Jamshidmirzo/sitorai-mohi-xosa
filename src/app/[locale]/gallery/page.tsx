export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { GalleryGrid } from "./gallery-grid"
import { getCategoryLabel, getCategoryOrder } from "@/lib/gallery-categories"

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

  const serializedImages = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt ?? "",
    category: img.category ?? "",
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col items-start gap-1 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t("subtitle")}</p>
      </div>
      <GalleryGrid
        images={serializedImages}
        categories={categories}
        allLabel={t("all")}
      />
    </div>
  )
}
