"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

type Exhibit = {
  id: string
  slug: string
  period: string | null
  material: string | null
  featured: boolean
  categoryId: string | null
  hallId: string | null
  name: string
  description: string
  imageUrl: string | null
  imageAlt: string | null
  categoryName: string | null
  hallName: string | null
}

type Props = {
  exhibits: Exhibit[]
  categories: { id: string; name: string }[]
  halls: { id: string; name: string }[]
  periods: string[]
}

export function ExhibitsClient({
  exhibits,
  categories,
  halls,
  periods,
}: Props) {
  const t = useTranslations("exhibits")
  const tc = useTranslations("common")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [hallFilter, setHallFilter] = useState("")
  const [periodFilter, setPeriodFilter] = useState("")

  const filtered = useMemo(() => {
    return exhibits.filter((e) => {
      const matchesSearch =
        !search || e.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        !categoryFilter || e.categoryId === categoryFilter
      const matchesHall = !hallFilter || e.hallId === hallFilter
      const matchesPeriod = !periodFilter || e.period === periodFilter
      return matchesSearch && matchesCategory && matchesHall && matchesPeriod
    })
  }, [exhibits, search, categoryFilter, hallFilter, periodFilter])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={hallFilter}
          onChange={(e) => setHallFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">{t("allHalls")}</option>
          {halls.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">{t("allPeriods")}</option>
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {tc("noResults")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exhibit) => (
            <Link
              key={exhibit.id}
              href={`/exhibits/${exhibit.slug}`}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {exhibit.imageUrl ? (
                    <img
                      src={exhibit.imageUrl}
                      alt={exhibit.imageAlt || exhibit.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                      <span className="text-4xl text-muted-foreground/30">
                        &#9733;
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="space-y-2 pt-4">
                  <h3 className="line-clamp-2 font-semibold leading-tight">
                    {exhibit.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exhibit.categoryName && (
                      <Badge variant="secondary">{exhibit.categoryName}</Badge>
                    )}
                    {exhibit.period && (
                      <Badge variant="outline">{exhibit.period}</Badge>
                    )}
                  </div>
                  {exhibit.hallName && (
                    <p className="text-xs text-muted-foreground">
                      {t("hall")}: {exhibit.hallName}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
