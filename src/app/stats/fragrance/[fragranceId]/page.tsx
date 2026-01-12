"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";

import { api } from "~/trpc/react";

const FragranceStatsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  const utils = api.useUtils();
  const { data, isLoading, error } =
    api.userFragranceStats.getUserFragranceStats.useQuery({
      fragranceId: parseInt(fragranceId),
    });

  const { mutate: regenerateSummary, isPending: isRegenerating } =
    api.userFragranceStats.regenerateNoteSummary.useMutation({
      onSuccess: () => {
        toast.success("Summary regenerated successfully");
        void utils.userFragranceStats.getUserFragranceStats.invalidate();
      },
      onError: (error) => {
        toast.error("Failed to regenerate summary", {
          description: error.message || "Please try again.",
        });
      },
    });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4 p-8">
        <div className="flex justify-center">
          <Skeleton className="h-8 w-64" />
        </div>
        <Card className="flex w-full flex-col gap-4">
          <CardContent className="flex flex-1 flex-col gap-4">
            <CardHeader>
              <CardTitle>Note Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-9 w-36" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enjoyment over time</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center gap-4 p-8">
        <p className="text-destructive">Failed to load fragrance statistics</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex w-full flex-col items-center gap-4 p-8">
        <p className="text-muted-foreground">No data available for this fragrance</p>
      </div>
    );
  }

  const { fragrance, userFragranceStats, noteSummary } = data;
  const chartData = userFragranceStats.map((log) => ({
    date: new Date(log.logDate)
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "/"),
    enjoyment: log.enjoyment,
  }));

  return (
    <div className="flex w-full flex-col gap-4 p-8">
      <div className="text-center text-2xl font-bold">
        {fragrance.house} - {fragrance.name}
      </div>
      <Card className="flex w-full flex-col gap-4">
        <CardContent className="flex flex-1 flex-col gap-4">
          <CardHeader>
            <CardTitle>Note Summary</CardTitle>
          </CardHeader>
          <div className="whitespace-pre-wrap">{noteSummary}</div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                regenerateSummary({ fragranceId: parseInt(fragranceId) })
              }
              disabled={isRegenerating}
            >
              {isRegenerating ? "Regenerating..." : "Regenerate summary"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Enjoyment over time</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="enjoyment"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-desktop)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FragranceStatsPage;

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
