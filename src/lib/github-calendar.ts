export const GITHUB_USERNAME = "husanswe";

export type ContributionDay = { date: string; count: number; level: number };
export type CalendarData = {
  username: string;
  total: number;
  days: ContributionDay[];
  source: "github-graphql" | "github-contributions-api";
  fetchedAt: string;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function validDay(day: ContributionDay) {
  return DATE.test(day.date) && Number.isInteger(day.count) && day.count >= 0 && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4;
}

function finish(days: ContributionDay[]): ContributionDay[] {
  if (!days.length || !days.every(validDay)) throw new Error("Unrecognized GitHub contribution data");
  return [...days].sort((a, b) => a.date.localeCompare(b.date));
}

const GRAPHQL_LEVELS: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

export const CONTRIBUTIONS_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

type GraphqlResponse = {
  data?: { user?: { contributionsCollection?: { contributionCalendar?: {
    totalContributions: number;
    weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
  } } } | null };
  errors?: { message: string }[];
};

/** Official GitHub GraphQL API: the same calendar github.com shows on the profile (last 12 months). */
export function fromGraphql(json: GraphqlResponse): { total: number; days: ContributionDay[] } {
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("GitHub user not found");
  const days = finish(calendar.weeks.flatMap(week => week.contributionDays).map(day => ({
    date: day.date,
    count: day.contributionCount,
    level: GRAPHQL_LEVELS[day.contributionLevel] ?? -1,
  })));
  return { total: calendar.totalContributions, days };
}

type OpenApiResponse = { total?: Record<string, number>; contributions?: ContributionDay[] };

/** Open GitHub contributions API (github.com/grubersjoe/github-contributions-api), no token required. */
export function fromOpenApi(json: OpenApiResponse): { total: number; days: ContributionDay[] } {
  const days = finish(json.contributions ?? []);
  const total = json.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0);
  return { total, days };
}

/** Columns of 7 days (Sunday → Saturday), exactly like the GitHub profile graph. */
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

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** One label per month at the week where it starts; a label with no room before the next is dropped (as GitHub does). */
export function getMonthLabels(weeks: (ContributionDay | null)[][]): string[] {
  const labels = weeks.map(() => "");
  const starts: { index: number; month: number }[] = [];
  weeks.forEach((week, index) => {
    const first = week.find(day => day !== null);
    if (!first) return;
    const month = Number(first.date.slice(5, 7)) - 1;
    if (starts.at(-1)?.month !== month) starts.push({ index, month });
  });
  starts.forEach((start, position) => {
    const next = starts[position + 1];
    if (next && next.index - start.index < 3) return;
    labels[start.index] = MONTHS[start.month];
  });
  return labels;
}
