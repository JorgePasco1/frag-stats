"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HeroStats } from "./HeroStats";
import { MostUsedChart } from "./MostUsedChart";
import { UseCaseChart } from "./UseCaseChart";
import { ContextCharts } from "./ContextCharts";
import { CollectionOverview } from "./CollectionOverview";
import { DiscoveryTables } from "./DiscoveryTables";

type Period = "monthly" | "yearly";

export function StatsPageContent() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stats Dashboard</h1>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="monthly">Last 30 Days</TabsTrigger>
            <TabsTrigger value="yearly">Last 365 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <HeroStats period={period} />

      <div className="grid gap-6 md:grid-cols-2">
        <MostUsedChart period={period} />
        <UseCaseChart period={period} />
      </div>

      <ContextCharts period={period} />

      <div className="grid gap-6 md:grid-cols-2">
        <CollectionOverview />
        <DiscoveryTables period={period} />
      </div>
    </div>
  );
}
