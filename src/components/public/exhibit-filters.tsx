"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FilterProps {
  categories: { id: string; name: string }[]
  halls: { id: string; name: string }[]
  periods: string[]
  onFilter: (filters: {
    search: string
    categoryId: string
    hallId: string
    period: string
  }) => void
}

export function ExhibitFilters({
  categories,
  halls,
  periods,
  onFilter,
}: FilterProps) {
  const t = useTranslations("exhibits")
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [hallId, setHallId] = useState("")
  const [period, setPeriod] = useState("")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilter({ search: value, categoryId, hallId, period })
  }

  const handleCategoryChange = (value: string | null) => {
    const v = value === "all" ? "" : value ?? ""
    setCategoryId(v)
    onFilter({ search, categoryId: v, hallId, period })
  }

  const handleHallChange = (value: string | null) => {
    const v = value === "all" ? "" : value ?? ""
    setHallId(v)
    onFilter({ search, categoryId, hallId: v, period })
  }

  const handlePeriodChange = (value: string | null) => {
    const v = value === "all" ? "" : value ?? ""
    setPeriod(v)
    onFilter({ search, categoryId, hallId, period: v })
  }

  const clearFilters = () => {
    setSearch("")
    setCategoryId("")
    setHallId("")
    setPeriod("")
    onFilter({ search: "", categoryId: "", hallId: "", period: "" })
  }

  const hasActiveFilters = search || categoryId || hallId || period

  return (
    <div className="space-y-4">
      {/* Search bar - full width */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter row - stack on mobile, inline on desktop */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={categoryId || undefined}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={hallId || undefined}
          onValueChange={handleHallChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("allHalls")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allHalls")}</SelectItem>
            {halls.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {periods.length > 0 && (
          <Select
            value={period || undefined}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("allPeriods")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allPeriods")}</SelectItem>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 self-start sm:self-auto"
          >
            <X className="h-4 w-4" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  )
}
