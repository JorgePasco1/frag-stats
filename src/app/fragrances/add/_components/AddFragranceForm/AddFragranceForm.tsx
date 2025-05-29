"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Checkbox } from "~/components/ui/checkbox";
import { acquiredDetailsEnum } from "~/server/db/schema";
import { getDateStringFromDate } from "~/lib/dateHelper";
import { LogDatePicker } from "~/app/_components/LogDatePicker";
import { SelectDropdown } from "~/app/_components/SelectDropdown";
import { TextInput } from "~/app/_components/TextInput";
import { NumericInput } from "~/app/_components/NumericInput";

export const AddFragranceForm = () => {
  const form = useForm<AddFragranceFormValues>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { mutate: submitForm, isPending } =
    api.userFragrances.create.useMutation({
      onSuccess: () => {
        router.push("/fragrances/collection");
      },
    });
  const onSubmit = (values: AddFragranceFormValues) => {
    submitForm({
      ...values,
      acquiredDate: getDateStringFromDate(values.acquiredDate),
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-96 flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="isDecant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Decant</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <TextInput
          form={form}
          fieldName="house"
          label="House"
          placeholder="Chanel"
        />
        <TextInput
          form={form}
          fieldName="name"
          label="Name"
          placeholder="Bleu de Chanel"
        />
        <TextInput
          form={form}
          fieldName="imageUrl"
          label="Image URL"
          placeholder="https://example.com/image.jpg"
        />
        <LogDatePicker
          form={form}
          fieldName="acquiredDate"
          label="Acquired Date"
        />
        <SelectDropdown
          form={form}
          fieldName="acquiredDetails"
          label="How was it acquired?"
          options={acquiredDetailsEnum.enumValues}
        />
        <TextInput form={form} fieldName="acquiredFrom" label="Acquired From" />
        <NumericInput
          form={form}
          fieldName="price"
          label="Price"
          numericType="float"
        />
        <NumericInput
          form={form}
          fieldName="sizeInMl"
          label="Size in ml"
          numericType="float"
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  name: z.string(),
  house: z.string(),
  imageUrl: z.string(),
  isDecant: z.boolean().optional(),
  acquiredDate: z.date(),
  acquiredDetails: z.enum(acquiredDetailsEnum.enumValues),
  acquiredFrom: z.string(),
  price: z.number(),
  sizeInMl: z.number(),
});

type AddFragranceFormValues = z.infer<typeof formSchema>;
export type AddFragranceFormInstance = UseFormReturn<AddFragranceFormValues>;
