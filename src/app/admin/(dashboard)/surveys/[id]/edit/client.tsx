"use client"

import { useEffect, useState } from "react"
import { SurveyForm } from "@/components/admin/survey-form"
import { Skeleton } from "@/components/ui/skeleton"

export function EditSurveyClient({ id }: { id: string }) {
  const [survey, setSurvey] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/surveys/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Survey not found")
        return res.json()
      })
      .then(setSurvey)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Survey</h1>
        <p className="text-muted-foreground">Update survey details</p>
      </div>
      <SurveyForm survey={survey} />
    </div>
  )
}
