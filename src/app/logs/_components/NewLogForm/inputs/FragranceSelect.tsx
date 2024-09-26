"use client";

import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { AddFragranceFormValues } from "../NewLogForm";
import type { UserFragrance } from "~/types/UserFragrance.types";

type FragranceSelectorProps = {
  form: UseFormReturn<AddFragranceFormValues>;
  userFragrances: UserFragrance[] | undefined;
  isDecant: boolean;
};

export const FragranceSelect = ({
  form,
  userFragrances,
  isDecant,
}: FragranceSelectorProps) => {
  const fragranceOptions = useMemo(() => {
    if (!userFragrances) return [];
    if (isDecant) {
      return userFragrances.filter((frag) => frag.isDecant);
    }
    return userFragrances.filter((frag) => !frag.isDecant);
  }, [userFragrances, isDecant]);

  return (
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
  );
};
