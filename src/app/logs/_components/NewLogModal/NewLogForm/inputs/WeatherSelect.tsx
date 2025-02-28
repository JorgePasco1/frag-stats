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
import { weatherEnum } from "~/server/db/schema";
import { capitalize } from "~/lib/stringHelper";

type WeatherSelectProps = {
  form: NewLogFormInstance;
};

export const WeatherSelect = ({ form }: WeatherSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="weather"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Weather</FormLabel>
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
              {weatherEnum.enumValues?.map((weather) => {
                return (
                  <SelectItem key={`weather-${weather}`} value={weather}>
                    {capitalize(weather)}
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
