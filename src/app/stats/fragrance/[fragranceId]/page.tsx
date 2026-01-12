"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

import { api } from "~/trpc/react";

const FragranceStatsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  const utils = api.useUtils();
  const { data, isLoading } =
    api.userFragranceStats.getUserFragranceStats.useQuery({
      fragranceId: parseInt(fragranceId),
    });

  const { mutate: regenerateSummary, isPending: isRegenerating } =
    api.userFragranceStats.regenerateNoteSummary.useMutation({
      onSuccess: () => {
        void utils.userFragranceStats.getUserFragranceStats.invalidate();
      },
    });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

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
