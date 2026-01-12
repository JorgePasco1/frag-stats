"use client";

import { ErrorDisplay } from "~/components/ErrorDisplay";

export default function FragranceDetailsError({
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
      title="Failed to load fragrance details"
    />
  );
}
