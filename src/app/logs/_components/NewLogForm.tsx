"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";

export const NewLogForm = () => {
  const [isDecant, setIsDecant] = useState(false);

  const form = useForm<AddFragranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fragranceId: undefined,
      enjoyment: undefined,
      sprays: undefined,
      notes: undefined,
    },
  });

  const onSubmit = (values: AddFragranceFormValues) => {
    console.log({ values });
  };

  const { data: userFragrances, isLoading } =
    api.userFragrances.getAll.useQuery();
  const fragranceOptions = useMemo(() => {
    if (!userFragrances) return [];
    if (isDecant) {
      return userFragrances.filter((frag) => frag.isDecant);
    }
    return userFragrances.filter((frag) => !frag.isDecant);
  }, [userFragrances, isDecant]);

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

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fragranceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fragrance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fragranceOptions?.map((frag) => {
                    return (
                      <SelectItem
                        key={frag.fragranceId}
                        value={String(frag.fragranceId)}
                      >
                        {frag.house} {frag.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const formSchema = z.object({
  fragranceId: z.string(),
  enjoyment: z.number().int().min(1).max(10).optional(),
  sprays: z.number().int().min(1).optional(),
  notes: z.string(),
});

type AddFragranceFormValues = z.infer<typeof formSchema>;
