import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function FragranceStatsPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 p-8">
      {/* Title */}
      <div className="flex justify-center">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Note Summary Card */}
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

      {/* Chart Card */}
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
