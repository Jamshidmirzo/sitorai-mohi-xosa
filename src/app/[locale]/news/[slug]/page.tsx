export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
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
import { ArrowLeft, Calendar } from "lucide-react"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations("news")
  const tc = await getTranslations("common")

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
    },
  })

  if (!post || !post.published) notFound()

  const title = post.translations[0]?.title ?? slug
  const content = post.translations[0]?.content ?? ""
  const date = new Date(post.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              {tc("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/news" />}>
              {tc("news")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {post.coverImage && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={post.coverImage}
            alt={title}
            className="max-h-[400px] w-full object-cover"
          />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {t("publishedOn")} {date}
          </span>
        </div>
      </div>

      <Separator className="mb-8" />

      {content ? (
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-muted-foreground">No content available.</p>
      )}

      <Separator className="my-8" />

      <Button variant="outline" render={<Link href="/news" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {tc("back")}
      </Button>
    </div>
  )
}
