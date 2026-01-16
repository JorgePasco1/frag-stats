export function parseDayHeader(line: string): Date | null {
  // Regex: Spanish day name + optional number
  const regex =
    /^(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\s*(\d{1,2})?$/i;
  const match = regex.exec(line);

  if (!match) return null;

  const dayNumber = match[2] ? parseInt(match[2], 10) : null;
  return inferDateFromDayNumber(dayNumber);
}

export function inferDateFromDayNumber(dayNumber: number | null): Date {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (dayNumber === null) {
    return today;
  }

  // If day number > current day, assume previous month
  if (dayNumber > currentDay) {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const year = currentMonth === 0 ? currentYear - 1 : currentYear;
    return new Date(year, prevMonth, dayNumber);
  }

  return new Date(currentYear, currentMonth, dayNumber);
}
