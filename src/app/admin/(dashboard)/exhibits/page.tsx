"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react"
import { QrCodeDialog } from "@/components/admin/qr-code-dialog"
import { useAdminT } from "@/components/admin/admin-locale"
import { toast } from "sonner"

interface Translation {
  locale: string
  name: string
  tag?: string | null
  story?: string | null
}
interface ExhibitImage {
  url: string
}
interface Exhibit {
  id: string
  slug: string
  period: string | null
  featured: boolean
  bg: string | null
  shot: string | null
  translations: Translation[]
  images: ExhibitImage[]
  category: { translations: { locale: string; name: string }[] } | null
  hall: { translations: { locale: string; name: string }[] } | null
}

function pickName(translations: Translation[] | undefined, locale: string) {
  if (!translations?.length) return "—"
  return (
    translations.find((t) => t.locale === locale)?.name ??
    translations.find((t) => t.locale === "en")?.name ??
    translations[0].name
  )
}

function filledLanguageCount(translations: Translation[] | undefined) {
  if (!translations?.length) return 0
  const LOCS = ["en", "ru", "uz"] as const
  return LOCS.reduce((n, loc) => {
    const tr = translations.find((t) => t.locale === loc)
    return n + (tr?.name && tr.name.trim() ? 1 : 0)
  }, 0)
}

export default function ExhibitsPage() {
  const { t, locale } = useAdminT()
  const [exhibits, setExhibits] = useState<Exhibit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchExhibits = useCallback(async (query?: string) => {
    setLoading(true)
    try {
      const url = query
        ? `/api/exhibits?search=${encodeURIComponent(query)}`
        : "/api/exhibits"
      const res = await fetch(url)
      if (res.ok) {
        setExhibits(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExhibits()
  }, [fetchExhibits])

  useEffect(() => {
    const timer = setTimeout(() => fetchExhibits(search), 300)
    return () => clearTimeout(timer)
  }, [search, fetchExhibits])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/exhibits/${id}`, { method: "DELETE" })
      if (res.ok) {
        setExhibits((prev) => prev.filter((e) => e.id !== id))
        toast.success(t("ex.delete"))
      } else {
        toast.error(t("exForm.saveFailed"))
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("ex.title")}</h1>
          <p className="text-muted-foreground">{t("ex.subtitle")}</p>
        </div>
        <Button render={<Link href="/admin/exhibits/new" />} className="self-start">
          <Plus className="mr-2 size-4" />
          {t("ex.add")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("ex.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : exhibits.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center bg-muted/30">
          <Sparkles className="size-8 mx-auto text-muted-foreground/60 mb-3" />
          <p className="text-muted-foreground">{t("ex.empty")}</p>
          <Button
            render={<Link href="/admin/exhibits/new" />}
            className="mt-4"
          >
            <Plus className="mr-2 size-4" />
            {t("ex.add")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exhibits.map((exhibit) => {
            const langCount = filledLanguageCount(exhibit.translations)
            const photo = exhibit.images[0]?.url
            const displayName = pickName(exhibit.translations, locale)
            const hall = exhibit.hall
              ? pickName(exhibit.hall.translations as Translation[], locale)
              : null
            return (
              <div
                key={exhibit.id}
                className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Visual top */}
                <div
                  className="relative h-44 overflow-hidden"
                  style={{
                    background:
                      exhibit.bg ??
                      "linear-gradient(155deg,#3a3322,#241f14 70%,#15120b)",
                  }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={displayName}
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = "none"
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {exhibit.featured && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-amber-950 border-0 gap-1">
                      <Sparkles className="size-3" />
                      {t("ex.featuredYes")}
                    </Badge>
                  )}
                  {!photo && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-[10px] gap-1"
                    >
                      <ImageIcon className="size-3" />
                      {t("badges.noPhoto")}
                    </Badge>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="font-semibold leading-tight line-clamp-2">
                      {displayName}
                    </div>
                    {hall && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {hall}
                      </div>
                    )}
                  </div>

                  {/* Language badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(["en", "ru", "uz"] as const).map((loc) => {
                      const filled =
                        exhibit.translations.find((tr) => tr.locale === loc)
                          ?.name?.trim() ?? ""
                      return (
                        <span
                          key={loc}
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            filled
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground/50 border border-dashed"
                          }`}
                          title={
                            filled
                              ? t("badges.langFull")
                              : t("ex.noStory")
                          }
                        >
                          {loc}
                        </span>
                      )
                    })}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {langCount === 3
                        ? t("badges.langFull")
                        : t("badges.langPartial", { filled: langCount })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        title={t("ex.edit")}
                        render={<Link href={`/admin/exhibits/${exhibit.id}/edit`} />}
                      >
                        <Pencil className="size-3.5 mr-1" />
                        {t("ex.edit")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        title={t("ex.openQuiz")}
                        render={<Link href={`/admin/exhibits/${exhibit.id}/quiz`} />}
                      >
                        <HelpCircle className="size-3.5 mr-1" />
                        {t("nav.quiz")}
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <QrCodeDialog
                        exhibitId={exhibit.id}
                        exhibitName={displayName}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              disabled={deleting === exhibit.id}
                              aria-label={t("ex.delete")}
                            />
                          }
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("ex.deleteTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("ex.deleteBody")} (&quot;{displayName}&quot;)
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("ex.cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(exhibit.id)}
                            >
                              {t("ex.delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
