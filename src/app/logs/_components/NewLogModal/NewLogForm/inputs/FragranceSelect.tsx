"use client";

import { useMemo } from "react";
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
import type { UserFragrance } from "~/types/UserFragrance.types";
import type { NewLogFormInstance } from "../NewLogForm.types";

type FragranceSelectorProps = {
  form: NewLogFormInstance;
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
    const sortedFragrances = userFragrances.sort((a, b) => {
      return a.house.localeCompare(b.house);
    }
    );
    if (isDecant) {
      return sortedFragrances.filter((frag) => frag.isDecant);
    }
    return sortedFragrances.filter((frag) => !frag.isDecant);
  }, [userFragrances, isDecant]);

  return (
    <FormField
      control={form.control}
      name="fragranceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fragrance</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(+value);
            }}
            defaultValue={String(field.value)}
          >
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
