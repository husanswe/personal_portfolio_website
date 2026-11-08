"use client";

import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";
import { GITHUB_USERNAME, getCalendarWeeks, getMonthLabels, type CalendarData, type ContributionDay } from "@/lib/github-calendar";

type Tooltip = { date: string; count: number; x: number; y: number };
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
const contributions = (count: number) => `${count === 0 ? "No" : count.toLocaleString("en-US")} ${count === 1 ? "contribution" : "contributions"}`;

export function GithubActivity() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [failed, setFailed] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/github", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error();
        setData(await response.json());
        setFailed(false);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    void load();
    const refresh = () => { if (document.visibilityState === "visible") void load(); };
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  useEffect(() => {
    const clear = () => setTooltip(null);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    return () => { window.removeEventListener("scroll", clear, true); window.removeEventListener("resize", clear); };
  }, []);

  function showTooltip(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>, day: ContributionDay) {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({ ...day, x: Math.max(120, Math.min(window.innerWidth - 120, rect.left + rect.width / 2)), y: rect.top - 8 });
  }

  const weeks = data ? getCalendarWeeks(data.days) : [];
  const monthLabels = getMonthLabels(weeks);

  return <div className="github-graph">
    <a className="github-graph-title" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" aria-label={`${GITHUB_USERNAME} on GitHub (opens in a new tab)`}>github</a>
    {!data && !failed ? <div className="github-graph-skeleton" aria-busy="true"><span className="sr-only" role="status">Loading GitHub contributions</span></div> : null}
    {!data && failed ? <p className="github-graph-total">GitHub activity is temporarily unavailable. <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">View my profile</a></p> : null}
    {data ? <>
      <div className="github-graph-scroll" tabIndex={0} role="region" aria-label="GitHub contributions in the last year" onKeyDown={event => { if (event.key === "Escape") setTooltip(null); }}>
        <div className="github-graph-weeks">
          {weeks.map((week, weekIndex) => <div className="github-graph-week" key={weekIndex}>
            <span className="github-graph-month" aria-hidden="true">{monthLabels[weekIndex]}</span>
            {week.map((day, dayIndex) => day
              ? <span key={day.date} className="github-graph-day" data-level={day.level} tabIndex={-1} role="img" aria-label={`${contributions(day.count)} on ${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}`} onMouseEnter={event => showTooltip(event, day)} onMouseLeave={() => setTooltip(null)} onClick={event => showTooltip(event, day)} onFocus={event => showTooltip(event, day)} onBlur={() => setTooltip(null)} />
              : <span key={`empty-${dayIndex}`} className="github-graph-empty" />)}
          </div>)}
        </div>
      </div>
      <p className="github-graph-total">{data.total.toLocaleString("en-US")} {data.total === 1 ? "contribution" : "contributions"} in the last year</p>
    </> : null}
    {tooltip ? <div role="tooltip" className="activity-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{contributions(tooltip.count)} on {dateFormatter.format(new Date(`${tooltip.date}T00:00:00Z`))}.</div> : null}
  </div>;
}
