export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { GalleryGrid } from "./gallery-grid"

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

  const categories = [
    ...new Set(images.map((img) => img.category).filter(Boolean)),
  ] as string[]

  const serializedImages = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt ?? "",
    category: img.category ?? "",
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <GalleryGrid images={serializedImages} categories={categories} />
    </div>
  )
}
