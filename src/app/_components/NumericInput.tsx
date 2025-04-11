import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";

type NumericInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  label: string;
  numericType?: "float" | "integer";
};

export const NumericInput = <S extends FieldValues>({
  form,
  fieldName,
  label,
  numericType = "integer",
}: NumericInputProps<S>) => {
  const parsingFn = numericType === "integer" ? parseInt : parseFloat;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              className="w-[240px]"
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parsingFn(e.target.value) : undefined,
                )
              }
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
