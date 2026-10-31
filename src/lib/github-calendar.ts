// Husan's GitHub account was opened in February 2023.
export const GITHUB_FIRST_YEAR = 2023;

export type ContributionDay = { date: string; count: number; level: number };
export type CalendarData = {
  username: string;
  year: number;
  total: number;
  days: ContributionDay[];
  fetchedAt: string;
};

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(match => [match[1], match[2]]));
}

/** Read the public calendar and its exact tooltip counts; never invent missing data. */
export function parseCalendar(html: string, year: number): ContributionDay[] {
  const tooltips = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attributes(match[1]).for;
    const text = match[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    const count = text.match(/^(No|[\d,]+)\s+contributions?\b/i)?.[1];
    if (id && count) tooltips.set(id, /^no$/i.test(count) ? 0 : Number(count.replaceAll(",", "")));
  }
  const byDate = new Map<string, ContributionDay>();
  for (const match of html.matchAll(/<(?:td|rect)\b[^>]*\bdata-date=["'][^"']+["'][^>]*>/g)) {
    const attr = attributes(match[0]);
    const date = attr["data-date"];
    if (!date?.startsWith(`${year}-`)) continue;
    const count = attr["data-count"] !== undefined ? Number(attr["data-count"]) : tooltips.get(attr.id);
    const level = Number(attr["data-level"]);
    if (!Number.isInteger(count) || count! < 0 || !Number.isInteger(level) || level < 0 || level > 4) throw new Error("Unrecognized GitHub calendar format");
    byDate.set(date, { date, count: count!, level });
  }
  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  const expected = new Date(Date.UTC(year + 1, 0, 1)).getTime() - new Date(Date.UTC(year, 0, 1)).getTime();
  if (days.length !== expected / 86_400_000) throw new Error("GitHub returned an incomplete calendar");
  return days;
}

export function getCalendarWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (!days.length) return [];
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: (ContributionDay | null)[] = [...Array(offset).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let index = 0; index < padded.length; index += 7) {
    const week = padded.slice(index, index + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function getStreaks(days: ContributionDay[], today: string) {
  const elapsed = days.filter(day => day.date <= today);
  let longest = 0;
  let running = 0;
  for (const day of elapsed) {
    running = day.count > 0 ? running + 1 : 0;
    longest = Math.max(longest, running);
  }
  // An empty today does not end yesterday's ongoing streak.
  let end = elapsed.length - 1;
  if (elapsed[end]?.date === today && elapsed[end].count === 0) end--;
  let current = 0;
  for (let index = end; index >= 0 && elapsed[index].count > 0; index--) current++;
  return { current, longest, activeDays: elapsed.filter(day => day.count > 0).length };
}
