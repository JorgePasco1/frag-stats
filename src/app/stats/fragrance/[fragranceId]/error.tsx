"use client";

import { ErrorDisplay } from "~/components/ErrorDisplay";

export default function FragranceStatsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      title="Failed to load fragrance statistics"
    />
  );
}
