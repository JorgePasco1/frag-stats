import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function LogsPageSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-4">
      <h1 className="text-xl font-bold">Logs</h1>
      {/* New Log Button skeleton */}
      <Button disabled variant="outline" className="w-32">
        <Skeleton className="h-4 w-20" />
      </Button>

      {/* Log groups skeleton */}
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} className="flex flex-col items-center gap-2">
          {/* Date header */}
          <Skeleton className="h-10 w-40" />

          {/* Log cards */}
          <div className="flex flex-col gap-4 p-2">
            {Array.from({ length: 2 }).map((_, cardIndex) => (
              <Card key={cardIndex}>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Skeleton className="h-5 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
