import { useRouter } from "next/navigation";

import { getDateStringFromDate } from "~/lib/dateHelper";
import { api } from "~/trpc/react";
import type { AddFragranceFormValues } from "./useNewLogFormValues";

export const useNewLogFormSubmission = (closeModal: () => void) => {
  const router = useRouter();
  const { mutate: createUserFragranceLog, isPending: isSubmissionLoading } =
    api.userFragranceLogs.createUserFragranceLog.useMutation({
      onSuccess: () => {
        closeModal();
        router.refresh();
      },
    });

  const onSubmit = (values: AddFragranceFormValues) => {
    localStorage.setItem("latestSelectedDate", values.logDate.toISOString());
    createUserFragranceLog({
      ...values,
      logDate: getDateStringFromDate(values.logDate),
    });
  };

  return { onSubmit, isSubmissionLoading };
};
