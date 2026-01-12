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

interface UseCaseChartProps {
  period: "monthly" | "yearly";
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Helper to format use case labels
function formatUseCase(useCase: string | null): string {
  if (!useCase) return "Unknown";
  return useCase
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function UseCaseChart({ period }: UseCaseChartProps) {
  const { data, isLoading } =
    api.globalStats.getUseCaseDistribution.useQuery({
      period,
    });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Use Case Distribution</CardTitle>
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
          <CardTitle>Use Case Distribution</CardTitle>
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
    useCase: formatUseCase(item.useCase),
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Use Case Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 100,
            }}
          >
            <YAxis
              dataKey="useCase"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={90}
              tick={{ fontSize: 11 }}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
