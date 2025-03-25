import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FarewellFragranceFormInstance } from "./FarewellForm";
import { Input } from "~/components/ui/input";

type WentToInputProps = {
  form: FarewellFragranceFormInstance;
};

export const WentToInput = ({ form }: WentToInputProps) => {
  return (
    <FormField
      control={form.control}
      name="wentTo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Went To</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
