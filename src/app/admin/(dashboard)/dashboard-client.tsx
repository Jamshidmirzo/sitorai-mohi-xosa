"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
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
import {
  Package,
  FileText,
  Image,
  ClipboardList,
  PlusCircle,
  Globe,
  HelpCircle,
  ArrowRight,
} from "lucide-react"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { useAdminT } from "@/components/admin/admin-locale"

type Stats = {
  exhibitCount: number
  postCount: number
  galleryCount: number
  responseCount: number
}

type SurveyDatum = { name: string; responses: number }
type TimelineDatum = { date: string; count: number }
type CategoryDatum = { name: string; count: number }

type RecentResponse = {
  id: string
  surveyTitle: string
  locale: string
  sessionId: string
  createdAt: string
}

function greetingKey(hour: number) {
  if (hour < 12) return "dash.greetingMorning"
  if (hour < 18) return "dash.greetingDay"
  return "dash.greetingEvening"
}

export function DashboardClient({
  stats,
  surveyData,
  timelineData,
  categoryData,
  recentResponses,
}: {
  stats: Stats
  surveyData: SurveyDatum[]
  timelineData: TimelineDatum[]
  categoryData: CategoryDatum[]
  recentResponses: RecentResponse[]
}) {
  const { t, locale } = useAdminT()
  const { data: session } = useSession()
  const userName =
    session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "—"
  const hour = new Date().getHours()
  const greet = t(greetingKey(hour), { name: userName })
  const dateFmt = locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US"

  const cards = [
    {
      title: t("dash.totalExhibits"),
      value: stats.exhibitCount,
      description: t("dash.totalExhibitsHint"),
      icon: Package,
      tint: "from-amber-500/15 to-amber-500/0 text-amber-700 dark:text-amber-300",
    },
    {
      title: t("dash.publishedPosts"),
      value: stats.postCount,
      description: t("dash.publishedPostsHint"),
      icon: FileText,
      tint: "from-sky-500/15 to-sky-500/0 text-sky-700 dark:text-sky-300",
    },
    {
      title: t("dash.galleryPhotos"),
      value: stats.galleryCount,
      description: t("dash.galleryPhotosHint"),
      icon: Image,
      tint: "from-emerald-500/15 to-emerald-500/0 text-emerald-700 dark:text-emerald-300",
    },
    {
      title: t("dash.surveyResponses"),
      value: stats.responseCount,
      description: t("dash.surveyResponsesHint"),
      icon: ClipboardList,
      tint: "from-rose-500/15 to-rose-500/0 text-rose-700 dark:text-rose-300",
    },
  ]

  const quickActions = [
    {
      title: t("dash.qAddExhibit"),
      hint: t("dash.qAddExhibitHint"),
      icon: PlusCircle,
      href: "/admin/exhibits/new",
      tint: "from-amber-500/15 to-amber-700/10 hover:from-amber-500/25 hover:to-amber-700/20 border-amber-300/30",
    },
    {
      title: t("dash.qViewSite"),
      hint: t("dash.qViewSiteHint"),
      icon: Globe,
      href: `/${locale}`,
      tint: "from-sky-500/15 to-sky-700/10 hover:from-sky-500/25 hover:to-sky-700/20 border-sky-300/30",
      external: true,
    },
    {
      title: t("dash.qManageQuiz"),
      hint: t("dash.qManageQuizHint"),
      icon: HelpCircle,
      href: "/admin/exhibits",
      tint: "from-emerald-500/15 to-emerald-700/10 hover:from-emerald-500/25 hover:to-emerald-700/20 border-emerald-300/30",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting card */}
      <Card className="border-amber-200/40 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/70 via-background to-background dark:from-amber-950/30">
        <CardContent className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{greet}</h1>
            <p className="text-muted-foreground mt-1">{t("dash.welcomeLead")}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline" className="text-xs gap-1">
              <Package className="size-3" />
              {stats.exhibitCount} {t("dash.totalExhibits").toLowerCase()}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <ClipboardList className="size-3" />
              {stats.responseCount} {t("dash.surveyResponses").toLowerCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick action tiles */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          {t("dash.quick")}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((a) => {
            const inner = (
              <Card
                className={`group cursor-pointer transition-all bg-gradient-to-br ${a.tint} border`}
              >
                <CardContent className="py-5 flex items-start gap-4">
                  <div className="rounded-lg bg-background/60 p-2.5 shadow-sm">
                    <a.icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium leading-tight">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {a.hint}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardContent>
              </Card>
            )
            if (a.external) {
              return (
                <a key={a.title} href={a.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              )
            }
            return (
              <Link key={a.title} href={a.href}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              <div
                className={`rounded-md p-1.5 bg-gradient-to-br ${c.tint}`}
              >
                <c.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
              <p className="text-xs text-muted-foreground">{c.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        surveyData={surveyData}
        timelineData={timelineData}
        categoryData={categoryData}
      />

      {/* Recent responses */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dash.recentResponses")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("dash.noResponses")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dash.colSurvey")}</TableHead>
                  <TableHead>{t("dash.colLocale")}</TableHead>
                  <TableHead>{t("dash.colSession")}</TableHead>
                  <TableHead className="text-right">{t("dash.colDate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResponses.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.surveyTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.locale.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {r.sessionId.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(r.createdAt).toLocaleDateString(dateFmt, {
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
