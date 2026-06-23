"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExhibitFilters } from "./exhibit-filters"

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

interface Props {
  exhibits: Exhibit[]
  categories: { id: string; name: string }[]
  halls: { id: string; name: string }[]
  periods: string[]
}

export function ExhibitGrid({ exhibits, categories, halls, periods }: Props) {
  const t = useTranslations("exhibits")
  const tc = useTranslations("common")
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    hallId: "",
    period: "",
  })

  const filtered = useMemo(() => {
    return exhibits.filter((e) => {
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (
          !e.name.toLowerCase().includes(s) &&
          !(e.description || "").toLowerCase().includes(s)
        ) {
          return false
        }
      }
      if (filters.categoryId && e.categoryId !== filters.categoryId)
        return false
      if (filters.hallId && e.hallId !== filters.hallId) return false
      if (filters.period && e.period !== filters.period) return false
      return true
    })
  }, [exhibits, filters])

  return (
    <div className="space-y-6">
      <ExhibitFilters
        categories={categories}
        halls={halls}
        periods={periods}
        onFilter={setFilters}
      />

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{tc("noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((exhibit) => (
            <Link
              key={exhibit.id}
              href={`/exhibits/${exhibit.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
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
                <CardContent className="space-y-2 p-4">
                  <h3 className="line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {exhibit.name}
                  </h3>
                  {exhibit.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {exhibit.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {exhibit.categoryName && (
                      <Badge variant="secondary" className="text-xs">
                        {exhibit.categoryName}
                      </Badge>
                    )}
                    {exhibit.period && (
                      <Badge variant="outline" className="text-xs">
                        {exhibit.period}
                      </Badge>
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
