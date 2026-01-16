import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { ParsedLogEntry } from "../BulkImport.types";
import { getDateStringFromDate } from "~/lib/dateHelper";

export function useBulkSave(
  onProgressUpdate: (update: {
    total: number;
    completed: number;
    failed: number;
    errors: Array<{ entryId: string; error: string }>;
  }) => void,
  onComplete: () => void,
) {
  const router = useRouter();
  const createLogMutation =
    api.userFragranceLogs.createUserFragranceLog.useMutation();

  const executeBulkSave = async (validEntries: ParsedLogEntry[]) => {
    const total = validEntries.length;
    let completed = 0;
    let failed = 0;
    const errors: Array<{ entryId: string; error: string }> = [];

    onProgressUpdate({ total, completed, failed, errors });

    for (const entry of validEntries) {
      try {
        await createLogMutation.mutateAsync({
          fragranceId: entry.matchedFragranceId!,
          userFragranceId: entry.matchedUserFragranceId!,
          logDate: getDateStringFromDate(entry.date!),
          timeOfDay: entry.timeOfDay ?? undefined,
          weather: entry.weather ?? undefined,
          enjoyment: entry.enjoyment ?? undefined,
          notes: entry.notes ?? undefined,
        });

        completed++;
        onProgressUpdate({ total, completed, failed, errors });
      } catch (error) {
        failed++;
        errors.push({
          entryId: entry.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        onProgressUpdate({ total, completed, failed, errors });
      }
    }

    router.refresh();
    onComplete();
  };

  return { executeBulkSave, isLoading: createLogMutation.isPending };
}
