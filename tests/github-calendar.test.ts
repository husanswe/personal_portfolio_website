import test from "node:test";
import assert from "node:assert/strict";
import { fromGraphql, fromOpenApi, getCalendarWeeks, getMonthLabels, type ContributionDay } from "../src/lib/github-calendar";

const range = (start: string, length: number): ContributionDay[] => Array.from({ length }, (_, index) => ({
  date: new Date(Date.parse(`${start}T00:00:00Z`) + index * 86_400_000).toISOString().slice(0, 10),
  count: index % 3,
  level: index % 3,
}));

test("GraphQL calendar maps quartile levels and keeps GitHub's total", () => {
  const result = fromGraphql({ data: { user: { contributionsCollection: { contributionCalendar: {
    totalContributions: 7,
    weeks: [{ contributionDays: [
      { date: "2026-11-02", contributionCount: 0, contributionLevel: "NONE" },
      { date: "2026-11-01", contributionCount: 7, contributionLevel: "FOURTH_QUARTILE" },
    ] }],
  } } } } });
  assert.equal(result.total, 7);
  assert.deepEqual(result.days.map(day => [day.date, day.level]), [["2026-11-01", 4], ["2026-11-02", 0]]);
});

test("GraphQL errors and unknown users fail visibly", () => {
  assert.throws(() => fromGraphql({ errors: [{ message: "Bad credentials" }] }), /Bad credentials/);
  assert.throws(() => fromGraphql({ data: { user: null } }), /not found/);
});

test("open API data uses the last-year total and rejects malformed days", () => {
  assert.equal(fromOpenApi({ total: { lastYear: 859 }, contributions: range("2025-11-09", 3) }).total, 859);
  assert.throws(() => fromOpenApi({ contributions: [] }));
  assert.throws(() => fromOpenApi({ contributions: [{ date: "2026-01-01", count: 1, level: 9 }] }));
});

test("weeks run Sunday to Saturday and pad the first column", () => {
  const weeks = getCalendarWeeks(range("2026-01-01", 3)); // Thursday
  assert.equal(weeks[0][0], null);
  assert.equal(weeks[0][4]?.date, "2026-01-01");
  assert.equal(weeks[0].length, 7);
});

test("a rolling year gets one lowercase label per month and drops a cramped first label", () => {
  const labels = getMonthLabels(getCalendarWeeks(range("2025-11-23", 351))).filter(Boolean);
  assert.deepEqual(labels, ["dec", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov"]);
});
