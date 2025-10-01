import { Form } from "~/components/ui/form";

import { api } from "~/trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Checkbox } from "~/components/ui/checkbox";
import {
  BlotterCheckbox,
  DurationInput,
  EnjoymentRating,
  FragranceSelect,
  IsGoneCheckbox,
  NotesInput,
  SpraysInput,
  UseCaseSelect,
  WeatherSelect,
} from "./inputs";
import { Button } from "~/components/ui/button";

import { useNewLogFormValues } from "./hooks";
import { useNewLogFormSubmission } from "./hooks/useNewLogFormSubmission";
import { LogDatePicker } from "~/app/_components/LogDatePicker";
import { SelectDropdown } from "~/app/_components/SelectDropdown";
import { timeOfDayEnum } from "~/server/db/schema";

type NewLogFormProps = {
  closeModal: () => void;
  latestSelectedDate: Date | null;
  setLatestSelectedDate: (date: Date) => void;
};

export const NewLogForm = ({
  closeModal,
  latestSelectedDate,
  setLatestSelectedDate,
}: NewLogFormProps) => {
  const { form, isDecant, handleOnDecantCheckboxClick, testedInBlotter } =
    useNewLogFormValues(latestSelectedDate);

  const { onSubmit, isSubmissionLoading } = useNewLogFormSubmission(
    closeModal,
    setLatestSelectedDate,
  );

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
            <SelectDropdown
              form={form}
              fieldName="timeOfDay"
              label="Time of Day"
              options={timeOfDayEnum.enumValues}
            />
            <WeatherSelect form={form} />
          </>
        )}
        <FragranceSelect
          form={form}
          userFragrances={userFragrances}
          isDecant={isDecant}
        />
        <LogDatePicker form={form} fieldName="logDate" label="Log Date" />
        <EnjoymentRating form={form} />
        {!testedInBlotter && (
          <>
            <SpraysInput form={form} />
            <DurationInput form={form} />
          </>
        )}
        <NotesInput form={form} />
        <IsGoneCheckbox form={form} />
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
