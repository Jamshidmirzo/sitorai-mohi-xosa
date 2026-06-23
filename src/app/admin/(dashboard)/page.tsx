export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, FileText, Image, ClipboardList } from "lucide-react"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

export default async function AdminDashboardPage() {
  // Fetch counts in parallel
  const [exhibitCount, postCount, galleryCount, responseCount] =
    await Promise.all([
      prisma.exhibit.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.galleryImage.count(),
      prisma.surveyResponse.count(),
    ])

  // Fetch responses per survey for bar chart
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

  // Fetch exhibits per category for pie chart
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

  // Fetch responses per day for the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const recentResponsesRaw = await prisma.surveyResponse.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  // Group by date
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
  const timelineData = Array.from(dateCountMap.entries()).map(
    ([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
    })
  )

  // Fetch recent survey responses for the activity table
  const recentResponses = await prisma.surveyResponse.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      survey: { include: { translations: { where: { locale: "en" } } } },
    },
  })

  const stats = [
    {
      title: "Total Exhibits",
      value: exhibitCount,
      description: "Managed exhibits",
      icon: Package,
    },
    {
      title: "Published Posts",
      value: postCount,
      description: "News articles",
      icon: FileText,
    },
    {
      title: "Gallery Photos",
      value: galleryCount,
      description: "Uploaded images",
      icon: Image,
    },
    {
      title: "Survey Responses",
      value: responseCount,
      description: "Total submissions",
      icon: ClipboardList,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of Sitorai Mohi Xosa museum
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        surveyData={surveyChartData}
        timelineData={timelineData}
        categoryData={categoryChartData}
      />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {recentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No survey responses yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.survey.translations[0]?.title ?? "Untitled"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {response.locale.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {response.sessionId.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-right">
                      {response.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
