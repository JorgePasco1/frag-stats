"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { api } from "~/trpc/react";

interface ContextChartsProps {
  period: "monthly" | "yearly";
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

function formatWeather(weather: string | null): string {
  if (!weather) return "Unknown";
  return weather.charAt(0).toUpperCase() + weather.slice(1);
}

function formatTimeOfDay(timeOfDay: string | null): string {
  if (!timeOfDay) return "Unknown";
  return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
}

export function ContextCharts({ period }: ContextChartsProps) {
  const { data, isLoading } = api.globalStats.getContextStats.useQuery({
    period,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="h-4 w-32 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const weatherData = data.weather.map((item) => ({
    name: formatWeather(item.weather),
    count: item.count,
  }));

  const timeOfDayData = data.timeOfDay.map((item) => ({
    name: formatTimeOfDay(item.timeOfDay),
    count: item.count,
  }));

  const dayOfWeekData = data.dayOfWeek
    .map((item) => ({
      name: item.dayOfWeek?.trim() ?? "Unknown",
      count: item.count,
      dayNum: item.dayNum,
    }))
    .sort((a, b) => a.dayNum - b.dayNum);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Weather Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={weatherData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time of Day</CardTitle>
        </CardHeader>
        <CardContent>
          {timeOfDayData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={timeOfDayData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          {dayOfWeekData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={dayOfWeekData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
