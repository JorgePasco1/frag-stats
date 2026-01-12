import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getDateStringFromDate } from "~/lib/dateHelper";
import { api } from "~/trpc/react";
import type { AddFragranceLogFormValues } from "./useNewLogFormValues";

export const useNewLogFormSubmission = (
  closeModal: () => void,
  setLatestSelectedDate: (date: Date) => void,
) => {
  const router = useRouter();
  const { mutate: createUserFragranceLog, isPending: isSubmissionLoading } =
    api.userFragranceLogs.createUserFragranceLog.useMutation({
      onSuccess: () => {
        toast.success("Log created successfully");
        closeModal();
        router.refresh();
      },
      onError: (error) => {
        toast.error("Failed to create log", {
          description: error.message || "Please try again.",
        });
      },
    });

  const onSubmit = (values: AddFragranceLogFormValues) => {
    setLatestSelectedDate(values.logDate);
    createUserFragranceLog({
      ...values,
      logDate: getDateStringFromDate(values.logDate),
    });
  };

  return { onSubmit, isSubmissionLoading };
};
