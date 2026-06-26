import { getTranslations, setRequestLocale } from "next-intl/server"
import { getVisitorInfo } from "@/lib/static-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "./contact-form"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("contact")
  const tc = await getTranslations("common")
  const visitorInfo = getVisitorInfo(locale)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {visitorInfo?.phone && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {visitorInfo.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {visitorInfo?.email && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {visitorInfo.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {visitorInfo?.address && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {visitorInfo.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!visitorInfo?.phone &&
            !visitorInfo?.email &&
            !visitorInfo?.address && (
              <Card>
                <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                  {tc("comingSoon")}
                </CardContent>
              </Card>
            )}

          {visitorInfo?.mapEmbedUrl && (
            <div className="overflow-hidden rounded-xl border">
              <iframe
                src={visitorInfo.mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
