import { Skeleton } from "~/components/ui/skeleton";

export function FormPageSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      {/* Title */}
      <Skeleton className="h-7 w-40" />

      {/* Form skeleton */}
      <div className="flex min-w-96 flex-col gap-4">
        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Text inputs */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Date picker */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Select dropdown */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* More inputs */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`num-${i}`} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Submit button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
