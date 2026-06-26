import { getTranslations, setRequestLocale } from "next-intl/server"
import { ExhibitGrid } from "@/components/public/exhibit-grid"
import {
  getExhibitsForLocale,
  getCategoriesForLocale,
  getHallsForLocale,
} from "@/lib/static-data"

export default async function ExhibitsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("exhibits")

  const exhibits = getExhibitsForLocale(locale)
  const categories = getCategoriesForLocale(locale)
  const halls = getHallsForLocale(locale)
  const periods = [...new Set(exhibits.map((e) => e.period).filter(Boolean))] as string[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <ExhibitGrid
        exhibits={exhibits}
        categories={categories}
        halls={halls}
        periods={periods}
      />
    </div>
  )
}
