"use client"

import { useEffect, useState } from "react"
import { ExhibitForm } from "@/components/admin/exhibit-form"
import { Skeleton } from "@/components/ui/skeleton"

export function EditExhibitClient({ id }: { id: string }) {
  const [exhibit, setExhibit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/exhibits/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Exhibit not found")
        return res.json()
      })
      .then(setExhibit)
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
          {Array.from({ length: 6 }).map((_, i) => (
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Exhibit</h1>
        <p className="text-muted-foreground">Update exhibit details</p>
      </div>
      <ExhibitForm exhibit={exhibit} />
    </div>
  )
}
