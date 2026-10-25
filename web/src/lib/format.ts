// Sanity dates are calendar dates (YYYY-MM-DD); formatting in UTC stops them shifting with the server's zone.
const monthYearFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-03-14" → "Mar 2026" */
export const monthYear = (date: string) =>
  monthYearFormat.format(new Date(date));

/** 0 → "01": the numbering on work cards and product features. */
export const serial = (index: number) => String(index + 1).padStart(2, "0");
