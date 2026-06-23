export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, MapPin, Ticket } from "lucide-react"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("home")
  const tc = await getTranslations("common")
  const ta = await getTranslations("about")

  const [settings, visitorInfo, featuredExhibits, latestPosts] =
    await Promise.all([
      prisma.siteSettings.findUnique({ where: { locale } }),
      prisma.visitorInfo.findUnique({ where: { locale } }),
      prisma.exhibit.findMany({
        where: { featured: true },
        take: 6,
        include: {
          translations: { where: { locale } },
          images: { orderBy: { order: "asc" }, take: 1 },
          category: { include: { translations: { where: { locale } } } },
        },
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          translations: { where: { locale } },
        },
      }),
    ])

  const heroTitle = settings?.heroTitle || t("heroTitle")
  const heroSubtitle = settings?.heroSubtitle || t("heroSubtitle")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-stone-950 dark:to-yellow-950/20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {settings?.heroImage && (
          <div className="absolute inset-0">
            <img
              src={settings.heroImage}
              alt=""
              className="h-full w-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/60 px-4 py-1.5 text-sm text-amber-800 backdrop-blur-sm dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            {t("welcomeText")}
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-stone-100">
            {heroTitle}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-stone-600 sm:text-lg md:text-xl dark:text-stone-400">
            {heroSubtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/exhibits" />}
              className="gap-2 bg-amber-700 px-8 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              {tc("exhibits")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/about" />}
              className="gap-2 border-stone-300 px-8 dark:border-stone-700"
            >
              {tc("about")}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-stone-950" />
      </section>

      {/* About Section */}
      {settings?.aboutText && (
        <section className="bg-white py-12 sm:py-20 dark:bg-stone-950">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-stone-900 sm:mb-8 sm:text-3xl dark:text-stone-100">
              {tc("about")}
            </h2>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400">
              {settings.aboutText}
            </p>
          </div>
        </section>
      )}

      {/* Featured Exhibits */}
      {featuredExhibits.length > 0 && (
        <section className="bg-stone-50 py-12 sm:py-20 dark:bg-stone-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                {t("featuredExhibits")}
              </h2>
              <Button
                variant="ghost"
                render={<Link href="/exhibits" />}
                className="hidden gap-2 text-amber-700 sm:inline-flex dark:text-amber-400"
              >
                {tc("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {featuredExhibits.map((exhibit) => {
                const name = exhibit.translations[0]?.name || "Untitled"
                const image = exhibit.images[0]
                const categoryName =
                  exhibit.category?.translations[0]?.name

                return (
                  <Link
                    key={exhibit.id}
                    href={`/exhibits/${exhibit.slug}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.alt || name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-stone-400">
                            <svg
                              className="h-16 w-16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        {categoryName && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-200">
                              {categoryName}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                          {name}
                        </CardTitle>
                        {exhibit.period && (
                          <CardDescription>{exhibit.period}</CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button
                variant="outline"
                render={<Link href="/exhibits" />}
                className="gap-2"
              >
                {tc("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestPosts.length > 0 && (
        <section className="bg-white py-12 sm:py-20 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                {t("latestNews")}
              </h2>
              <Button
                variant="ghost"
                render={<Link href="/news" />}
                className="hidden gap-2 text-amber-700 sm:inline-flex dark:text-amber-400"
              >
                {tc("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {latestPosts.map((post) => {
                const title = post.translations[0]?.title || "Untitled"
                const excerpt = post.translations[0]?.excerpt

                return (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      {post.coverImage && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 dark:bg-stone-800">
                          <img
                            src={post.coverImage}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardDescription>
                          {new Date(post.createdAt).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                        <CardTitle className="line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      {excerpt && (
                        <CardContent>
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {excerpt}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                )
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button
                variant="outline"
                render={<Link href="/news" />}
                className="gap-2"
              >
                {tc("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Visit Us */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 sm:py-20 dark:from-amber-950/20 dark:via-stone-900 dark:to-yellow-950/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-stone-900 sm:mb-12 sm:text-3xl dark:text-stone-100">
            {t("visitUs")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle>{ta("visitingHours")}</CardTitle>
              </CardHeader>
              <CardContent>
                {visitorInfo?.hours ? (
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {visitorInfo.hours}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                  <Ticket className="h-6 w-6" />
                </div>
                <CardTitle>{ta("ticketPrices")}</CardTitle>
              </CardHeader>
              <CardContent>
                {visitorInfo?.ticketPrices ? (
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {visitorInfo.ticketPrices}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle>{ta("location")}</CardTitle>
              </CardHeader>
              <CardContent>
                {visitorInfo?.address ? (
                  <p className="text-sm text-muted-foreground">
                    {visitorInfo.address}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
                {visitorInfo?.phone && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {visitorInfo.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
