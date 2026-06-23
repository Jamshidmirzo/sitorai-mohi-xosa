export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("news")
  const tc = await getTranslations("common")

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      translations: { where: { locale } },
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      {posts.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {tc("noResults")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {posts.map((post) => {
            const title = post.translations[0]?.title ?? post.slug
            const excerpt = post.translations[0]?.excerpt ?? ""
            const date = new Date(post.createdAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20">
                        <span className="text-4xl text-muted-foreground/30">
                          &#9998;
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <p className="text-xs text-muted-foreground">
                      {t("publishedOn")} {date}
                    </p>
                    <h2 className="line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {excerpt}
                      </p>
                    )}
                    <p className="text-sm font-medium text-primary">
                      {tc("readMore")} &rarr;
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
