"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Plus, Pencil, Trash2, BarChart3 } from "lucide-react"

interface Survey {
  id: string
  active: boolean
  exhibitId: string | null
  translations: { locale: string; title: string }[]
  exhibit: {
    translations: { locale: string; name: string }[]
  } | null
  _count: {
    questions: number
    responses: number
  }
}

function getTitle(translations: { locale: string; title: string }[] | undefined) {
  if (!translations?.length) return "—"
  return translations.find((t) => t.locale === "en")?.title ?? translations[0].title
}

function getExhibitName(exhibit: Survey["exhibit"]) {
  if (!exhibit?.translations?.length) return "—"
  return (
    exhibit.translations.find((t) => t.locale === "en")?.name ??
    exhibit.translations[0].name
  )
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchSurveys = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/surveys")
      if (res.ok) {
        setSurveys(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSurveys()
  }, [fetchSurveys])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/surveys/${id}`, { method: "DELETE" })
      if (res.ok) {
        setSurveys((prev) => prev.filter((s) => s.id !== id))
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
          <p className="text-muted-foreground">Manage visitor surveys</p>
        </div>
        <Button render={<Link href="/admin/surveys/new" />}>
          <Plus className="mr-2 size-4" />
          Create Survey
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : surveys.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No surveys found</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Exhibit</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium">
                    {getTitle(survey.translations)}
                  </TableCell>
                  <TableCell>{getExhibitName(survey.exhibit)}</TableCell>
                  <TableCell>
                    {survey.active ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{survey._count.questions}</TableCell>
                  <TableCell>{survey._count.responses}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={`/admin/surveys/${survey.id}/edit`} />}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={`/admin/surveys/${survey.id}/responses`} />}
                      >
                        <BarChart3 className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button variant="ghost" size="icon" disabled={deleting === survey.id} />
                          }
                        >
                          <Trash2 className="size-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete survey?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{getTitle(survey.translations)}&quot;
                              and all its questions, options, and responses.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(survey.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
