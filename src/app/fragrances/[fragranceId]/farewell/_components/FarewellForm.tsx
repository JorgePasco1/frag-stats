"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { hadDetailsEnum } from "~/server/db/schema";

import { Form } from "~/components/ui/form";
import { LogDatePicker } from "~/app/_components/LogDatePicker";
import { SelectDropdown } from "~/app/_components/SelectDropdown";
import { WentToInput } from "./WentToInput";
import { SellPriceInput } from "./SellPriceInput";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSubmitFragranceFarewell } from "./hooks";

type FarewellFormProps = {
  userFragranceId: number;
};

export const FarewellForm = ({ userFragranceId }: FarewellFormProps) => {
  const form = useForm<FarewellFragranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goneDate: new Date(),
      hadDetails: "emptied",
    },
  });
  console.log({error: form.formState.errors});
  const hadDetails = form.watch("hadDetails");
  const wentToSomeone =
    hadDetails === "sold" ||
    hadDetails === "gifted" ||
    hadDetails === "exchanged";

  const { onSubmit, isSubmissionLoading } =
    useSubmitFragranceFarewell(userFragranceId);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <LogDatePicker form={form} fieldName="goneDate" label="Gone Date" />
        <SelectDropdown
          form={form}
          fieldName="hadDetails"
          label="Had Details"
          options={hadDetailsEnum.enumValues}
        />
        {wentToSomeone && <WentToInput form={form} />}
        {hadDetails === "sold" && <SellPriceInput form={form} />}
        <Button type="submit">
          {isSubmissionLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  goneDate: z.date(),
  hadDetails: z.enum(hadDetailsEnum.enumValues),
  wentTo: z.string().optional(),
  sellPrice: z.coerce.number().optional(),
});

export type FarewellFragranceFormValues = z.infer<typeof formSchema>;
export type FarewellFragranceFormInstance =
  UseFormReturn<FarewellFragranceFormValues>;
