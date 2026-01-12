"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export function CollectionOverview() {
  const { data, isLoading } = api.globalStats.getCollectionOverview.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium">Total Fragrances</span>
            <span className="text-sm font-bold">{data.totalFragrances}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium">Bottles / Decants</span>
            <span className="text-sm font-bold">
              {data.bottles} / {data.decants}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium">Total ML</span>
            <span className="text-sm font-bold">{data.totalMl.toFixed(1)} ml</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium">Collection Value</span>
            <span className="text-sm font-bold">
              ${data.totalValue.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
