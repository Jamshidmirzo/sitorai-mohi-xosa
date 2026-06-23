"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"

interface OptionTranslation {
  id: string
  locale: string
  text: string
}

interface QuestionOption {
  id: string
  order: number
  translations: OptionTranslation[]
}

interface QuestionTranslation {
  id: string
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
  id: string
  locale: string
  title: string
  description: string | null
}

interface SurveyData {
  id: string
  translations: SurveyTranslation[]
  questions: SurveyQuestion[]
}

type Answers = Record<
  string,
  { optionId?: string; optionIds?: string[]; textValue?: string; ratingValue?: number }
>

export function SurveyFormClient({
  survey,
  locale,
  surveyId,
}: {
  survey: SurveyData
  locale: string
  surveyId: string
}) {
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const translation = survey.translations[0]
  const title = translation?.title ?? "Survey"
  const description = translation?.description

  function setAnswer(questionId: string, value: Partial<Answers[string]>) {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], ...value } }))
    setErrors((prev) => ({ ...prev, [questionId]: false }))
  }

  function toggleOption(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = prev[questionId]?.optionIds ?? []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return { ...prev, [questionId]: { ...prev[questionId], optionIds: next } }
    })
    setErrors((prev) => ({ ...prev, [questionId]: false }))
  }

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {}
    for (const q of survey.questions) {
      if (!q.required) continue
      const a = answers[q.id]
      if (q.type === "single" && !a?.optionId) newErrors[q.id] = true
      if (q.type === "multiple" && (!a?.optionIds || a.optionIds.length === 0))
        newErrors[q.id] = true
      if (q.type === "rating" && !a?.ratingValue) newErrors[q.id] = true
      if (q.type === "text" && (!a?.textValue || !a.textValue.trim())) newErrors[q.id] = true
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload: { questionId: string; optionId?: string; textValue?: string; ratingValue?: number }[] =
        []

      for (const q of survey.questions) {
        const a = answers[q.id]
        if (!a) continue

        if (q.type === "single" && a.optionId) {
          payload.push({ questionId: q.id, optionId: a.optionId })
        } else if (q.type === "multiple" && a.optionIds) {
          for (const optId of a.optionIds) {
            payload.push({ questionId: q.id, optionId: optId })
          }
        } else if (q.type === "rating" && a.ratingValue) {
          payload.push({ questionId: q.id, ratingValue: a.ratingValue })
        } else if (q.type === "text" && a.textValue?.trim()) {
          payload.push({ questionId: q.id, textValue: a.textValue.trim() })
        }
      }

      const res = await fetch(`/api/surveys/${surveyId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: crypto.randomUUID(),
          locale,
          answers: payload,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        alert("Failed to submit survey. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <CheckCircle className="size-16 text-green-500" />
            <h2 className="text-2xl font-bold">Thank you!</h2>
            <p className="text-muted-foreground">Your response has been recorded.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {survey.questions.map((question, qi) => {
          const qText = question.translations[0]?.text ?? `Question ${qi + 1}`
          const hasError = errors[question.id]

          return (
            <Card key={question.id} className={hasError ? "border-destructive" : ""}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {qi + 1}. {qText}
                  {question.required && <span className="ml-1 text-destructive">*</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.type === "single" && (
                  <RadioGroup
                    value={answers[question.id]?.optionId ?? ""}
                    onValueChange={(val) => setAnswer(question.id, { optionId: val })}
                  >
                    <div className="space-y-2">
                      {question.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.id} id={opt.id} />
                          <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                            {opt.translations[0]?.text ?? "—"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.type === "multiple" && (
                  <div className="space-y-2">
                    {question.options.map((opt) => {
                      const checked =
                        answers[question.id]?.optionIds?.includes(opt.id) ?? false
                      return (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Checkbox
                            id={opt.id}
                            checked={checked}
                            onCheckedChange={() => toggleOption(question.id, opt.id)}
                          />
                          <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                            {opt.translations[0]?.text ?? "—"}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )}

                {question.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={answers[question.id]?.ratingValue === n ? "default" : "outline"}
                        size="icon"
                        onClick={() => setAnswer(question.id, { ratingValue: n })}
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                )}

                {question.type === "text" && (
                  <Textarea
                    placeholder="Your answer..."
                    value={answers[question.id]?.textValue ?? ""}
                    onChange={(e) => setAnswer(question.id, { textValue: e.target.value })}
                    rows={3}
                  />
                )}

                {hasError && (
                  <p className="mt-2 text-sm text-destructive">This field is required</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-6">
        <Button onClick={handleSubmit} disabled={submitting} className="w-full" size="lg">
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Submit
        </Button>
      </div>
    </div>
  )
}
