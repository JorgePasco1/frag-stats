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

interface MostUsedChartProps {
  period: "monthly" | "yearly";
}

const chartConfig = {
  wearCount: {
    label: "Wears",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MostUsedChart({ period }: MostUsedChartProps) {
  const { data, isLoading } = api.globalStats.getMostUsedFragrances.useQuery({
    period,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Used Fragrances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Used Fragrances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            No data available for this period
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: `${item.house} - ${item.name}`,
    wearCount: item.wearCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Used Fragrances</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 150,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={140}
              tick={{ fontSize: 11 }}
            />
            <XAxis dataKey="wearCount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="wearCount"
              fill="var(--color-wearCount)"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
