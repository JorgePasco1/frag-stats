"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "~/components/ui/form";

import { api } from "~/trpc/react";
import {} from "~/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { FragranceSelect, LogDatePicker } from "./inputs";
import { EnjoymentRating } from "./inputs/EnjoymentRating";
import { SpraysInput } from "./inputs/SpraysInput";
import { NotesInput } from "./inputs/NotesInput";
import { Button } from "~/components/ui/button";

export const NewLogForm = () => {
  const [isDecant, setIsDecant] = useState(false);

  const form = useForm<AddFragranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fragranceId: undefined,
      enjoyment: undefined,
      sprays: undefined,
      notes: undefined,
      logDate: new Date(),
    },
  });
  console.log({errors: form.formState.errors})

  const onSubmit = (values: AddFragranceFormValues) => {
    console.log({ values });
  };

  const { data: userFragrances, isLoading } =
    api.userFragrances.getAll.useQuery();

  if (isLoading) {
    return <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }
  return (
    <Form {...form}>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={isDecant}
          id="isDecant"
          onCheckedChange={(checked) => {
            setIsDecant(Boolean(checked));
          }}
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="isDecant">Is Decant?</label>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FragranceSelect
          form={form}
          userFragrances={userFragrances}
          isDecant={isDecant}
        />
        <LogDatePicker form={form} />
        <EnjoymentRating form={form} />
        <SpraysInput form={form}/>
        <NotesInput form={form}/>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  fragranceId: z.string(),
  logDate: z.date(),
  enjoyment: z.number().int().min(1).max(10).optional(),
  sprays: z.number().int().min(1).optional(),
  notes: z.string().optional(),
});

export type AddFragranceFormValues = z.infer<typeof formSchema>;
