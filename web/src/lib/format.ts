const monthYearFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const monthYear = (date: string) =>
  monthYearFormat.format(new Date(date));

export const serial = (index: number) => String(index + 1).padStart(2, "0");
