import { Skeleton } from "~/components/ui/skeleton";

function FragranceCardSkeleton() {
  return (
    <div className="flex w-80 flex-col rounded-lg border-4 border-solid border-slate-900 bg-slate-800">
      {/* Image area */}
      <div className="flex justify-center bg-white">
        <Skeleton className="h-[200px] w-[200px] rounded-t-lg" />
      </div>
      {/* Content area */}
      <div className="flex flex-col items-center gap-4 p-6">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function CollectionPageSkeleton() {
  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Your fragrances</h1>

      {/* Sort dropdown skeleton */}
      <Skeleton className="h-10 w-40" />

      {/* Tabs skeleton */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-2 rounded-md bg-muted p-1">
          <Skeleton className="h-8 w-28 rounded-sm" />
          <Skeleton className="h-8 w-28 rounded-sm" />
        </div>

        {/* Cards grid skeleton */}
        <div className="flex w-full flex-wrap justify-center gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <FragranceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
