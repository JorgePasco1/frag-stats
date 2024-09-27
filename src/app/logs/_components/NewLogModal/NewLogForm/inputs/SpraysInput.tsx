import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { NewLogFormInstance } from "../NewLogForm.types";

type SpraysInputProps = {
  form: NewLogFormInstance;
};

export const SpraysInput = ({ form }: SpraysInputProps) => {
  return (
    <FormField
      control={form.control}
      name="sprays"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sprays</FormLabel>
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
