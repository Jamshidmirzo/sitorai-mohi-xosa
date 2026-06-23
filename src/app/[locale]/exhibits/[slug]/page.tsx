export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ExhibitGallery } from "./exhibit-gallery"
import { ArrowLeft, ClipboardList } from "lucide-react"
import QRCode from "qrcode"

export default async function ExhibitDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations("exhibits")
  const tc = await getTranslations("common")

  const exhibit = await prisma.exhibit.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      images: { orderBy: { order: "asc" } },
      category: { include: { translations: { where: { locale } } } },
      hall: { include: { translations: { where: { locale } } } },
      surveys: { where: { active: true }, take: 1 },
    },
  })

  if (!exhibit) notFound()

  const name = exhibit.translations[0]?.name ?? slug
  const description = exhibit.translations[0]?.description ?? ""
  const categoryName = exhibit.category?.translations[0]?.name
  const hallName = exhibit.hall?.translations[0]?.name
  const survey = exhibit.surveys[0]

  const images = exhibit.images.map((img) => ({
    url: img.url,
    alt: img.alt ?? name,
  }))

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const exhibitUrl = `${baseUrl}/${locale}/exhibits/${slug}`
  const qrDataUrl = await QRCode.toDataURL(exhibitUrl, {
    margin: 2,
    width: 200,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              {tc("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/exhibits" />}>
              {tc("exhibits")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {images.length > 0 ? (
            <ExhibitGallery images={images} />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
              <span className="text-6xl text-muted-foreground/30">
                &#9733;
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryName && (
                <Badge variant="secondary">{categoryName}</Badge>
              )}
              {exhibit.period && (
                <Badge variant="outline">{exhibit.period}</Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            {exhibit.period && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("period")}
                </p>
                <p className="text-sm">{exhibit.period}</p>
              </div>
            )}
            {exhibit.material && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("material")}
                </p>
                <p className="text-sm">{exhibit.material}</p>
              </div>
            )}
            {categoryName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("category")}
                </p>
                <p className="text-sm">{categoryName}</p>
              </div>
            )}
            {hallName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("hall")}
                </p>
                <p className="text-sm">{hallName}</p>
              </div>
            )}
          </div>

          <Separator />

          {description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {survey && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <p className="font-medium">{t("takeSurvey")}</p>
              </div>
            </div>
          )}

          <Button variant="outline" render={<Link href="/exhibits" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tc("back")}
          </Button>

          <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Share this exhibit</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR Code" className="h-32 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
