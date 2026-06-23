export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Ticket } from "lucide-react"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("about")

  const settings = await prisma.siteSettings.findUnique({ where: { locale } })
  const visitorInfo = await prisma.visitorInfo.findUnique({ where: { locale } })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      {settings?.aboutText && (
        <div className="mx-auto mb-12 max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-center dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: settings.aboutText }}
          />
        </div>
      )}

      <Separator className="my-10" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle>{t("visitingHours")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {visitorInfo?.hours ? (
              <div
                className="whitespace-pre-line text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: visitorInfo.hours }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Information coming soon
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Ticket className="h-5 w-5" />
              </div>
              <CardTitle>{t("ticketPrices")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {visitorInfo?.ticketPrices ? (
              <div
                className="whitespace-pre-line text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: visitorInfo.ticketPrices }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Information coming soon
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle>{t("location")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {visitorInfo?.address ? (
              <p className="text-sm text-muted-foreground">
                {visitorInfo.address}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bukhara, Uzbekistan
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {visitorInfo?.mapEmbedUrl && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">{t("howToGetThere")}</h2>
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={visitorInfo.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  )
}
