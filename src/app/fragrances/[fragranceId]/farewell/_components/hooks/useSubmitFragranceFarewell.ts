import { api } from "~/trpc/react";
import type { FarewellFragranceFormValues } from "../FarewellForm";
import { getDateStringFromDate } from "~/lib/dateHelper";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSubmitFragranceFarewell = (userFragranceId: number) => {
  const router = useRouter();
  const { mutate: registerGone, isPending: isSubmissionLoading } =
    api.userFragrances.registerGone.useMutation({
      onSuccess: () => {
        toast.success("Fragrance marked as gone");
        router.push("/fragrances/collection");
      },
      onError: (error) => {
        toast.error("Failed to update fragrance", {
          description: error.message || "Please try again.",
        });
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
