
import { api } from "~/trpc/react";
import type { FarewellFragranceFormValues } from "../FarewellForm";
import { getDateStringFromDate } from "~/lib/dateHelper";
import { useRouter } from "next/navigation";

export const useSubmitFragranceFarewell = (userFragranceId: number) => {
  const router = useRouter();
  const { mutate: registerGone, isPending: isSubmissionLoading } =
    api.userFragrances.registerGone.useMutation({
      onSuccess: () => {
        router.push("/fragrances/collection");
      },
    });
  const onSubmit = (values: FarewellFragranceFormValues) => {
    registerGone({
      ...values,
      userFragranceId,
      goneDate: getDateStringFromDate(values.goneDate),
    });
  };
  return { onSubmit, isSubmissionLoading };
};
