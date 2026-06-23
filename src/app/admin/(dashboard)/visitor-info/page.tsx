"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
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

interface VisitorInfoData {
  id?: string
  locale: string
  hours: string
  ticketPrices: string
  address: string
  phone: string
  email: string
  mapEmbedUrl: string
}

const emptyData = (locale: string): VisitorInfoData => ({
  locale,
  hours: "",
  ticketPrices: "",
  address: "",
  phone: "",
  email: "",
  mapEmbedUrl: "",
})

export default function VisitorInfoPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Locale | null>(null)
  const [data, setData] = useState<Record<Locale, VisitorInfoData>>({
    en: emptyData("en"),
    ru: emptyData("ru"),
    uz: emptyData("uz"),
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/visitor-info")
      if (!res.ok) throw new Error("Failed to fetch")
      const records: VisitorInfoData[] = await res.json()

      const newData = { ...data }
      for (const record of records) {
        const locale = record.locale as Locale
        if (locale in newData) {
          newData[locale] = {
            ...emptyData(locale),
            ...record,
            hours: record.hours ?? "",
            ticketPrices: record.ticketPrices ?? "",
            address: record.address ?? "",
            phone: record.phone ?? "",
            email: record.email ?? "",
            mapEmbedUrl: record.mapEmbedUrl ?? "",
          }
        }
      }
      setData(newData)
    } catch {
      toast.error("Failed to load visitor information")
    } finally {
      setLoading(false)
    }
  }

  function updateField(locale: Locale, field: keyof VisitorInfoData, value: string) {
    setData((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  async function handleSave(locale: Locale) {
    setSaving(locale)
    try {
      const res = await fetch("/api/visitor-info", {
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
          hours: updated.hours ?? "",
          ticketPrices: updated.ticketPrices ?? "",
          address: updated.address ?? "",
          phone: updated.phone ?? "",
          email: updated.email ?? "",
          mapEmbedUrl: updated.mapEmbedUrl ?? "",
        },
      }))
      toast.success("Visitor information saved successfully")
    } catch {
      toast.error("Failed to save visitor information")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-80" />
        </div>
        <Skeleton className="h-8 w-72" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visitor Information</h1>
        <p className="text-muted-foreground">
          Manage visitor information for each language
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
                <CardTitle>Visitor Info ({locale.label})</CardTitle>
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
                    <Label htmlFor={`hours-${locale.value}`}>Opening Hours</Label>
                    <Textarea
                      id={`hours-${locale.value}`}
                      placeholder="e.g. Mon-Fri: 9:00 - 18:00"
                      rows={4}
                      value={data[locale.value].hours}
                      onChange={(e) =>
                        updateField(locale.value, "hours", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`ticketPrices-${locale.value}`}>
                      Ticket Prices
                    </Label>
                    <Textarea
                      id={`ticketPrices-${locale.value}`}
                      placeholder="e.g. Adults: 25,000 UZS"
                      rows={4}
                      value={data[locale.value].ticketPrices}
                      onChange={(e) =>
                        updateField(locale.value, "ticketPrices", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`address-${locale.value}`}>Address</Label>
                    <Input
                      id={`address-${locale.value}`}
                      placeholder="Museum address"
                      value={data[locale.value].address}
                      onChange={(e) =>
                        updateField(locale.value, "address", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`phone-${locale.value}`}>Phone</Label>
                    <Input
                      id={`phone-${locale.value}`}
                      placeholder="+998 ..."
                      value={data[locale.value].phone}
                      onChange={(e) =>
                        updateField(locale.value, "phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`email-${locale.value}`}>Email</Label>
                    <Input
                      id={`email-${locale.value}`}
                      type="email"
                      placeholder="info@museum.uz"
                      value={data[locale.value].email}
                      onChange={(e) =>
                        updateField(locale.value, "email", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`mapEmbedUrl-${locale.value}`}>
                      Map Embed URL
                    </Label>
                    <Input
                      id={`mapEmbedUrl-${locale.value}`}
                      placeholder="https://maps.google.com/..."
                      value={data[locale.value].mapEmbedUrl}
                      onChange={(e) =>
                        updateField(locale.value, "mapEmbedUrl", e.target.value)
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
