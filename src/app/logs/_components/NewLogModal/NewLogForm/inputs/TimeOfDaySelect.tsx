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
import type { NewLogFormInstance } from "../NewLogForm.types";
import { timeOfDayEnum } from "~/server/db/schema";
import { capitalize } from "~/lib/stringHelper";

type TimeOfDaySelectProps = {
  form: NewLogFormInstance;
};

export const TimeOfDaySelect = ({ form }: TimeOfDaySelectProps) => {
  return (
    <FormField
      control={form.control}
      name="timeOfDay"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time of Day</FormLabel>
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
              {timeOfDayEnum.enumValues?.map((timeOfDay) => {
                return (
                  <SelectItem key={`time-of-day-${timeOfDay}`} value={timeOfDay}>
                    {capitalize(timeOfDay)}
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
