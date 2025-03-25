"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { hadDetailsEnum } from "~/server/db/schema";

import { Form } from "~/components/ui/form";
import { LogDatePicker } from "~/app/_components/LogDatePicker";
import { SelectDropdown } from "~/app/_components/SelectDropdown";

export const FarewellForm = () => {
  const form = useForm<FarewellFragranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goneDate: new Date(),
      hadDetails: "emptied",
    },
  });
  return (
    <Form {...form}>
      <div className="flex flex-col gap-2">
        <LogDatePicker form={form} fieldName="goneDate" label="Gone Date" />
        <SelectDropdown
          form={form}
          fieldName="hadDetails"
          label="Had Details"
          options={hadDetailsEnum.enumValues}
        />
      </div>
    </Form>
  );
};

const formSchema = z.object({
  goneDate: z.date(),
  hadDetails: z.enum(hadDetailsEnum.enumValues),
});

type FarewellFragranceFormValues = z.infer<typeof formSchema>;
export type FarewellFragranceFormInstance =
  UseFormReturn<FarewellFragranceFormValues>;
