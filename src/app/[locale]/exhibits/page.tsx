export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ExhibitGrid } from "@/components/public/exhibit-grid"

export default async function ExhibitsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("exhibits")

  const exhibits = await prisma.exhibit.findMany({
    include: {
      translations: { where: { locale } },
      images: { orderBy: { order: "asc" }, take: 1 },
      category: { include: { translations: { where: { locale } } } },
      hall: { include: { translations: { where: { locale } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  const categories = await prisma.category.findMany({
    include: { translations: { where: { locale } } },
  })

  const halls = await prisma.hall.findMany({
    include: { translations: { where: { locale } } },
  })

  const periods = [
    ...new Set(exhibits.map((e) => e.period).filter(Boolean)),
  ] as string[]

  const serializedExhibits = exhibits.map((e) => ({
    id: e.id,
    slug: e.slug,
    period: e.period,
    material: e.material,
    featured: e.featured,
    categoryId: e.categoryId,
    hallId: e.hallId,
    name: e.translations[0]?.name ?? "",
    description: e.translations[0]?.description ?? "",
    imageUrl: e.images[0]?.url ?? null,
    imageAlt: e.images[0]?.alt ?? null,
    categoryName: e.category?.translations[0]?.name ?? null,
    hallName: e.hall?.translations[0]?.name ?? null,
  }))

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.translations[0]?.name ?? c.slug,
  }))

  const serializedHalls = halls.map((h) => ({
    id: h.id,
    name: h.translations[0]?.name ?? h.slug,
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <ExhibitGrid
        exhibits={serializedExhibits}
        categories={serializedCategories}
        halls={serializedHalls}
        periods={periods}
      />
    </div>
  )
}
