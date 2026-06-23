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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  Upload,
  Loader2,
  Info,
  Globe,
  Image as ImageIcon,
  FileText as FileTextIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useAdminT } from "@/components/admin/admin-locale"

const locales = ["en", "ru", "uz"] as const

const translationSchema = z.object({
  locale: z.enum(locales),
  name: z.string(),
  tag: z.string(),
  story: z.string(),
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
    bg: z.string(),
    shot: z.string(),
    order: z.number(),
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
  bg: string | null
  shot: string | null
  order: number
  featured: boolean
  translations: {
    locale: string
    name: string
    tag: string | null
    story: string | null
    description: string | null
  }[]
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

/// Neutral fallback used only if the historian doesn't upload a photo.
/// We no longer expose this as a picker — the photo is the visual.
const DEFAULT_BG =
  "linear-gradient(155deg,#3a3322,#241f14 70%,#15120b)"

function SectionCard({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof Info
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-2 mt-0.5">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {hint && <CardDescription className="text-xs mt-1">{hint}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
      <Info className="size-3 mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

export function ExhibitForm({ exhibit }: { exhibit?: ExhibitData }) {
  const router = useRouter()
  const { t } = useAdminT()
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
      tag: existing?.tag ?? "",
      story: existing?.story ?? "",
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
      bg: exhibit?.bg ?? DEFAULT_BG,
      shot: exhibit?.shot ?? "",
      order: exhibit?.order ?? 0,
      featured: exhibit?.featured ?? false,
      translations: defaultTranslations,
      images:
        exhibit?.images?.map((img) => ({
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
        bg: data.bg || null,
        shot: data.shot || null,
        order: Number.isFinite(data.order) ? data.order : 0,
      }
      const url = exhibit ? `/api/exhibits/${exhibit.id}` : "/api/exhibits"
      const method = exhibit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.error ?? t("exForm.saveFailed"))
        return
      }
      toast.success(t("exForm.saved"))
      router.push("/admin/exhibits")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      {/* Translations — most important, first */}
      <SectionCard
        icon={Globe}
        title={t("exForm.section.translations")}
        hint={t("exForm.section.translationsHint")}
      >
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="uz">O&apos;zbek</TabsTrigger>
          </TabsList>
          {locales.map((locale, index) => {
            const lang =
              locale === "en"
                ? "English"
                : locale === "ru"
                  ? "Русский"
                  : "O‘zbek"
            return (
              <TabsContent key={locale} value={locale} className="space-y-5 pt-4">
                <input type="hidden" {...register(`translations.${index}.locale`)} />
                <div className="space-y-2">
                  <Label htmlFor={`name-${locale}`} className="flex items-center gap-2">
                    {t("exForm.name")} ({lang})
                    {locale === "en" && (
                      <span className="text-destructive text-xs">*</span>
                    )}
                  </Label>
                  <Input
                    id={`name-${locale}`}
                    {...register(`translations.${index}.name`)}
                    placeholder={locale === "en" ? "Required" : ""}
                  />
                  <FieldHint>{t("exForm.nameHint")}</FieldHint>
                  {errors.translations?.[index]?.name && locale === "en" && (
                    <p className="text-sm text-destructive">{t("exForm.nameRequired")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`tag-${locale}`}>
                    {t("exForm.tag")} ({lang})
                  </Label>
                  <Input
                    id={`tag-${locale}`}
                    {...register(`translations.${index}.tag`)}
                    placeholder={t("exForm.tagPlaceholder")}
                  />
                  <FieldHint>{t("exForm.tagHint")}</FieldHint>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`story-${locale}`}>
                    {t("exForm.story")} ({lang})
                  </Label>
                  <Textarea
                    id={`story-${locale}`}
                    {...register(`translations.${index}.story`)}
                    rows={8}
                  />
                  <FieldHint>{t("exForm.storyHint")}</FieldHint>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${locale}`}>
                    {t("exForm.description")} ({lang})
                  </Label>
                  <Textarea
                    id={`desc-${locale}`}
                    {...register(`translations.${index}.description`)}
                    rows={3}
                  />
                  <FieldHint>{t("exForm.descriptionHint")}</FieldHint>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </SectionCard>

      {/* Photos */}
      <SectionCard
        icon={ImageIcon}
        title={t("exForm.section.photos")}
        hint={t("exForm.section.photosHint")}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="group relative rounded-lg border overflow-hidden bg-muted/30"
            >
              <img
                src={img.url}
                alt={img.alt || ""}
                className="aspect-square w-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = "0.3"
                }}
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-amber-950 font-medium">
                  1
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors">
            {uploading ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="size-6 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">
                  {t("exForm.upload")}
                </span>
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
      </SectionCard>

      {/* Basic + Classification */}
      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard
          icon={FileTextIcon}
          title={t("exForm.section.basic")}
          hint={t("exForm.section.basicHint")}
        >
          <div className="space-y-2">
            <Label htmlFor="period">{t("exForm.period")}</Label>
            <Input
              id="period"
              {...register("period")}
              placeholder={t("exForm.periodPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">{t("exForm.material")}</Label>
            <Input
              id="material"
              {...register("material")}
              placeholder={t("exForm.materialPlaceholder")}
            />
          </div>
          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="featured"
              checked={watchedFeatured}
              onCheckedChange={(checked: boolean) => setValue("featured", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="featured" className="cursor-pointer">
                {t("exForm.featured")}
              </Label>
              <FieldHint>{t("exForm.featuredHint")}</FieldHint>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">{t("exForm.order")}</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
              className="max-w-[120px]"
            />
            <FieldHint>{t("exForm.orderHint")}</FieldHint>
          </div>
        </SectionCard>

        <SectionCard
          icon={Info}
          title={t("exForm.section.classification")}
          hint={t("exForm.section.classificationHint")}
        >
          <div className="space-y-2">
            <Label>{t("exForm.category")}</Label>
            <Select
              value={watch("categoryId") || undefined}
              onValueChange={(val) => setValue("categoryId", val ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("exForm.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.translations.find((x) => x.locale === "en")?.name ??
                      cat.translations[0]?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("exForm.hall")}</Label>
            <Select
              value={watch("hallId") || undefined}
              onValueChange={(val) => setValue("hallId", val ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("exForm.hallPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {halls.map((hall) => (
                  <SelectItem key={hall.id} value={hall.id}>
                    {hall.translations.find((x) => x.locale === "en")?.name ??
                      hall.translations[0]?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SectionCard>
      </div>

      {/* Hidden: bg and shot kept on the model for legacy data, set to defaults */}
      <input type="hidden" {...register("bg")} />
      <input type="hidden" {...register("shot")} />

      {/* Slug — advanced, but still needed for the URL */}
      <SectionCard
        icon={Info}
        title={t("exForm.slug")}
        hint={t("exForm.slugHint")}
      >
        <Input
          id="slug"
          {...register("slug", { onChange: () => setSlugManuallyEdited(true) })}
          placeholder={t("exForm.slugPlaceholder")}
          className="font-mono text-xs max-w-md"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{t("exForm.slugRequired")}</p>
        )}
      </SectionCard>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-0 bg-background/95 backdrop-blur border-t pt-4 -mx-6 px-6">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {submitting ? t("exForm.submitLoading") : t("exForm.submit")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/exhibits")}
        >
          {t("exForm.cancel")}
        </Button>
      </div>
    </form>
  )
}
