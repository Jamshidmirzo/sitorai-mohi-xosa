export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"

export default async function AdminDashboardPage() {
  const [exhibitCount, postCount, galleryCount, responseCount] =
    await Promise.all([
      prisma.exhibit.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.galleryImage.count(),
      prisma.surveyResponse.count(),
    ])

  const surveys = await prisma.survey.findMany({
    include: {
      translations: { where: { locale: "en" } },
      _count: { select: { responses: true } },
    },
  })
  const surveyChartData = surveys.map((s) => ({
    name: s.translations[0]?.title ?? "Untitled",
    responses: s._count.responses,
  }))

  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale: "en" } },
      _count: { select: { exhibits: true } },
    },
  })
  const categoryChartData = categories
    .map((c) => ({
      name: c.translations[0]?.name ?? "Unknown",
      count: c._count.exhibits,
    }))
    .filter((c) => c.count > 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const recentResponsesRaw = await prisma.surveyResponse.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  const dateCountMap = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split("T")[0]
    dateCountMap.set(key, 0)
  }
  for (const r of recentResponsesRaw) {
    const key = r.createdAt.toISOString().split("T")[0]
    if (dateCountMap.has(key)) {
      dateCountMap.set(key, (dateCountMap.get(key) ?? 0) + 1)
    }
  }
  const timelineData = Array.from(dateCountMap.entries()).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count,
  }))

  const recent = await prisma.surveyResponse.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      survey: { include: { translations: { where: { locale: "en" } } } },
    },
  })
  const recentResponses = recent.map((r) => ({
    id: r.id,
    surveyTitle: r.survey.translations[0]?.title ?? "Untitled",
    locale: r.locale,
    sessionId: r.sessionId,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <DashboardClient
      stats={{ exhibitCount, postCount, galleryCount, responseCount }}
      surveyData={surveyChartData}
      timelineData={timelineData}
      categoryData={categoryChartData}
      recentResponses={recentResponses}
    />
  )
}
