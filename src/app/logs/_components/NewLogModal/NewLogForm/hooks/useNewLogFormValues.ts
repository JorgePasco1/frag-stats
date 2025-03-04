import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { timeOfDayEnum, useCaseEnum, weatherEnum } from "~/server/db/schema";

export const useNewLogFormValues = () => {
  const [isDecant, setIsDecant] = useState(false);
  const handleOnDecantCheckboxClick = (checked: boolean) => {
    return setIsDecant(checked);
  };
  const latestSelectedDate = localStorage.getItem("latestSelectedDate");

  const form = useForm<AddFragranceLogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logDate: latestSelectedDate ? new Date(latestSelectedDate) : new Date(),
    },
  });
  const testedInBlotter = form.watch("testedInBlotter");
  useEffect(() => {
    if (testedInBlotter) {
      form.setValue("useCase", "testing");
      return;
    }
    if (testedInBlotter === false) {
      form.setValue("useCase", undefined);
    }
  }, [testedInBlotter, form]);

  return {
    form,
    isDecant,
    handleOnDecantCheckboxClick,
    testedInBlotter
  }
};

const formSchema = z.object({
  fragranceId: z.number(),
  logDate: z.date(),
  enjoyment: z.number().int().min(1).max(10).optional(),
  sprays: z.number().int().min(1).optional(),
  notes: z.string().optional(),
  duration: z.number().int().optional(),
  testedInBlotter: z.boolean().optional(),
  timeOfDay: z.enum(timeOfDayEnum.enumValues).optional(),
  weather: z.enum(weatherEnum.enumValues).optional(),
  useCase: z.enum(useCaseEnum.enumValues).optional(),
});

export type AddFragranceLogFormValues = z.infer<typeof formSchema>;
