"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Save, RotateCcw, Globe } from "lucide-react"
import { toast } from "sonner"
import { useAdminT } from "@/components/admin/admin-locale"

type Locale = "en" | "ru" | "uz"
type FlatStrings = Record<string, string>

const LOCS: Locale[] = ["en", "ru", "uz"]
const LANG_LABEL: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O‘zbek",
}

// Group narrative.* keys into named sections for the editor UI.
const SECTIONS: { id: string; titleKey: string; prefixes: string[] }[] = [
  { id: "nav", titleKey: "Navigation", prefixes: ["narrative.nav."] },
  { id: "hero", titleKey: "Hero", prefixes: ["narrative.hero."] },
  { id: "story", titleKey: "Story", prefixes: ["narrative.story."] },
  { id: "hall", titleKey: "White Hall", prefixes: ["narrative.hall."] },
  { id: "collection", titleKey: "Collection", prefixes: ["narrative.collection."] },
  { id: "visit", titleKey: "Visit", prefixes: ["narrative.visit."] },
  { id: "detail", titleKey: "Exhibit Detail", prefixes: ["narrative.detail."] },
  { id: "quiz", titleKey: "Quiz", prefixes: ["narrative.quiz."] },
]

type Override = { key: string; locale: string; value: string }

export function LandingEditorClient({
  defaults,
}: {
  defaults: Record<Locale, FlatStrings>
}) {
  const { t } = useAdminT()
  const [overrides, setOverrides] = useState<Record<Locale, FlatStrings>>({
    en: {},
    ru: {},
    uz: {},
  })
  const [draft, setDraft] = useState<Record<Locale, FlatStrings>>({
    en: {},
    ru: {},
    uz: {},
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeLocale, setActiveLocale] = useState<Locale>("ru")

  // Fetch current overrides.
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/landing")
        if (!res.ok) return
        const rows = (await res.json()) as Override[]
        const map: Record<Locale, FlatStrings> = { en: {}, ru: {}, uz: {} }
        for (const r of rows) {
          if (LOCS.includes(r.locale as Locale)) {
            map[r.locale as Locale][r.key] = r.value
          }
        }
        setOverrides(map)
        setDraft({
          en: { ...map.en },
          ru: { ...map.ru },
          uz: { ...map.uz },
        })
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const allKeys = useMemo(() => Object.keys(defaults.en).sort(), [defaults])

  function valueFor(locale: Locale, key: string) {
    return draft[locale][key] ?? overrides[locale][key] ?? defaults[locale][key] ?? ""
  }

  function isOverridden(locale: Locale, key: string) {
    const draftValue = draft[locale][key]
    const savedOverride = overrides[locale][key]
    const defaultValue = defaults[locale][key] ?? ""
    if (draftValue !== undefined && draftValue !== defaultValue) return true
    if (savedOverride !== undefined && savedOverride !== defaultValue) return true
    return false
  }

  function isDirty(locale: Locale, key: string) {
    const d = draft[locale][key]
    if (d === undefined) return false
    const current = overrides[locale][key] ?? defaults[locale][key] ?? ""
    return d !== current
  }

  function setValue(locale: Locale, key: string, value: string) {
    setDraft((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }))
  }

  function revertKey(key: string) {
    setDraft((prev) => {
      const next = { ...prev }
      for (const loc of LOCS) {
        next[loc] = { ...next[loc], [key]: defaults[loc][key] ?? "" }
      }
      return next
    })
  }

  async function save() {
    setSaving(true)
    try {
      const patches: Override[] = []
      for (const loc of LOCS) {
        for (const [key, value] of Object.entries(draft[loc])) {
          const defaultValue = defaults[loc][key] ?? ""
          const savedOverride = overrides[loc][key]
          // Only patch if value differs from what's currently in DB (or default).
          if (value === (savedOverride ?? defaultValue)) continue
          // Empty (or equal to default) → DELETE override (revert).
          if (value === defaultValue || !value) {
            patches.push({ key, locale: loc, value: "" })
          } else {
            patches.push({ key, locale: loc, value })
          }
        }
      }
      if (patches.length === 0) {
        toast.info("No changes")
        return
      }
      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patches }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.error ?? "Failed to save")
        return
      }
      // Reload overrides post-save
      const fresh = await fetch("/api/landing").then((r) => r.json())
      const map: Record<Locale, FlatStrings> = { en: {}, ru: {}, uz: {} }
      for (const r of fresh as Override[]) {
        if (LOCS.includes(r.locale as Locale)) {
          map[r.locale as Locale][r.key] = r.value
        }
      }
      setOverrides(map)
      setDraft({ en: { ...map.en }, ru: { ...map.ru }, uz: { ...map.uz } })
      toast.success(`Saved ${patches.length} change(s)`)
    } finally {
      setSaving(false)
    }
  }

  const dirtyCount = useMemo(() => {
    let n = 0
    for (const loc of LOCS) {
      for (const key of Object.keys(draft[loc])) {
        if (isDirty(loc, key)) n++
      }
    }
    return n
  }, [draft, overrides, defaults])

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="size-6 text-muted-foreground" />
            Главная страница / Landing texts
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Тексты заголовков и абзацев публичной главной — на 3 языках. Пусто = вернуться к стандартному. Изменения видны на сайте сразу после сохранения.
          </p>
        </div>
        <Button onClick={save} disabled={saving || dirtyCount === 0} size="lg">
          {saving ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {t("exForm.submit")} {dirtyCount > 0 && `(${dirtyCount})`}
        </Button>
      </div>

      <Tabs
        value={activeLocale}
        onValueChange={(v) => setActiveLocale(v as Locale)}
      >
        <TabsList>
          {LOCS.map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {LANG_LABEL[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCS.map((loc) => (
          <TabsContent key={loc} value={loc} className="space-y-6 pt-4">
            {SECTIONS.map((sec) => {
              const sectionKeys = allKeys.filter((k) =>
                sec.prefixes.some((p) => k.startsWith(p)),
              )
              if (sectionKeys.length === 0) return null
              return (
                <Card key={sec.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{sec.titleKey}</CardTitle>
                    <CardDescription className="text-xs">
                      {sectionKeys.length} field(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sectionKeys.map((key) => {
                      const value = valueFor(loc, key)
                      const dirty = isDirty(loc, key)
                      const overridden = isOverridden(loc, key)
                      const shortLabel = key.replace(/^narrative\./, "")
                      const isLong = value.length > 80 || value.includes("\n")
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <Label
                              htmlFor={`${loc}-${key}`}
                              className="font-mono text-[11px] text-muted-foreground"
                            >
                              {shortLabel}
                            </Label>
                            <div className="flex items-center gap-2">
                              {overridden && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  Custom
                                </span>
                              )}
                              {dirty && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                                  Modified
                                </span>
                              )}
                              {overridden && (
                                <button
                                  type="button"
                                  onClick={() => revertKey(key)}
                                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                  title="Revert to default in all 3 languages"
                                >
                                  <RotateCcw className="size-3" />
                                  default
                                </button>
                              )}
                            </div>
                          </div>
                          {isLong ? (
                            <Textarea
                              id={`${loc}-${key}`}
                              value={value}
                              onChange={(e) => setValue(loc, key, e.target.value)}
                              rows={Math.min(8, Math.max(2, value.split("\n").length + 1))}
                              className={dirty ? "border-sky-500/50" : ""}
                            />
                          ) : (
                            <Input
                              id={`${loc}-${key}`}
                              value={value}
                              onChange={(e) => setValue(loc, key, e.target.value)}
                              className={dirty ? "border-sky-500/50" : ""}
                            />
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
