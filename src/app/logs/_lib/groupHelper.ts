import { format } from "date-fns";
import type { UserFragranceLog } from "~/types/UserFragranceLog.types";

export const groupLogsByDate = (logs: UserFragranceLog[]) => {
  const result = {} as Record<string, UserFragranceLog[]>;
  logs?.forEach((log) => {
    const date = format(log.logDate, "yyyy-MM-dd");
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(log);
  });
  return result;
};
