import { Button } from "~/components/ui/button";

type SaveProgressStepProps = {
  progress: {
    total: number;
    completed: number;
    failed: number;
    errors: Array<{ entryId: string; error: string }>;
  };
  onClose: () => void;
};

export function SaveProgressStep({ progress, onClose }: SaveProgressStepProps) {
  const { total, completed, failed, errors } = progress;
  const percentage = total > 0 ? ((completed + failed) / total) * 100 : 0;
  const isComplete = completed + failed === total;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Saving logs...</span>
          <span>
            {completed + failed} / {total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {isComplete && (
        <div className="space-y-2">
          {completed > 0 && (
            <div className="text-green-600">
              {completed} log{completed !== 1 ? "s" : ""} saved successfully
            </div>
          )}
          {failed > 0 && (
            <div className="space-y-1">
              <div className="text-red-600">
                {failed} log{failed !== 1 ? "s" : ""} failed to save
              </div>
              {errors.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground">
                    View errors
                  </summary>
                  <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
                    {errors.map((err, idx) => (
                      <li key={idx} className="text-xs text-red-500">
                        {err.error}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {isComplete && (
        <Button onClick={onClose} className="mt-2">
          Done
        </Button>
      )}
    </div>
  );
}
