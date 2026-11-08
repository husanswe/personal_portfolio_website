import test from "node:test";
import assert from "node:assert/strict";
import { fillYear, fromGraphql, fromOpenApi, getCalendarWeeks, getCurrentYear, getMonthLabels, getToday, getYears, type ContributionDay } from "../src/lib/github-calendar";

const range = (start: string, length: number): ContributionDay[] => Array.from({ length }, (_, index) => ({
  date: new Date(Date.parse(`${start}T00:00:00Z`) + index * 86_400_000).toISOString().slice(0, 10),
  count: index % 3,
  level: index % 3,
}));

test("GraphQL calendar maps quartile levels, keeps GitHub's total, and covers the whole year", () => {
  const result = fromGraphql({ data: { user: { contributionsCollection: { contributionCalendar: {
    totalContributions: 7,
    weeks: [{ contributionDays: [
      { date: "2026-11-02", contributionCount: 0, contributionLevel: "NONE" },
      { date: "2026-11-01", contributionCount: 7, contributionLevel: "FOURTH_QUARTILE" },
    ] }],
  } } } } }, 2026);
  assert.equal(result.total, 7);
  assert.equal(result.days.length, 365);
  assert.deepEqual(result.days.find(day => day.date === "2026-11-01"), { date: "2026-11-01", count: 7, level: 4 });
});

test("GraphQL errors and unknown users fail visibly", () => {
  assert.throws(() => fromGraphql({ errors: [{ message: "Bad credentials" }] }, 2026), /Bad credentials/);
  assert.throws(() => fromGraphql({ data: { user: null } }, 2026), /not found/);
});

test("open API data uses the selected year's total and rejects malformed days", () => {
  assert.equal(fromOpenApi({ total: { 2025: 604 }, contributions: range("2025-01-01", 365) }, 2025).total, 604);
  assert.throws(() => fromOpenApi({ contributions: [] }, 2025));
  assert.throws(() => fromOpenApi({ contributions: [{ date: "2026-01-01", count: 1, level: 9 }] }, 2026));
});

test("a year runs January 1 to December 31, including February 29 in leap years", () => {
  const days = fillYear(range("2023-12-30", 5), 2024);
  assert.equal(days.length, 366);
  assert.equal(days[0].date, "2024-01-01");
  assert.equal(days[59].date, "2024-02-29");
  assert.equal(days.at(-1)?.date, "2024-12-31");
});

test("weeks run Sunday to Saturday and pad the first column", () => {
  const weeks = getCalendarWeeks(fillYear([], 2026)); // January 1, 2026 is a Thursday
  assert.equal(weeks[0][3], null);
  assert.equal(weeks[0][4]?.date, "2026-01-01");
  assert.equal(weeks[0].length, 7);
});

test("a calendar year gets jan through dec as month labels", () => {
  assert.deepEqual(getMonthLabels(getCalendarWeeks(fillYear([], 2026))).filter(Boolean), ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]);
});

test("year options run from 2023 to the current Tashkent year, newest first", () => {
  assert.deepEqual(getYears(2026), [2026, 2025, 2024, 2023]);
  assert.equal(getToday(new Date("2026-12-31T19:30:00Z")), "2027-01-01");
  assert.equal(getCurrentYear(new Date("2026-12-31T19:30:00Z")), 2027);
});
