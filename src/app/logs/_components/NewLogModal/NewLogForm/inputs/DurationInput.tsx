import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { NewLogFormInstance } from "../NewLogForm.types";

type DurationInputProps = {
  form: NewLogFormInstance;
};

export const DurationInput = ({ form }: DurationInputProps) => {
  return (
    <FormField
      control={form.control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Duration</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              className="w-[240px]"
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
