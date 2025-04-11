import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

type TextInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  label: string;
  placeholder?: string;
};

export const TextInput = <S extends FieldValues>({
  form,
  fieldName,
  label,
  placeholder = "Enter name",
}: TextInputProps<S>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder}/>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
