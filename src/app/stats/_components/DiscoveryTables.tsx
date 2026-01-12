"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

interface DiscoveryTablesProps {
  period: "monthly" | "yearly";
}

export function DiscoveryTables({ period }: DiscoveryTablesProps) {
  const { data, isLoading } = api.globalStats.getDiscoveryStats.useQuery({
    period,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discovery Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discovery Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            Shelf Queens (Oldest, Least Worn)
          </h3>
          {data.shelfQueens.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No shelf queens found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fragrance</TableHead>
                  <TableHead className="text-right">Days Owned</TableHead>
                  <TableHead className="text-right">Wears</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.shelfQueens.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs">
                      {item.house} - {item.name}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {item.daysOwned}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {item.wearCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">
            Hidden Gems (High Rating, Low Wear Count)
          </h3>
          {data.hiddenGems.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hidden gems found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fragrance</TableHead>
                  <TableHead className="text-right">Avg Rating</TableHead>
                  <TableHead className="text-right">Wears</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.hiddenGems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs">
                      {item.house} - {item.name}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {item.avgRating}/10
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {item.wearCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
