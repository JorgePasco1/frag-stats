"use client";

import { useMemo } from "react";
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
import { useCaseEnum } from "~/server/db/schema";

type UseCaseSelectProps = {
  form: NewLogFormInstance;
  isTestingOnBlotter: boolean;
};

export const UseCaseSelect = ({
  form,
  isTestingOnBlotter,
}: UseCaseSelectProps) => {
  const options: UseCase[] = useMemo(() => {
    if (isTestingOnBlotter) return ["testing", "guess_game"];
    return useCaseEnum.enumValues;
  }, [isTestingOnBlotter]);

  const selectedUseCase = form.watch("useCase");
  return (
    <FormField
      control={form.control}
      name="useCase"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Use Case</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue={field.value}
            value={selectedUseCase}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((useCase) => {
                return (
                  <SelectItem key={`use-case-${useCase}`} value={useCase}>
                    {useCaseLabelMap[useCase]}
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
type UseCase = (typeof useCaseEnum.enumValues)[number];

const useCaseLabelMap: { [key in UseCase]: string } = {
  casual: "Casual",
  testing: "Testing",
  formal: "Formal",
  date: "Date",
  clubbing: "Clubbing",
  sport: "Sports",
  hangout: "Hangout",
  personal: "Personal",
  guess_game: "Guessing Game",
};
