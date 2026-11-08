"use client";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
import { GITHUB_USERNAME, getCalendarWeeks, getMonthLabels, getToday, getYears, type CalendarData, type ContributionDay } from "@/lib/github-calendar";

type Tooltip = { date: string; count: number; x: number; y: number };
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
const contributions = (count: number) => `${count === 0 ? "No" : count.toLocaleString("en-US")} ${count === 1 ? "contribution" : "contributions"}`;

function YearMenu({ years, year, onChange }: { years: number[]; year: number; onChange: (year: number) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    options.current[Math.max(0, years.indexOf(year))]?.focus();
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, year, years]);

  function choose(value: number) {
    onChange(value);
    setOpen(false);
    button.current?.focus();
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    const index = options.current.indexOf(document.activeElement as HTMLButtonElement);
    const move = (next: number) => { event.preventDefault(); options.current[(next + years.length) % years.length]?.focus(); };
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(years.length - 1);
    else if (event.key === "Escape") { event.preventDefault(); setOpen(false); button.current?.focus(); }
    else if (event.key === "Tab") setOpen(false);
  }

  return <div className="year-menu" ref={root}>
    <button ref={button} type="button" className="year-menu-button" aria-haspopup="listbox" aria-expanded={open} aria-label={`Contribution year: ${year}`} onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); } }}>
      {year}<IconChevronDown size={14} stroke={2} aria-hidden="true" />
    </button>
    {open ? <div className="year-menu-list" role="listbox" aria-label="Choose a year" onKeyDown={onMenuKey}>
      {years.map((value, index) => <button key={value} ref={element => { options.current[index] = element; }} type="button" role="option" aria-selected={value === year} className="year-menu-option" onClick={() => choose(value)}>
        <IconCheck size={14} stroke={2} aria-hidden="true" className={value === year ? "" : "invisible"} />{value}
      </button>)}
    </div> : null}
  </div>;
}

export function GithubActivity() {
  const [today, setToday] = useState("");
  const [year, setYear] = useState(0);
  const [byYear, setByYear] = useState<Record<number, CalendarData>>({});
  const [failed, setFailed] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const currentYear = today ? Number(today.slice(0, 4)) : 0;

  // The page is prerendered, so the current year is decided in the visitor's browser.
  useEffect(() => {
    const now = getToday();
    setToday(now);
    setYear(Number(now.slice(0, 4)));
  }, []);

  useEffect(() => {
    if (!year) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/github?year=${year}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error();
        const result: CalendarData = await response.json();
        setByYear(previous => ({ ...previous, [year]: result }));
        setFailed(null);
        setToday(getToday());
      } catch {
        if (!controller.signal.aborted) setFailed(year);
      }
    }
    void load();
    if (year !== currentYear) return () => controller.abort();
    const refresh = () => { if (document.visibilityState === "visible") void load(); };
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, [year, currentYear]);

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

  const data = year ? byYear[year] : undefined;
  const weeks = data ? getCalendarWeeks(data.days) : [];
  const monthLabels = getMonthLabels(weeks);

  return <div className="github-graph">
    <div className="github-graph-header">
      <a className="github-graph-title" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" aria-label={`${GITHUB_USERNAME} on GitHub (opens in a new tab)`}>github</a>
      {year ? <YearMenu years={getYears(currentYear)} year={year} onChange={value => { setYear(value); setTooltip(null); }} /> : null}
    </div>
    {!data && failed !== year ? <><div className="github-graph-skeleton" aria-busy="true"><span className="sr-only" role="status">Loading GitHub contributions</span></div><p className="github-graph-total" aria-hidden="true">&nbsp;</p></> : null}
    {!data && failed === year ? <p className="github-graph-total">GitHub activity is temporarily unavailable. <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">View my profile</a></p> : null}
    {data ? <>
      <div className="github-graph-scroll" tabIndex={0} role="region" aria-label={`GitHub contributions in ${year}`} onKeyDown={event => { if (event.key === "Escape") setTooltip(null); }}>
        <div className="github-graph-weeks">
          {weeks.map((week, weekIndex) => <div className="github-graph-week" key={weekIndex}>
            <span className="github-graph-month" aria-hidden="true">{monthLabels[weekIndex]}</span>
            {week.map((day, dayIndex) => !day
              ? <span key={`empty-${dayIndex}`} className="github-graph-empty" />
              : day.date > today
                ? <span key={day.date} className="github-graph-day is-future" aria-hidden="true" />
                : <span key={day.date} className="github-graph-day" data-level={day.level} tabIndex={-1} role="img" aria-label={`${contributions(day.count)} on ${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}`} onMouseEnter={event => showTooltip(event, day)} onMouseLeave={() => setTooltip(null)} onClick={event => showTooltip(event, day)} onFocus={event => showTooltip(event, day)} onBlur={() => setTooltip(null)} />)}
          </div>)}
        </div>
      </div>
      <p className="github-graph-total">{data.total.toLocaleString("en-US")} {data.total === 1 ? "contribution" : "contributions"} in {year}</p>
    </> : null}
    {tooltip ? <div role="tooltip" className="activity-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{contributions(tooltip.count)} on {dateFormatter.format(new Date(`${tooltip.date}T00:00:00Z`))}.</div> : null}
  </div>;
}
