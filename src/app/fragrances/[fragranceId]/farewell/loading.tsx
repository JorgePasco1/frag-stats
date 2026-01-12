import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      {/* Title */}
      <Skeleton className="h-6 w-40" />

      {/* Form skeleton */}
      <div className="flex flex-col gap-2 min-w-80">
        {/* Date picker */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Select dropdown */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}
