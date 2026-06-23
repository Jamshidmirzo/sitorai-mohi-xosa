"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Translation {
  locale: string
  title: string
  excerpt: string
  content: string
}

interface PostData {
  id?: string
  slug: string
  coverImage: string | null
  published: boolean
  translations: Translation[]
}

interface PostFormProps {
  initialData?: PostData
  onSubmit: (data: PostData) => void
  loading?: boolean
}

const LOCALES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "uz", label: "Uzbek" },
] as const

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function PostForm({ initialData, onSubmit, loading }: PostFormProps) {
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [coverImage, setCoverImage] = useState<string | null>(
    initialData?.coverImage ?? null
  )
  const [published, setPublished] = useState(initialData?.published ?? false)
  const [uploading, setUploading] = useState(false)
  const [translations, setTranslations] = useState<Record<string, Translation>>(
    () => {
      const map: Record<string, Translation> = {}
      for (const locale of LOCALES) {
        const existing = initialData?.translations.find(
          (t) => t.locale === locale.value
        )
        map[locale.value] = {
          locale: locale.value,
          title: existing?.title ?? "",
          excerpt: existing?.excerpt ?? "",
          content: existing?.content ?? "",
        }
      }
      return map
    }
  )

  const updateTranslation = (
    locale: string,
    field: keyof Omit<Translation, "locale">,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  // Auto-generate slug from English title
  useEffect(() => {
    if (!initialData) {
      const enTitle = translations.en?.title ?? ""
      if (enTitle) {
        setSlug(toSlug(enTitle))
      }
    }
  }, [translations.en?.title, initialData])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      setCoverImage(data.url)
      toast.success("Image uploaded successfully")
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!slug.trim()) {
      toast.error("Slug is required")
      return
    }

    const enTranslation = translations.en
    if (!enTranslation?.title.trim()) {
      toast.error("English title is required")
      return
    }

    const translationsList = Object.values(translations).filter(
      (t) => t.title.trim() !== ""
    )

    onSubmit({
      slug: slug.trim(),
      coverImage,
      published,
      translations: translationsList,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="post-url-slug"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image</Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        )}
        {coverImage && (
          <div className="mt-2">
            <img
              src={coverImage}
              alt="Cover preview"
              className="h-40 w-auto rounded-md border object-cover"
            />
          </div>
        )}
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <Switch
          checked={published}
          onCheckedChange={setPublished}
        />
        <Label>Published</Label>
      </div>

      {/* Translations Tabs */}
      <Tabs defaultValue="en">
        <TabsList>
          {LOCALES.map((locale) => (
            <TabsTrigger key={locale.value} value={locale.value}>
              {locale.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LOCALES.map((locale) => (
          <TabsContent key={locale.value} value={locale.value}>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title ({locale.label})</Label>
                <Input
                  value={translations[locale.value]?.title ?? ""}
                  onChange={(e) =>
                    updateTranslation(locale.value, "title", e.target.value)
                  }
                  placeholder={`Enter title in ${locale.label}`}
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt ({locale.label})</Label>
                <Textarea
                  value={translations[locale.value]?.excerpt ?? ""}
                  onChange={(e) =>
                    updateTranslation(locale.value, "excerpt", e.target.value)
                  }
                  placeholder={`Short description in ${locale.label}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Content ({locale.label})</Label>
                <RichTextEditor
                  content={translations[locale.value]?.content ?? ""}
                  onChange={(html) =>
                    updateTranslation(locale.value, "content", html)
                  }
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Submit */}
      <Button type="submit" disabled={loading || uploading}>
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {initialData ? "Update Post" : "Create Post"}
      </Button>
    </form>
  )
}
