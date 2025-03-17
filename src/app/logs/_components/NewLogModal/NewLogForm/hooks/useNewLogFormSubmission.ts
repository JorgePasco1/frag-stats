import { useRouter } from "next/navigation";

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
        closeModal();
        router.refresh();
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
