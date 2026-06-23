"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"

const locales = ["en", "ru", "uz"] as const
const localeLabels: Record<string, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbek",
}
const questionTypes = ["single", "multiple", "rating", "text"] as const
const questionTypeLabels: Record<string, string> = {
  single: "Single Choice",
  multiple: "Multiple Choice",
  rating: "Rating",
  text: "Free Text",
}

interface OptionTranslation {
  locale: string
  text: string
}

interface QuestionOption {
  id?: string
  order: number
  translations: OptionTranslation[]
}

interface QuestionTranslation {
  locale: string
  text: string
}

interface Question {
  id?: string
  type: string
  required: boolean
  order: number
  translations: QuestionTranslation[]
  options: QuestionOption[]
}

interface SurveyTranslation {
  locale: string
  title: string
  description: string
}

interface SurveyData {
  id: string
  active: boolean
  exhibitId: string | null
  translations: SurveyTranslation[]
  questions: (Question & {
    id: string
    options: (QuestionOption & { id: string })[]
  })[]
}

interface ExhibitOption {
  id: string
  translations: { locale: string; name: string }[]
}

function makeEmptyTranslations(): SurveyTranslation[] {
  return locales.map((locale) => ({ locale, title: "", description: "" }))
}

function makeEmptyQuestion(order: number): Question {
  return {
    type: "single",
    required: false,
    order,
    translations: locales.map((locale) => ({ locale, text: "" })),
    options: [makeEmptyOption(0)],
  }
}

function makeEmptyOption(order: number): QuestionOption {
  return {
    order,
    translations: locales.map((locale) => ({ locale, text: "" })),
  }
}

export function SurveyForm({ survey }: { survey?: SurveyData }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [active, setActive] = useState(survey?.active ?? true)
  const [exhibitId, setExhibitId] = useState(survey?.exhibitId ?? "")
  const [exhibits, setExhibits] = useState<ExhibitOption[]>([])
  const [translations, setTranslations] = useState<SurveyTranslation[]>(() => {
    if (survey?.translations?.length) {
      return locales.map((locale) => {
        const existing = survey.translations.find((t) => t.locale === locale)
        return {
          locale,
          title: existing?.title ?? "",
          description: existing?.description ?? "",
        }
      })
    }
    return makeEmptyTranslations()
  })
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (survey?.questions?.length) {
      return survey.questions
        .sort((a, b) => a.order - b.order)
        .map((q) => ({
          id: q.id,
          type: q.type,
          required: q.required,
          order: q.order,
          translations: locales.map((locale) => {
            const existing = q.translations.find((t) => t.locale === locale)
            return { locale, text: existing?.text ?? "" }
          }),
          options: q.options
            .sort((a, b) => a.order - b.order)
            .map((o) => ({
              id: o.id,
              order: o.order,
              translations: locales.map((locale) => {
                const existing = o.translations.find(
                  (t) => t.locale === locale,
                )
                return { locale, text: existing?.text ?? "" }
              }),
            })),
        }))
    }
    return [makeEmptyQuestion(0)]
  })

  useEffect(() => {
    fetch("/api/exhibits")
      .then((r) => r.json())
      .then(setExhibits)
      .catch(() => {})
  }, [])

  function updateTranslation(
    locale: string,
    field: "title" | "description",
    value: string,
  ) {
    setTranslations((prev) =>
      prev.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)),
    )
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, makeEmptyQuestion(prev.length)])
  }

  function removeQuestion(index: number) {
    setQuestions((prev) =>
      prev.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i })),
    )
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((prev) => {
      const next = [...prev]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= next.length) return prev
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next.map((q, i) => ({ ...q, order: i }))
    })
  }

  function updateQuestion<K extends keyof Question>(
    index: number,
    field: K,
    value: Question[K],
  ) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q
        const updated = { ...q, [field]: value }
        if (
          field === "type" &&
          (value === "single" || value === "multiple") &&
          updated.options.length === 0
        ) {
          updated.options = [makeEmptyOption(0)]
        }
        return updated
      }),
    )
  }

  function updateQuestionTranslation(
    qIndex: number,
    locale: string,
    text: string,
  ) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              translations: q.translations.map((t) =>
                t.locale === locale ? { ...t, text } : t,
              ),
            }
          : q,
      ),
    )
  }

  function addOption(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: [...q.options, makeEmptyOption(q.options.length)] }
          : q,
      ),
    )
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options
                .filter((_, j) => j !== oIndex)
                .map((o, j) => ({ ...o, order: j })),
            }
          : q,
      ),
    )
  }

  function updateOptionTranslation(
    qIndex: number,
    oIndex: number,
    locale: string,
    text: string,
  ) {
    setQuestions((prev) =>
      prev.map((q, qi) =>
        qi === qIndex
          ? {
              ...q,
              options: q.options.map((o, oi) =>
                oi === oIndex
                  ? {
                      ...o,
                      translations: o.translations.map((t) =>
                        t.locale === locale ? { ...t, text } : t,
                      ),
                    }
                  : o,
              ),
            }
          : q,
      ),
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const enTitle = translations.find((t) => t.locale === "en")?.title
    if (!enTitle) {
      alert("English title is required")
      return
    }

    setSubmitting(true)
    try {
      const body = {
        active,
        exhibitId: exhibitId || null,
        translations,
        questions: questions.map((q) => ({
          id: q.id,
          type: q.type,
          required: q.required,
          order: q.order,
          translations: q.translations,
          options:
            q.type === "single" || q.type === "multiple"
              ? q.options.map((o) => ({
                  id: o.id,
                  order: o.order,
                  translations: o.translations,
                }))
              : [],
        })),
      }

      const url = survey ? `/api/surveys/${survey.id}` : "/api/surveys"
      const method = survey ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Failed to save survey")
        return
      }

      router.push("/admin/surveys")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={active} onCheckedChange={setActive} />
          <Label>Active</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Linked Exhibit</Label>
        <Select
          value={exhibitId || undefined}
          onValueChange={(val) => setExhibitId(val === "none" || !val ? "" : val)}
        >
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="No exhibit linked" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No exhibit linked</SelectItem>
            {exhibits.map((ex) => (
              <SelectItem key={ex.id} value={ex.id}>
                {ex.translations.find((t) => t.locale === "en")?.name ??
                  ex.translations[0]?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Survey Info</h3>
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="uz">O&apos;zbek</TabsTrigger>
          </TabsList>
          {locales.map((locale) => (
            <TabsContent key={locale} value={locale} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>
                  Title{" "}
                  {locale === "en" && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input
                  value={
                    translations.find((t) => t.locale === locale)?.title ?? ""
                  }
                  onChange={(e) =>
                    updateTranslation(locale, "title", e.target.value)
                  }
                  placeholder={`Title in ${localeLabels[locale]}`}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={
                    translations.find((t) => t.locale === locale)
                      ?.description ?? ""
                  }
                  onChange={(e) =>
                    updateTranslation(locale, "description", e.target.value)
                  }
                  placeholder={`Description in ${localeLabels[locale]}`}
                  rows={3}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Questions</h3>
        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <Card key={qIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Question {qIndex + 1}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(qIndex, -1)}
                      disabled={qIndex === 0}
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(qIndex, 1)}
                      disabled={qIndex === questions.length - 1}
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      disabled={questions.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(val) =>
                        updateQuestion(qIndex, "type", val ?? "single")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {questionTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(qIndex, "required", checked)
                      }
                    />
                    <Label>Required</Label>
                  </div>
                </div>

                <Tabs defaultValue="en">
                  <TabsList>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="ru">RU</TabsTrigger>
                    <TabsTrigger value="uz">UZ</TabsTrigger>
                  </TabsList>
                  {locales.map((locale) => (
                    <TabsContent
                      key={locale}
                      value={locale}
                      className="pt-2"
                    >
                      <Input
                        value={
                          question.translations.find(
                            (t) => t.locale === locale,
                          )?.text ?? ""
                        }
                        onChange={(e) =>
                          updateQuestionTranslation(
                            qIndex,
                            locale,
                            e.target.value,
                          )
                        }
                        placeholder={`Question text in ${localeLabels[locale]}`}
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                {(question.type === "single" ||
                  question.type === "multiple") && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <Label className="text-sm text-muted-foreground">
                      Options
                    </Label>
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex items-start gap-2"
                      >
                        <div className="flex-1">
                          <Tabs defaultValue="en">
                            <TabsList className="h-8">
                              <TabsTrigger value="en" className="text-xs px-2 py-1">
                                EN
                              </TabsTrigger>
                              <TabsTrigger value="ru" className="text-xs px-2 py-1">
                                RU
                              </TabsTrigger>
                              <TabsTrigger value="uz" className="text-xs px-2 py-1">
                                UZ
                              </TabsTrigger>
                            </TabsList>
                            {locales.map((locale) => (
                              <TabsContent
                                key={locale}
                                value={locale}
                                className="pt-1"
                              >
                                <Input
                                  value={
                                    option.translations.find(
                                      (t) => t.locale === locale,
                                    )?.text ?? ""
                                  }
                                  onChange={(e) =>
                                    updateOptionTranslation(
                                      qIndex,
                                      oIndex,
                                      locale,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Option ${oIndex + 1} in ${localeLabels[locale]}`}
                                />
                              </TabsContent>
                            ))}
                          </Tabs>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-1"
                          onClick={() => removeOption(qIndex, oIndex)}
                          disabled={question.options.length === 1}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                    >
                      <Plus className="mr-1 size-3" />
                      Add Option
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={addQuestion}
        >
          <Plus className="mr-2 size-4" />
          Add Question
        </Button>
      </div>

      <Separator />

      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {survey ? "Update Survey" : "Create Survey"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/surveys")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
