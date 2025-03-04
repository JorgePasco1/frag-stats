import { Form } from "~/components/ui/form";

import { api } from "~/trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Checkbox } from "~/components/ui/checkbox";
import { FragranceSelect, LogDatePicker } from "./inputs";
import { EnjoymentRating } from "./inputs/EnjoymentRating";
import { SpraysInput } from "./inputs/SpraysInput";
import { NotesInput } from "./inputs/NotesInput";
import { Button } from "~/components/ui/button";

import { DurationInput } from "./inputs/DurationInput";
import { BlotterCheckbox } from "./inputs/BlotterCheckbox";

import { UseCaseSelect } from "./inputs/UseCaseSelect";
import { TimeOfDaySelect } from "./inputs/TimeOfDaySelect";
import { WeatherSelect } from "./inputs/WeatherSelect";

import { useNewLogFormValues } from "./hooks";
import { useNewLogFormSubmission } from "./hooks/useNewLogFormSubmission";

type NewLogFormProps = {
  closeModal: () => void;
};

export const NewLogForm = ({ closeModal }: NewLogFormProps) => {
  const { form, isDecant, handleOnDecantCheckboxClick, testedInBlotter } =
    useNewLogFormValues();

  const { onSubmit, isSubmissionLoading } = useNewLogFormSubmission(closeModal);

  const { data: userFragrances, isLoading } =
    api.userFragrances.getLogOptions.useQuery();

  if (isLoading) {
    return <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }
  return (
    <Form {...form}>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={isDecant}
          id="isDecant"
          onCheckedChange={handleOnDecantCheckboxClick}
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="isDecant">Is Decant?</label>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <BlotterCheckbox form={form} />
        <UseCaseSelect
          form={form}
          isTestingOnBlotter={testedInBlotter ?? false}
        />
        {!testedInBlotter && (
          <>
            <TimeOfDaySelect form={form} />
            <WeatherSelect form={form} />
          </>
        )}
        <FragranceSelect
          form={form}
          userFragrances={userFragrances}
          isDecant={isDecant}
        />
        <LogDatePicker form={form} />
        <EnjoymentRating form={form} />
        {!testedInBlotter && (
          <>
            <SpraysInput form={form} />
            <DurationInput form={form} />
          </>
        )}
        <NotesInput form={form} />
        <Button type="submit">
          {isSubmissionLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
};
