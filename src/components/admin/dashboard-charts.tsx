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
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(10, 75%, 55%)",
  "hsl(190, 70%, 50%)",
  "hsl(50, 80%, 50%)",
  "hsl(330, 65%, 55%)",
]

export function DashboardCharts({
  surveyData,
  timelineData,
  categoryData,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Responses per Survey - Bar Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Responses per Survey</CardTitle>
          <CardDescription>Total submissions by survey</CardDescription>
        </CardHeader>
        <CardContent>
          {surveyData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No survey data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={surveyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="responses"
                  fill="hsl(220, 70%, 50%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Responses Over Time - Line Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Responses Over Time</CardTitle>
          <CardDescription>Daily submissions (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          {timelineData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No response data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={timelineData}
                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(160, 60%, 45%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Popular Categories - Pie Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Exhibits by Category</CardTitle>
          <CardDescription>Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No category data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
