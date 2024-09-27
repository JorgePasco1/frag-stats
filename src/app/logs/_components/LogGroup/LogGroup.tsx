import type { UserFragranceLog } from "~/types/UserFragranceLog.types";

type LogGroupProps = {
  date: string;
  logs: UserFragranceLog[];
};

export const LogGroup = ({ date, logs }: LogGroupProps) => {
  console.log({ date, logs });
  return <div>Test</div>
};
