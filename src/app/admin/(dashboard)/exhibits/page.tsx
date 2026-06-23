"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { QrCodeDialog } from "@/components/admin/qr-code-dialog"

interface Exhibit {
  id: string
  slug: string
  period: string | null
  featured: boolean
  translations: { locale: string; name: string }[]
  category: { translations: { locale: string; name: string }[] } | null
  hall: { translations: { locale: string; name: string }[] } | null
}

function getName(translations: { locale: string; name: string }[] | undefined) {
  if (!translations?.length) return "—"
  return translations.find((t) => t.locale === "en")?.name ?? translations[0].name
}

export default function ExhibitsPage() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchExhibits = useCallback(async (query?: string) => {
    setLoading(true)
    try {
      const url = query ? `/api/exhibits?search=${encodeURIComponent(query)}` : "/api/exhibits"
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
    const timer = setTimeout(() => {
      fetchExhibits(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchExhibits])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/exhibits/${id}`, { method: "DELETE" })
      if (res.ok) {
        setExhibits((prev) => prev.filter((e) => e.id !== id))
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exhibits</h1>
          <p className="text-muted-foreground">Manage museum exhibits</p>
        </div>
        <Button render={<Link href="/admin/exhibits/new" />}>
          <Plus className="mr-2 size-4" />
          Add Exhibit
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search exhibits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : exhibits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No exhibits found</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exhibits.map((exhibit) => (
                <TableRow key={exhibit.id}>
                  <TableCell className="font-medium">
                    {getName(exhibit.translations)}
                  </TableCell>
                  <TableCell>{getName(exhibit.category?.translations)}</TableCell>
                  <TableCell>{getName(exhibit.hall?.translations)}</TableCell>
                  <TableCell>{exhibit.period || "—"}</TableCell>
                  <TableCell>
                    {exhibit.featured ? (
                      <Badge>Featured</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <QrCodeDialog
                        exhibitId={exhibit.id}
                        exhibitName={getName(exhibit.translations)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={`/admin/exhibits/${exhibit.id}/edit`} />}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button variant="ghost" size="icon" disabled={deleting === exhibit.id} />
                          }
                        >
                          <Trash2 className="size-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete exhibit?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &quot;{getName(exhibit.translations)}&quot;
                              and all its translations and images.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(exhibit.id)}
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
