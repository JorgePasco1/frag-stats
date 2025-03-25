import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FarewellFragranceFormInstance } from "./FarewellForm";
import { Input } from "~/components/ui/input";

type SellPriceInputProps = {
  form: FarewellFragranceFormInstance;
};

export const SellPriceInput = ({ form }: SellPriceInputProps) => {
  return (
    <FormField
      control={form.control}
      name="sellPrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sell Price</FormLabel>
          <FormControl>
            <Input type="number" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
