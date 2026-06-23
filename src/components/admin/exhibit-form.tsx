"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { X, Upload, Loader2 } from "lucide-react"

const locales = ["en", "ru", "uz"] as const

const translationSchema = z.object({
  locale: z.enum(locales),
  name: z.string(),
  description: z.string(),
})

const imageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  order: z.number(),
})

const exhibitSchema = z
  .object({
    slug: z.string().min(1, "Slug is required"),
    categoryId: z.string(),
    hallId: z.string(),
    period: z.string(),
    material: z.string(),
    featured: z.boolean(),
    translations: z.array(translationSchema).length(3),
    images: z.array(imageSchema),
  })
  .refine(
    (data) => {
      const en = data.translations.find((t) => t.locale === "en")
      return !!en?.name
    },
    { message: "English name is required", path: ["translations", 0, "name"] },
  )

type ExhibitFormValues = z.infer<typeof exhibitSchema>

interface CategoryOption {
  id: string
  translations: { locale: string; name: string }[]
}

interface HallOption {
  id: string
  translations: { locale: string; name: string }[]
}

interface ExhibitImage {
  id?: string
  url: string
  alt?: string
  order: number
}

interface ExhibitData {
  id: string
  slug: string
  categoryId: string | null
  hallId: string | null
  period: string | null
  material: string | null
  featured: boolean
  translations: { locale: string; name: string; description: string | null }[]
  images: ExhibitImage[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ExhibitForm({ exhibit }: { exhibit?: ExhibitData }) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [halls, setHalls] = useState<HallOption[]>([])
  const [images, setImages] = useState<ExhibitImage[]>(exhibit?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!exhibit)

  const defaultTranslations = locales.map((locale) => {
    const existing = exhibit?.translations.find((t) => t.locale === locale)
    return {
      locale,
      name: existing?.name ?? "",
      description: existing?.description ?? "",
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExhibitFormValues>({
    resolver: zodResolver(exhibitSchema),
    defaultValues: {
      slug: exhibit?.slug ?? "",
      categoryId: exhibit?.categoryId ?? "",
      hallId: exhibit?.hallId ?? "",
      period: exhibit?.period ?? "",
      material: exhibit?.material ?? "",
      featured: exhibit?.featured ?? false,
      translations: defaultTranslations,
      images: exhibit?.images?.map((img) => ({
        url: img.url,
        alt: img.alt ?? "",
        order: img.order,
      })) ?? [],
    },
  })

  const watchedEnName = watch("translations.0.name")
  const watchedFeatured = watch("featured")

  useEffect(() => {
    if (!slugManuallyEdited && watchedEnName) {
      setValue("slug", slugify(watchedEnName))
    }
  }, [watchedEnName, slugManuallyEdited, setValue])

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/halls").then((r) => r.json()),
    ]).then(([cats, hls]) => {
      setCategories(cats)
      setHalls(hls)
    })
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      const newImages: ExhibitImage[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) continue
        const data = await res.json()
        newImages.push({
          url: data.url,
          alt: "",
          order: images.length + newImages.length,
        })
      }
      const updated = [...images, ...newImages]
      setImages(updated)
      setValue(
        "images",
        updated.map((img) => ({ url: img.url, alt: img.alt ?? "", order: img.order })),
      )
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  function removeImage(index: number) {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }))
    setImages(updated)
    setValue(
      "images",
      updated.map((img) => ({ url: img.url, alt: img.alt ?? "", order: img.order })),
    )
  }

  async function onSubmit(data: ExhibitFormValues) {
    setSubmitting(true)
    try {
      const body = {
        ...data,
        categoryId: data.categoryId || null,
        hallId: data.hallId || null,
        period: data.period || null,
        material: data.material || null,
      }

      const url = exhibit ? `/api/exhibits/${exhibit.id}` : "/api/exhibits"
      const method = exhibit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Failed to save exhibit")
        return
      }

      router.push("/admin/exhibits")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug", {
              onChange: () => setSlugManuallyEdited(true),
            })}
            placeholder="exhibit-slug"
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={watch("categoryId") || undefined}
            onValueChange={(val) => setValue("categoryId", val ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.translations.find((t) => t.locale === "en")?.name ??
                    cat.translations[0]?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Hall</Label>
          <Select
            value={watch("hallId") || undefined}
            onValueChange={(val) => setValue("hallId", val ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select hall" />
            </SelectTrigger>
            <SelectContent>
              {halls.map((hall) => (
                <SelectItem key={hall.id} value={hall.id}>
                  {hall.translations.find((t) => t.locale === "en")?.name ??
                    hall.translations[0]?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Input id="period" {...register("period")} placeholder="e.g. 19th century" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input id="material" {...register("material")} placeholder="e.g. Ceramic" />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Checkbox
            checked={watchedFeatured}
            onCheckedChange={(checked: boolean) => setValue("featured", checked)}
          />
          <Label>Featured exhibit</Label>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Translations</h3>
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="uz">O&apos;zbek</TabsTrigger>
          </TabsList>
          {locales.map((locale, index) => (
            <TabsContent key={locale} value={locale} className="space-y-4 pt-4">
              <input type="hidden" {...register(`translations.${index}.locale`)} />
              <div className="space-y-2">
                <Label htmlFor={`name-${locale}`}>
                  Name {locale === "en" && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={`name-${locale}`}
                  {...register(`translations.${index}.name`)}
                  placeholder={`Name in ${locale === "en" ? "English" : locale === "ru" ? "Russian" : "Uzbek"}`}
                />
                {errors.translations?.[index]?.name && (
                  <p className="text-sm text-destructive">
                    {errors.translations[index].name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`desc-${locale}`}>Description</Label>
                <Textarea
                  id={`desc-${locale}`}
                  {...register(`translations.${index}.description`)}
                  placeholder={`Description in ${locale === "en" ? "English" : locale === "ru" ? "Russian" : "Uzbek"}`}
                  rows={5}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Images</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div key={`${img.url}-${index}`} className="group relative rounded-lg border overflow-hidden">
              <img
                src={img.url}
                alt={img.alt || "Exhibit image"}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed hover:bg-muted/50 transition-colors">
            {uploading ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="size-6 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <Separator />

      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {exhibit ? "Update Exhibit" : "Create Exhibit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/exhibits")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
