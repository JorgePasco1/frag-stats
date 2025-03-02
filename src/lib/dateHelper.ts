export const getDateStringFromDate = (date: Date) => {
  return date.toISOString().split("T")[0] ?? '';
};
