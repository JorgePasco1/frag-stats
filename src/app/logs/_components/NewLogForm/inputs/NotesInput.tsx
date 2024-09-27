import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { NewLogFormInstance } from "../NewLogForm.types";
import { Textarea } from "~/components/ui/textarea";

type NotesInputProps = {
  form: NewLogFormInstance;
};

export const NotesInput = ({ form }: NotesInputProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
