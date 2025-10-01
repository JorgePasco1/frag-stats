"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import type { NewLogFormInstance } from "../NewLogForm.types";

type IsGoneCheckboxProps = {
  form: NewLogFormInstance;
};

export const IsGoneCheckbox = ({ form }: IsGoneCheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name="isGone"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>It&apos;s gone</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
