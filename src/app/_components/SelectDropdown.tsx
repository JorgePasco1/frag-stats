"use client";

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
import { capitalize } from "~/lib/stringHelper";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type SelectDropdownProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  label: string;
  options: string[];
};

export const SelectDropdown = <S extends FieldValues>({
  form,
  fieldName,
  label,
  options,
}: SelectDropdownProps<S>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((item) => {
                return (
                  <SelectItem
                    key={`select-dropdown-item-${fieldName}-${item}`}
                    value={item}
                  >
                    {capitalize(item)}
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
