export function formatDate(
  date: string,
  { fullMonth = false, includeDay = true, includeYear = true } = {},
): string {
  return new Intl.DateTimeFormat("en-US", {
    day: includeDay ? "numeric" : undefined,
    month: fullMonth ? "long" : "short",
    year: includeYear ? "numeric" : undefined,
  }).format(new Date(date))
}

/**
 * Format date dynamically, only show year if it's not the current year.
 */
export function formatDateDynamic(date: string): string {
  const currYear = new Date().getFullYear()
  const year = new Date(date).getFullYear()
  const isFullDate = year < currYear || year > currYear

  return formatDate(date, { includeYear: isFullDate })
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w/-]+/g, "")
    .toLowerCase()
}
