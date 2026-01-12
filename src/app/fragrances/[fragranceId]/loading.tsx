import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
