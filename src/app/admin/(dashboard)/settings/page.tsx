"use client"

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const LOCALES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "uz", label: "Uzbek" },
] as const

type Locale = (typeof LOCALES)[number]["value"]

interface SiteSettingsData {
  id?: string
  locale: string
  siteName: string
  siteDescription: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  aboutText: string
}

const emptyData = (locale: string): SiteSettingsData => ({
  locale,
  siteName: "",
  siteDescription: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  aboutText: "",
})

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Locale | null>(null)
  const [uploading, setUploading] = useState<Locale | null>(null)
  const fileInputRefs = useRef<Record<Locale, HTMLInputElement | null>>({
    en: null,
    ru: null,
    uz: null,
  })
  const [data, setData] = useState<Record<Locale, SiteSettingsData>>({
    en: emptyData("en"),
    ru: emptyData("ru"),
    uz: emptyData("uz"),
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) throw new Error("Failed to fetch")
      const records: SiteSettingsData[] = await res.json()

      const newData = { ...data }
      for (const record of records) {
        const locale = record.locale as Locale
        if (locale in newData) {
          newData[locale] = {
            ...emptyData(locale),
            ...record,
            siteName: record.siteName ?? "",
            siteDescription: record.siteDescription ?? "",
            heroTitle: record.heroTitle ?? "",
            heroSubtitle: record.heroSubtitle ?? "",
            heroImage: record.heroImage ?? "",
            aboutText: record.aboutText ?? "",
          }
        }
      }
      setData(newData)
    } catch {
      toast.error("Failed to load site settings")
    } finally {
      setLoading(false)
    }
  }

  function updateField(locale: Locale, field: keyof SiteSettingsData, value: string) {
    setData((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  async function handleImageUpload(locale: Locale, file: File) {
    setUploading(locale)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { url } = await res.json()
      updateField(locale, "heroImage", url)
      toast.success("Image uploaded successfully")
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setUploading(null)
    }
  }

  async function handleSave(locale: Locale) {
    setSaving(locale)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data[locale]),
      })
      if (!res.ok) throw new Error("Failed to save")
      const updated = await res.json()
      setData((prev) => ({
        ...prev,
        [locale]: {
          ...prev[locale],
          ...updated,
          siteName: updated.siteName ?? "",
          siteDescription: updated.siteDescription ?? "",
          heroTitle: updated.heroTitle ?? "",
          heroSubtitle: updated.heroSubtitle ?? "",
          heroImage: updated.heroImage ?? "",
          aboutText: updated.aboutText ?? "",
        },
      }))
      toast.success("Site settings saved successfully")
    } catch {
      toast.error("Failed to save site settings")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <Skeleton className="h-8 w-72" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage site settings for each language
        </p>
      </div>

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
            <Card>
              <CardHeader>
                <CardTitle>Settings ({locale.label})</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSave(locale.value)
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor={`siteName-${locale.value}`}>Site Name</Label>
                    <Input
                      id={`siteName-${locale.value}`}
                      placeholder="Museum name"
                      value={data[locale.value].siteName}
                      onChange={(e) =>
                        updateField(locale.value, "siteName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`siteDescription-${locale.value}`}>
                      Site Description
                    </Label>
                    <Textarea
                      id={`siteDescription-${locale.value}`}
                      placeholder="Brief description of the museum"
                      rows={3}
                      value={data[locale.value].siteDescription}
                      onChange={(e) =>
                        updateField(locale.value, "siteDescription", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`heroTitle-${locale.value}`}>Hero Title</Label>
                    <Input
                      id={`heroTitle-${locale.value}`}
                      placeholder="Welcome to the Museum"
                      value={data[locale.value].heroTitle}
                      onChange={(e) =>
                        updateField(locale.value, "heroTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`heroSubtitle-${locale.value}`}>
                      Hero Subtitle
                    </Label>
                    <Input
                      id={`heroSubtitle-${locale.value}`}
                      placeholder="Discover our collection"
                      value={data[locale.value].heroSubtitle}
                      onChange={(e) =>
                        updateField(locale.value, "heroSubtitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[locale.value] = el
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(locale.value, file)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading === locale.value}
                        onClick={() =>
                          fileInputRefs.current[locale.value]?.click()
                        }
                      >
                        {uploading === locale.value
                          ? "Uploading..."
                          : "Choose Image"}
                      </Button>
                      {data[locale.value].heroImage && (
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {data[locale.value].heroImage}
                        </span>
                      )}
                    </div>
                    {data[locale.value].heroImage && (
                      <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border">
                        <Image
                          src={data[locale.value].heroImage}
                          alt="Hero preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`aboutText-${locale.value}`}>About Text</Label>
                    <Textarea
                      id={`aboutText-${locale.value}`}
                      placeholder="About the museum..."
                      rows={5}
                      value={data[locale.value].aboutText}
                      onChange={(e) =>
                        updateField(locale.value, "aboutText", e.target.value)
                      }
                    />
                  </div>

                  <Button type="submit" disabled={saving === locale.value}>
                    {saving === locale.value ? "Saving..." : "Save"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
