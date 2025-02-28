import {
  FormControl,
  FormField,
  FormItem,
} from "~/components/ui/form";
import type { NewLogFormInstance } from "../NewLogForm.types";
import { Checkbox } from "~/components/ui/checkbox";

type BlotterCheckboxProps = {
  form: NewLogFormInstance;
};

export const BlotterCheckbox = ({ form }: BlotterCheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name="testedInBlotter"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="testedInBlotter"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="testedInBlotter">Blotter?</label>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
