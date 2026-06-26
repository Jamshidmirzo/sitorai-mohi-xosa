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
import { QrCode } from "./qr-code"
import { ArrowLeft } from "lucide-react"
import { getExhibitBySlug, getAllExhibitSlugs } from "@/lib/static-data"

export function generateStaticParams() {
  const locales = ["uz", "ru", "en"]
  return getAllExhibitSlugs().flatMap((slug) =>
    locales.map((locale) => ({ locale, slug })),
  )
}

export default async function ExhibitDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations("exhibits")
  const tc = await getTranslations("common")

  const exhibit = getExhibitBySlug(slug, locale)
  if (!exhibit) notFound()

  const exhibitUrl = `https://mohixossa.uz/${locale}/exhibits/${slug}`

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
            <BreadcrumbPage>{exhibit.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {exhibit.images.length > 0 ? (
            <ExhibitGallery images={exhibit.images} />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
              <span className="text-6xl text-muted-foreground/30">&#9733;</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{exhibit.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {exhibit.categoryName && (
                <Badge variant="secondary">{exhibit.categoryName}</Badge>
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
                <p className="text-sm font-medium text-muted-foreground">{t("period")}</p>
                <p className="text-sm">{exhibit.period}</p>
              </div>
            )}
            {exhibit.material && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("material")}</p>
                <p className="text-sm">{exhibit.material}</p>
              </div>
            )}
            {exhibit.categoryName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("category")}</p>
                <p className="text-sm">{exhibit.categoryName}</p>
              </div>
            )}
            {exhibit.hallName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hall")}</p>
                <p className="text-sm">{exhibit.hallName}</p>
              </div>
            )}
          </div>

          <Separator />

          {exhibit.description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: exhibit.description }} />
            </div>
          )}

          <Button variant="outline" render={<Link href="/exhibits" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tc("back")}
          </Button>

          <QrCode url={exhibitUrl} />
        </div>
      </div>
    </div>
  )
}
