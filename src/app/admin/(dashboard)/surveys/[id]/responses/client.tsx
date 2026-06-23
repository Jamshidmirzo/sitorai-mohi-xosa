"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, ArrowLeft } from "lucide-react"

interface OptionTranslation {
  locale: string
  text: string
}

interface QuestionOption {
  id: string
  order: number
  translations: OptionTranslation[]
}

interface QuestionTranslation {
  locale: string
  text: string
}

interface SurveyQuestion {
  id: string
  type: string
  order: number
  required: boolean
  translations: QuestionTranslation[]
  options: QuestionOption[]
}

interface SurveyTranslation {
  locale: string
  title: string
  description: string | null
}

interface Survey {
  id: string
  translations: SurveyTranslation[]
  questions: SurveyQuestion[]
}

interface ResponseAnswer {
  questionId: string
  optionId: string | null
  textValue: string | null
  ratingValue: number | null
  option: { id: string; translations: OptionTranslation[] } | null
}

interface SurveyResponse {
  id: string
  locale: string
  createdAt: string
  answers: ResponseAnswer[]
}

function getTranslation(
  translations: { locale: string; text: string }[],
  locale = "en"
) {
  return (
    translations.find((t) => t.locale === locale)?.text ??
    translations[0]?.text ??
    "—"
  )
}

function getOptionText(
  translations: OptionTranslation[],
  locale = "en"
) {
  return (
    translations.find((t) => t.locale === locale)?.text ??
    translations[0]?.text ??
    "—"
  )
}

export function ResponsesClient({ surveyId }: { surveyId: string }) {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/surveys/${surveyId}`).then((r) => {
        if (!r.ok) throw new Error("Failed to load survey")
        return r.json()
      }),
      fetch(`/api/surveys/${surveyId}/responses`).then((r) => {
        if (!r.ok) throw new Error("Failed to load responses")
        return r.json()
      }),
    ])
      .then(([s, r]) => {
        setSurvey(s)
        setResponses(r)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [surveyId])

  function exportCsv() {
    if (!survey || responses.length === 0) return

    const sortedQuestions = [...survey.questions].sort(
      (a, b) => a.order - b.order
    )

    const headers = [
      "ResponseID",
      "Locale",
      "Date",
      ...sortedQuestions.map((q) => getTranslation(q.translations)),
    ]

    const rows = responses.map((resp) => {
      const cells: string[] = [
        resp.id.slice(0, 8),
        resp.locale,
        new Date(resp.createdAt).toLocaleDateString(),
      ]

      for (const question of sortedQuestions) {
        const answer = resp.answers.find(
          (a) => a.questionId === question.id
        )
        if (!answer) {
          cells.push("")
          continue
        }

        if (question.type === "text") {
          cells.push(answer.textValue ?? "")
        } else if (question.type === "rating") {
          cells.push(answer.ratingValue?.toString() ?? "")
        } else if (answer.option) {
          cells.push(getOptionText(answer.option.translations))
        } else {
          cells.push("")
        }
      }

      return cells
    })

    const escape = (v: string) => {
      if (v.includes(",") || v.includes('"') || v.includes("\n")) {
        return `"${v.replace(/"/g, '""')}"`
      }
      return v
    }

    const csv = [headers.map(escape).join(",")]
      .concat(rows.map((r) => r.map(escape).join(",")))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `survey-${surveyId}-responses.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="rounded-lg border border-destructive/50 p-8 text-center">
        <p className="text-destructive">{error ?? "Survey not found"}</p>
      </div>
    )
  }

  const surveyTitle =
    survey.translations.find((t) => t.locale === "en")?.title ??
    survey.translations[0]?.title ??
    "Survey"

  const localeCounts: Record<string, number> = {}
  for (const r of responses) {
    localeCounts[r.locale] = (localeCounts[r.locale] || 0) + 1
  }

  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.order - b.order
  )

  const allAnswers = responses.flatMap((r) => r.answers)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" render={<Link href="/admin/surveys" />}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Responses: {surveyTitle}
            </h1>
            <p className="text-muted-foreground">
              Survey analytics and individual responses
            </p>
          </div>
        </div>
        <Button onClick={exportCsv} disabled={responses.length === 0}>
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{responses.length}</p>
          </CardContent>
        </Card>
        {Object.entries(localeCounts).map(([locale, count]) => (
          <Card key={locale}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {locale.toUpperCase()} Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Question Analytics</h2>
        {sortedQuestions.map((question) => (
          <QuestionAnalytics
            key={question.id}
            question={question}
            answers={allAnswers.filter(
              (a) => a.questionId === question.id
            )}
          />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Responses</h2>
        {responses.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No responses yet</p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Answers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((resp) => (
                  <TableRow key={resp.id}>
                    <TableCell className="font-mono text-sm">
                      {resp.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {resp.locale.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(resp.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                      {resp.answers
                        .map((a) => {
                          if (a.textValue) return a.textValue
                          if (a.ratingValue != null)
                            return `${a.ratingValue}/5`
                          if (a.option)
                            return getOptionText(a.option.translations)
                          return "—"
                        })
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionAnalytics({
  question,
  answers,
}: {
  question: SurveyQuestion
  answers: ResponseAnswer[]
}) {
  const questionText = getTranslation(question.translations)
  const typeLabel = question.type.charAt(0).toUpperCase() + question.type.slice(1)

  if (question.type === "single" || question.type === "multiple") {
    const optionCounts: Record<string, number> = {}
    for (const opt of question.options) {
      optionCounts[opt.id] = 0
    }
    for (const a of answers) {
      if (a.optionId && optionCounts[a.optionId] !== undefined) {
        optionCounts[a.optionId]++
      }
    }

    const chartData = question.options
      .sort((a, b) => a.order - b.order)
      .map((opt) => ({
        name: getOptionText(opt.translations),
        count: optionCounts[opt.id] || 0,
      }))

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{questionText}</CardTitle>
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {answers.length} answer{answers.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No options defined</p>
          )}
        </CardContent>
      </Card>
    )
  }

  if (question.type === "rating") {
    const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let total = 0
    let count = 0
    for (const a of answers) {
      if (a.ratingValue != null) {
        ratingDist[a.ratingValue] = (ratingDist[a.ratingValue] || 0) + 1
        total += a.ratingValue
        count++
      }
    }
    const average = count > 0 ? (total / count).toFixed(1) : "—"
    const chartData = [1, 2, 3, 4, 5].map((r) => ({
      name: `${r} star${r !== 1 ? "s" : ""}`,
      count: ratingDist[r],
    }))

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{questionText}</CardTitle>
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {answers.length} answer{answers.length !== 1 ? "s" : ""} &middot;
            Average: <span className="font-bold text-foreground">{average}</span>
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  if (question.type === "text") {
    const textAnswers = answers
      .map((a) => a.textValue)
      .filter((v): v is string => !!v)

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{questionText}</CardTitle>
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {textAnswers.length} answer{textAnswers.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent>
          {textAnswers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No text responses</p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {textAnswers.map((text, i) => (
                <div
                  key={i}
                  className="rounded-md border bg-muted/50 p-3 text-sm"
                >
                  {text}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return null
}
