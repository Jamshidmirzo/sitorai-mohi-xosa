"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ClipboardList,
  TrendingUp,
  PieChart as PieIcon,
  Info,
} from "lucide-react"
import { useAdminT } from "@/components/admin/admin-locale"

interface SurveyChartData {
  name: string
  responses: number
}
interface TimelineChartData {
  date: string
  count: number
}
interface CategoryChartData {
  name: string
  count: number
}
interface DashboardChartsProps {
  surveyData: SurveyChartData[]
  timelineData: TimelineChartData[]
  categoryData: CategoryChartData[]
}

const PALETTE = [
  "#D8B978", // gold
  "#3C8E88", // turquoise
  "#B98C46", // brass
  "#62b083", // green
  "#9aa0b5", // muted blue
  "#d9745f", // coral
  "#6a2d56", // plum
  "#1d3a52", // teal
]

function ChartCard({
  icon: Icon,
  title,
  hint,
  empty,
  hasData,
  children,
}: {
  icon: typeof ClipboardList
  title: string
  hint: string
  empty: string
  hasData: boolean
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-2 mt-0.5">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm font-medium leading-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-xs mt-1 leading-snug">
              {hint}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="size-5 opacity-50" />
            {empty}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

function chartTooltipStyle() {
  return {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    padding: "8px 10px",
  }
}

export function DashboardCharts({
  surveyData,
  timelineData,
  categoryData,
}: DashboardChartsProps) {
  const { t } = useAdminT()
  const respLabel = t("charts.responses")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartCard
        icon={ClipboardList}
        title={t("charts.surveys")}
        hint={t("charts.surveysHint")}
        empty={t("charts.surveysEmpty")}
        hasData={surveyData.length > 0}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={surveyData}
            layout="vertical"
            margin={{ top: 5, right: 16, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={110}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              contentStyle={chartTooltipStyle()}
              formatter={(value: number) => [`${value} ${respLabel}`, ""]}
              labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
            />
            <Bar dataKey="responses" fill={PALETTE[0]} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        icon={TrendingUp}
        title={t("charts.timeline")}
        hint={t("charts.timelineHint")}
        empty={t("charts.timelineEmpty")}
        hasData={timelineData.some((d) => d.count > 0)}
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={timelineData}
            margin={{ top: 5, right: 16, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ stroke: PALETTE[1], strokeWidth: 1 }}
              contentStyle={chartTooltipStyle()}
              formatter={(value: number) => [`${value} ${respLabel}`, ""]}
              labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={PALETTE[1]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: PALETTE[1] }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        icon={PieIcon}
        title={t("charts.categories")}
        hint={t("charts.categoriesHint")}
        empty={t("charts.categoriesEmpty")}
        hasData={categoryData.length > 0}
      >
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="55%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
                nameKey="name"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle()}
                formatter={(value: number, name: string) => [
                  `${value}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex-1 space-y-1.5 text-xs min-w-0">
            {categoryData.map((c, i) => (
              <li
                key={c.name}
                className="flex items-center gap-2 min-w-0"
              >
                <span
                  className="inline-block size-2.5 rounded-sm shrink-0"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                />
                <span className="truncate flex-1">{c.name}</span>
                <span className="font-mono font-medium text-muted-foreground">
                  {c.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>
    </div>
  )
}
