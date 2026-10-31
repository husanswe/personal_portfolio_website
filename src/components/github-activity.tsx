"use client";

import { IconArrowUpRight, IconBrandGithub, IconRefresh } from "@tabler/icons-react";
import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";
import { GITHUB_FIRST_YEAR, getCalendarWeeks, getStreaks, type CalendarData, type ContributionDay } from "@/lib/github-calendar";

type Tooltip = { date: string; count: number; x: number; y: number };
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
function getToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function GithubActivity() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [year, setYear] = useState(2026);
  const [today, setToday] = useState("");
  const [data, setData] = useState<CalendarData | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const now = getToday();
    const latest = Math.max(GITHUB_FIRST_YEAR, Number(now.slice(0, 4)));
    setCurrentYear(latest);
    setYear(latest);
    setToday(now);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setData(null);
    setError("");
    async function load() {
      try {
        const response = await fetch(`/api/github?year=${year}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("GitHub activity is temporarily unavailable.");
        const result: CalendarData = await response.json();
        if (active) { setData(result); setError(""); setToday(getToday()); }
      } catch (error) {
        if (active && !controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not load GitHub activity.");
      }
    }
    void load();
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void load(); }, 60_000);
    const refresh = () => { if (document.visibilityState === "visible") void load(); };
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; controller.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, [year, attempt]);

  useEffect(() => {
    const clear = () => setTooltip(null);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    return () => { window.removeEventListener("scroll", clear, true); window.removeEventListener("resize", clear); };
  }, []);

  function showTooltip(event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>, day: ContributionDay) {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({ ...day, x: Math.max(143, Math.min(window.innerWidth - 143, rect.left + rect.width / 2)), y: rect.top - 10 });
  }

  const weeks = data ? getCalendarWeeks(data.days) : [];
  const streaks = data ? getStreaks(data.days, today) : null;
  const monthStarts = new Set<number>();
  const monthLabels = weeks.map(week => {
    const first = week.find(day => day !== null);
    if (!first) return "";
    const month = Number(first.date.slice(5, 7)) - 1;
    if (monthStarts.has(month)) return "";
    monthStarts.add(month);
    return months[month];
  });

  return <div>
    <div className="activity-heading"><a href="https://github.com/husanswe" target="_blank" rel="noopener noreferrer"><IconBrandGithub size={15} />husanswe<IconArrowUpRight size={12} /></a><label className="sr-only" htmlFor="activity-year">Activity year</label><select className="activity-year" id="activity-year" value={year} onChange={event => { setYear(Number(event.target.value)); setTooltip(null); }}>{Array.from({ length: currentYear - GITHUB_FIRST_YEAR + 1 }, (_, index) => currentYear - index).map(value => <option key={value} value={value}>{value}</option>)}</select></div>
    <div className="activity-panel" aria-busy={!data && !error}>
      {!data && !error ? <><div className="activity-skeleton" aria-hidden="true" /><span role="status" className="sr-only">Loading live GitHub activity</span></> : null}
      {error && !data ? <div className="activity-error" role="status"><IconBrandGithub size={24} className="mx-auto text-muted" /><p>{error}<br />You can still view all of my work on GitHub.</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : null}
      {data ? <>
        <div className="calendar-scroll" tabIndex={0} role="region" aria-label={`${year} GitHub contribution calendar. Scroll horizontally on small screens.`} onKeyDown={event => { if (event.key === "Escape") setTooltip(null); }}>
          <div className="calendar-grid"><div className="calendar-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="calendar-weeks">{weeks.map((week, weekIndex) => <div className="calendar-week" key={weekIndex}><span className="calendar-month" aria-hidden="true">{monthLabels[weekIndex]}</span>{week.map((day, dayIndex) => day ? <button key={day.date} type="button" className={`calendar-day ${day.date > today ? "is-future" : ""}`} data-level={day.level} disabled={day.date > today} aria-label={`${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}`} aria-describedby={tooltip?.date === day.date ? "activity-tooltip" : undefined} onMouseEnter={event => showTooltip(event, day)} onMouseLeave={() => setTooltip(null)} onFocus={event => showTooltip(event, day)} onBlur={() => setTooltip(null)} onClick={event => showTooltip(event, day)} /> : <span key={`empty-${dayIndex}`} />)}</div>)}</div></div>
        </div>
        <div className="calendar-footer"><span>{data.total.toLocaleString("en-US")} {data.total === 1 ? "contribution" : "contributions"} in {year}</span><div className="calendar-legend" aria-label="Contribution intensity, less to more"><span>Less</span>{[0,1,2,3,4].map(level => <span className="legend-cell" key={level} data-level={level} />)}<span>More</span></div></div>
        <div className="activity-stats"><div className="activity-stat"><strong>{streaks?.current}<span> {streaks?.current === 1 ? "day" : "days"}</span></strong><span>{year === currentYear ? "Current streak" : "Year-end streak"}</span></div><div className="activity-stat"><strong>{streaks?.longest}<span> {streaks?.longest === 1 ? "day" : "days"}</span></strong><span>Longest streak this year</span></div><div className="activity-stat"><strong>{streaks?.activeDays}</strong><span>Active days</span></div></div>
      </> : null}
    </div>
    <div className="activity-note"><span><IconRefresh size={10} />{error && data ? "Update delayed. Showing last fetched activity." : "Live from GitHub · Refreshes every minute"}</span><span>Commits, pull requests & more</span></div>
    {tooltip ? <div role="tooltip" id="activity-tooltip" className="activity-tooltip" style={{ left: tooltip.x, top: tooltip.y }}><strong>{tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"}</strong><br />{dateFormatter.format(new Date(`${tooltip.date}T00:00:00Z`))}</div> : null}
  </div>;
}
