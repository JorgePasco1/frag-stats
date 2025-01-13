"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  const { data, isLoading } =
    api.userFragranceStats.getUserFragranceStats.useQuery({
      fragranceId: parseInt(fragranceId),
    });
  console.log({ data });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  const { fragrance, userFragranceStats } = data;
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
  console.log({ chartData });


  return (
    <div className="w-full p-8">
      <div className="text-2xl font-bold mb-4 text-center">
        {fragrance.house} - {fragrance.name}
      </div>
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
