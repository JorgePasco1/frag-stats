import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

function HeroStatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-medium">{title}</div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );
}

function SmallChartCardSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-medium">{title}</div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

export function StatsPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stats Dashboard</h1>
        <Skeleton className="h-10 w-56" />
      </div>

      {/* Hero stats - 3x3 grid */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <HeroStatCardSkeleton key={`row1-${i}`} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <HeroStatCardSkeleton key={`row2-${i}`} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <HeroStatCardSkeleton key={`row3-${i}`} />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCardSkeleton title="Most Used Fragrances" />
        <ChartCardSkeleton title="Use Case Distribution" />
      </div>

      {/* Context charts */}
      <div className="grid gap-6 md:grid-cols-3">
        <SmallChartCardSkeleton title="Weather Distribution" />
        <SmallChartCardSkeleton title="Time of Day" />
        <SmallChartCardSkeleton title="Day of Week" />
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-sm font-medium">Collection Overview</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-sm font-medium">Discovery Insights</div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
