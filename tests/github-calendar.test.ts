import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseCalendar, getStreaks, getCalendarWeeks, type ContributionDay } from "../src/lib/github-calendar";

const day = (date: string, count: number): ContributionDay => ({ date, count, level: count ? 1 : 0 });

test("an empty today preserves yesterday's current streak", () => {
  assert.deepEqual(getStreaks([day("2026-01-01", 2), day("2026-01-02", 1), day("2026-01-03", 0), day("2026-01-04", 3)], "2026-01-03"), { current: 2, longest: 2, activeDays: 2 });
});

test("a completed inactive day ends the streak and future data is excluded", () => {
  assert.deepEqual(getStreaks([day("2026-01-01", 2), day("2026-01-02", 0), day("2026-01-03", 0), day("2026-01-04", 8)], "2026-01-03"), { current: 0, longest: 1, activeDays: 1 });
});

test("the calendar aligns January 1, 2026 to Thursday and preserves every date", () => {
  const weeks = getCalendarWeeks([day("2026-01-01", 1), day("2026-01-02", 3)]);
  assert.equal(weeks[0][0], null);
  assert.equal(weeks[0][4]?.date, "2026-01-01");
  assert.equal(weeks[0][5]?.count, 3);
  assert.equal(weeks[0].length, 7);
});

test("an upstream format change fails visibly instead of inventing zero counts", () => {
  assert.throws(() => parseCalendar('<td data-date="2026-01-01" data-level="2" id="day-1"></td>', 2026));
  assert.throws(() => parseCalendar("<html>Rate limited</html>", 2026));
});

test("daily tooltips preserve zero, singular, and comma-separated GitHub counts", () => {
  let html = "";
  for (let index = 0; index < 365; index++) {
    const date = new Date(Date.UTC(2026, 0, index + 1)).toISOString().slice(0, 10);
    const label = index === 0 ? "No contributions" : index === 1 ? "1 contribution" : index === 2 ? "1,234 contributions" : "No contributions";
    html += `<td data-date="${date}" id="day-${index}" data-level="${index === 2 ? 4 : index === 1 ? 1 : 0}"></td><tool-tip for="day-${index}">${label} on a date.</tool-tip>`;
  }
  const days = parseCalendar(html, 2026);
  assert.equal(days[0].count, 0);
  assert.equal(days[1].count, 1);
  assert.equal(days[2].count, 1234);
  assert.equal(days.reduce((total, value) => total + value.count, 0), 1235);
});

test("a historical leap year with no contributions still includes February 29", () => {
  const html = Array.from({ length: 366 }, (_, index) => {
    const date = new Date(Date.UTC(2024, 0, index + 1)).toISOString().slice(0, 10);
    return `<td data-date="${date}" data-count="0" data-level="0"></td>`;
  }).join("");
  const days = parseCalendar(html, 2024);
  assert.equal(days.length, 366);
  assert.equal(days[59].date, "2024-02-29");
  assert.equal(days.at(-1)?.date, "2024-12-31");
  assert.deepEqual(getStreaks(days, "2026-10-31"), { current: 0, longest: 0, activeDays: 0 });
});

test("public calendar fixture parses GitHub's real daily counts", { skip: !existsSync(".tools/github-calendar.html") }, () => {
  const days = parseCalendar(readFileSync(".tools/github-calendar.html", "utf8"), 2026);
  assert.equal(days.length, 365);
  assert.equal(days[0].date, "2026-01-01");
  assert.equal(days.at(-1)?.date, "2026-12-31");
  assert.ok(days.reduce((sum, value) => sum + value.count, 0) > 0);
});
