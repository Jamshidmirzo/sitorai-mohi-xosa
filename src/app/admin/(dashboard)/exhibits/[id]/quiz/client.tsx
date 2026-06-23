"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  List,
  Type,
  Languages,
  Lightbulb,
  ArrowDown,
} from "lucide-react"
import { toast } from "sonner"
import { useAdminT } from "@/components/admin/admin-locale"

const LOCALES = ["en", "ru", "uz"] as const
type Locale = (typeof LOCALES)[number]
const LANG: Record<Locale, string> = { en: "English", ru: "Русский", uz: "O‘zbek" }

type Translation = {
  locale: string
  q: string
  options: string[]
  answerText: string | null
  explain: string
}
type Question = {
  id: string
  type: "choice" | "text"
  order: number
  correctIndex: number | null
  accept: string[]
  translations: Translation[]
}

type LocaleMap<T> = { en: T; ru: T; uz: T }
type Draft = {
  type: "choice" | "text"
  correctIndex: number
  accept: string
  optionCount: number
  translations: LocaleMap<{
    q: string
    options: string[]
    answerText: string
    explain: string
  }>
}

function emptyDraft(type: "choice" | "text" = "choice"): Draft {
  const optionCount = 4
  const empty = {
    q: "",
    options: Array.from({ length: optionCount }, () => ""),
    answerText: "",
    explain: "",
  }
  return {
    type,
    correctIndex: 0,
    accept: "",
    optionCount,
    translations: {
      en: { ...empty, options: [...empty.options] },
      ru: { ...empty, options: [...empty.options] },
      uz: { ...empty, options: [...empty.options] },
    },
  }
}

function questionToDraft(q: Question): Draft {
  const get = (loc: Locale) =>
    q.translations.find((t) => t.locale === loc) ?? null
  const optionCount =
    q.type === "choice"
      ? Math.max(...LOCALES.map((l) => get(l)?.options?.length ?? 0), 2)
      : 4
  const pad = (arr: string[]) => {
    const out = [...arr]
    while (out.length < optionCount) out.push("")
    return out.slice(0, optionCount)
  }
  return {
    type: q.type,
    correctIndex: q.correctIndex ?? 0,
    accept: q.accept.join(", "),
    optionCount,
    translations: {
      en: {
        q: get("en")?.q ?? "",
        options: pad(get("en")?.options ?? []),
        answerText: get("en")?.answerText ?? "",
        explain: get("en")?.explain ?? "",
      },
      ru: {
        q: get("ru")?.q ?? "",
        options: pad(get("ru")?.options ?? []),
        answerText: get("ru")?.answerText ?? "",
        explain: get("ru")?.explain ?? "",
      },
      uz: {
        q: get("uz")?.q ?? "",
        options: pad(get("uz")?.options ?? []),
        answerText: get("uz")?.answerText ?? "",
        explain: get("uz")?.explain ?? "",
      },
    },
  }
}

function draftToPayload(d: Draft) {
  return {
    type: d.type,
    correctIndex: d.type === "choice" ? d.correctIndex : null,
    accept:
      d.type === "text"
        ? d.accept
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
        : [],
    translations: LOCALES.map((loc) => ({
      locale: loc,
      q: d.translations[loc].q,
      // Hard-truncate to the current optionCount so changing 4→2 actually
      // wipes the 3rd and 4th option even if they linger in state.
      options:
        d.type === "choice"
          ? d.translations[loc].options.slice(0, d.optionCount)
          : [],
      answerText: d.type === "text" ? d.translations[loc].answerText : null,
      explain: d.translations[loc].explain,
    })),
  }
}

function countFilledLanguages(d: Draft) {
  return LOCALES.reduce((n, loc) => {
    const tr = d.translations[loc]
    const hasQ = tr.q.trim().length > 0
    return n + (hasQ ? 1 : 0)
  }, 0)
}

export function QuizManagerClient({ exhibitId }: { exhibitId: string }) {
  const router = useRouter()
  const { t } = useAdminT()
  const [exhibitName, setExhibitName] = useState<string>("")
  const [items, setItems] = useState<Question[]>([])
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [newDraft, setNewDraft] = useState<Draft>(emptyDraft())
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [exRes, qsRes] = await Promise.all([
        fetch(`/api/exhibits/${exhibitId}`),
        fetch(`/api/exhibits/${exhibitId}/quiz`),
      ])
      if (exRes.ok) {
        const ex = await exRes.json()
        const en = ex.translations?.find(
          (t: { locale: string; name: string }) => t.locale === "en",
        )
        setExhibitName(en?.name ?? ex.slug ?? "")
      }
      if (qsRes.ok) {
        const qs = (await qsRes.json()) as Question[]
        setItems(qs)
        const map: Record<string, Draft> = {}
        for (const q of qs) map[q.id] = questionToDraft(q)
        setDrafts(map)
      }
    } finally {
      setLoading(false)
    }
  }, [exhibitId])

  useEffect(() => {
    void load()
  }, [load])

  async function addQuestion() {
    setBusyId("new")
    try {
      const res = await fetch(`/api/exhibits/${exhibitId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(newDraft)),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.error ?? t("quiz.saveFailed"))
        return
      }
      toast.success(t("quiz.saved"))
      setNewDraft(emptyDraft())
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function saveQuestion(id: string) {
    setBusyId(id)
    try {
      const d = drafts[id]
      const res = await fetch(`/api/quiz/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(d)),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.error ?? t("quiz.saveFailed"))
        return
      }
      toast.success(t("quiz.saved"))
      setExpanded((e) => ({ ...e, [id]: false }))
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function deleteQuestion(id: string) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/quiz/${id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error(t("quiz.deleteFailed"))
        return
      }
      toast.success(t("quiz.deleted"))
      await load()
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/exhibits")}
          className="mb-2 -ml-2"
        >
          <ChevronLeft className="size-4 mr-1" /> {t("quiz.back")}
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{t("quiz.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("quiz.subtitle", { name: exhibitName, count: items.length })}
        </p>
      </div>

      {/* How-to onboarding hint — always visible to make adding questions discoverable */}
      <Card className="border-amber-300/40 bg-gradient-to-br from-amber-50 via-amber-50/30 to-background dark:from-amber-950/30 dark:via-amber-950/10">
        <CardContent className="py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 p-2 mt-0.5">
              <Lightbulb className="size-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-medium">{t("quiz.howTo")}</div>
              <ol className="text-sm text-muted-foreground space-y-1.5 list-none">
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium shrink-0">
                    1
                  </span>
                  <span>{t("quiz.howToStep1")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium shrink-0">
                    2
                  </span>
                  <span>{t("quiz.howToStep2")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium shrink-0">
                    3
                  </span>
                  <span>{t("quiz.howToStep3")}</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {items.length === 0 && (
        <div className="text-center py-6">
          <Sparkles className="size-8 mx-auto text-muted-foreground/60 mb-2" />
          <p className="font-medium">{t("quiz.empty")}</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t("quiz.emptyHint")}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
            {t("quiz.hereIsTheForm")}
            <ArrowDown className="size-4 animate-bounce" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((q, i) => {
          const d = drafts[q.id] ?? questionToDraft(q)
          const isOpen = expanded[q.id] !== false && (expanded[q.id] === true || false)
          const filled = countFilledLanguages(d)
          return (
            <QuestionCard
              key={q.id}
              t={t}
              index={i + 1}
              draft={d}
              expanded={isOpen}
              onToggleExpand={() =>
                setExpanded((e) => ({ ...e, [q.id]: !isOpen }))
              }
              langCount={filled}
              onChange={(next) => setDrafts((dd) => ({ ...dd, [q.id]: next }))}
              onSave={() => saveQuestion(q.id)}
              onDelete={() => deleteQuestion(q.id)}
              saving={busyId === q.id}
            />
          )
        })}
      </div>

      {/* Add new question — emphasized as the primary action */}
      <Card className="border-2 border-amber-400/50 shadow-md">
        <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 border-b">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 size-9 flex items-center justify-center">
                <Plus className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("quiz.newTitle")}</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {t("quiz.emptyHint")}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={addQuestion}
              disabled={busyId === "new"}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            >
              {busyId === "new" ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Plus className="size-4 mr-2" />
              )}
              {t("quiz.add")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <QuestionEditor t={t} draft={newDraft} onChange={setNewDraft} />
        </CardContent>
      </Card>
    </div>
  )
}

type TFn = (key: string, vars?: Record<string, string | number>) => string

function QuestionCard({
  t,
  draft,
  index,
  expanded,
  onToggleExpand,
  langCount,
  onChange,
  onSave,
  onDelete,
  saving,
}: {
  t: TFn
  draft: Draft
  index: number
  expanded: boolean
  onToggleExpand: () => void
  langCount: number
  onChange: (d: Draft) => void
  onSave: () => void
  onDelete: () => void
  saving: boolean
}) {
  const preview = draft.translations.en.q || "—"
  const langFull = langCount === 3
  const TypeIcon = draft.type === "choice" ? List : Type
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="size-8 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-mono text-sm font-medium shrink-0">
              {index}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-tight truncate">{preview}</div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <TypeIcon className="size-3" />
                  {draft.type === "choice" ? t("quiz.typeChoice") : t("quiz.typeText")}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] gap-1 ${
                    langFull
                      ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                      : "border-amber-500/40 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  <Languages className="size-3" />
                  {langFull
                    ? t("quiz.statusFull")
                    : t("badges.langPartial", { filled: langCount })}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              aria-label={expanded ? t("quiz.collapse") : t("quiz.expand")}
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-4 mr-1" />
                  {t("quiz.collapse")}
                </>
              ) : (
                <>
                  <ChevronDown className="size-4 mr-1" />
                  {t("quiz.expand")}
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={saving}
                    aria-label={t("quiz.delete")}
                  />
                }
              >
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("quiz.deleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("quiz.deleteBody")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("ex.cancel")}</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onDelete}>
                    {t("quiz.delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <QuestionEditor t={t} draft={draft} onChange={onChange} />
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button onClick={onSave} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {t("quiz.save")}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function QuestionEditor({
  t,
  draft,
  onChange,
}: {
  t: TFn
  draft: Draft
  onChange: (d: Draft) => void
}) {
  const update = (patch: Partial<Draft>) => onChange({ ...draft, ...patch })
  const updateTr = (
    loc: Locale,
    patch: Partial<Draft["translations"]["en"]>,
  ) =>
    onChange({
      ...draft,
      translations: {
        ...draft.translations,
        [loc]: { ...draft.translations[loc], ...patch },
      },
    })

  const setOptionCount = (n: number) => {
    const next = Math.min(6, Math.max(2, n))
    const pad = (arr: string[]) => {
      const out = [...arr]
      while (out.length < next) out.push("")
      return out.slice(0, next)
    }
    onChange({
      ...draft,
      optionCount: next,
      correctIndex: Math.min(draft.correctIndex, next - 1),
      translations: {
        en: { ...draft.translations.en, options: pad(draft.translations.en.options) },
        ru: { ...draft.translations.ru, options: pad(draft.translations.ru.options) },
        uz: { ...draft.translations.uz, options: pad(draft.translations.uz.options) },
      },
    })
  }

  const changeType = (nextType: "choice" | "text") => {
    if (nextType === draft.type) return
    // Switching type? Wipe old options/answers in all 3 languages so they
    // don't leak back to the DB the next time the user saves.
    const blankPerLocale = {
      options: Array.from({ length: draft.optionCount }, () => ""),
      answerText: "",
    }
    onChange({
      ...draft,
      type: nextType,
      correctIndex: 0,
      accept: "",
      translations: {
        en: { ...draft.translations.en, ...blankPerLocale },
        ru: { ...draft.translations.ru, ...blankPerLocale },
        uz: { ...draft.translations.uz, ...blankPerLocale },
      },
    })
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Type selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <Label className="text-xs font-medium text-muted-foreground">
          {t("quiz.type")}
        </Label>
        <div className="inline-flex rounded-md border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => changeType("choice")}
            className={`px-3 py-1 text-sm rounded flex items-center gap-1.5 transition-colors ${
              draft.type === "choice"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="size-3.5" />
            {t("quiz.typeChoice")}
          </button>
          <button
            type="button"
            onClick={() => changeType("text")}
            className={`px-3 py-1 text-sm rounded flex items-center gap-1.5 transition-colors ${
              draft.type === "text"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Type className="size-3.5" />
            {t("quiz.typeText")}
          </button>
        </div>
        {draft.type === "choice" && (
          <>
            <Label className="text-xs font-medium text-muted-foreground ml-4">
              {t("quiz.optionCount")}
            </Label>
            <Input
              type="number"
              min={2}
              max={6}
              value={draft.optionCount}
              onChange={(e) => setOptionCount(Number(e.target.value))}
              className="w-20"
            />
          </>
        )}
      </div>

      {/* Accept list for text type */}
      {draft.type === "text" && (
        <div className="space-y-2">
          <Label>{t("quiz.accept")}</Label>
          <Input
            value={draft.accept}
            onChange={(e) => update({ accept: e.target.value })}
            placeholder={t("quiz.acceptPlaceholder")}
          />
        </div>
      )}

      <Tabs defaultValue="en">
        <TabsList>
          {LOCALES.map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {LANG[loc]}
              {draft.translations[loc].q.trim() && (
                <CheckCircle2 className="size-3 ml-1.5 text-emerald-500" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((loc) => (
          <TabsContent key={loc} value={loc} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t("quiz.q")}</Label>
              <Textarea
                value={draft.translations[loc].q}
                onChange={(e) => updateTr(loc, { q: e.target.value })}
                rows={2}
              />
            </div>

            {draft.type === "choice" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("quiz.options")}</Label>
                  <span className="text-xs text-muted-foreground">
                    {t("quiz.correctMark")}
                  </span>
                </div>
                <div className="space-y-2">
                  {draft.translations[loc].options.map((opt, i) => {
                    const isCorrect = i === draft.correctIndex
                    return (
                      <div
                        key={i}
                        className={`flex items-stretch rounded-md border overflow-hidden ${
                          isCorrect
                            ? "border-emerald-500/60 bg-emerald-500/5"
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => update({ correctIndex: i })}
                          className={`flex items-center justify-center w-12 shrink-0 border-r transition-colors ${
                            isCorrect
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                          }`}
                          aria-label={`${t("quiz.option")} ${String.fromCharCode(65 + i)}`}
                          title={
                            isCorrect
                              ? t("quiz.correctMark")
                              : t("quiz.option")
                          }
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <Circle className="size-4" />
                          )}
                        </button>
                        <div className="flex items-center px-3 text-sm font-medium w-10 shrink-0">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const next = [...draft.translations[loc].options]
                            next[i] = e.target.value
                            updateTr(loc, { options: next })
                          }}
                          className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {draft.type === "text" && (
              <div className="space-y-2">
                <Label>{t("quiz.answerText")}</Label>
                <Input
                  value={draft.translations[loc].answerText}
                  onChange={(e) =>
                    updateTr(loc, { answerText: e.target.value })
                  }
                  placeholder={t("quiz.answerTextHint")}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("quiz.explain")}</Label>
              <Textarea
                value={draft.translations[loc].explain}
                onChange={(e) => updateTr(loc, { explain: e.target.value })}
                rows={2}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
