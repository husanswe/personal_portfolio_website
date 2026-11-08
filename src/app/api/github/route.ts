import { NextRequest, NextResponse } from "next/server";
import { CONTRIBUTIONS_QUERY, GITHUB_FIRST_YEAR, GITHUB_USERNAME, fromGraphql, fromOpenApi, getCurrentYear, type CalendarData } from "@/lib/github-calendar";

export const runtime = "nodejs";

// The current year refreshes every minute; finished years never change, so they are cached for a day.
const LIVE = 60;
const ARCHIVED = 86_400;

async function loadFromGraphql(token: string, year: number, revalidate: number) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "HusanSuleymanPortfolio/2.0" },
    body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: GITHUB_USERNAME, from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` } }),
    next: { revalidate },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub GraphQL API returned ${response.status}`);
  return fromGraphql(await response.json(), year);
}

async function loadFromOpenApi(year: number, revalidate: number) {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=${year}`, {
    headers: { Accept: "application/json", "User-Agent": "HusanSuleymanPortfolio/2.0" },
    next: { revalidate },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub contributions API returned ${response.status}`);
  return fromOpenApi(await response.json(), year);
}

export async function GET(request: NextRequest) {
  const currentYear = getCurrentYear();
  const value = request.nextUrl.searchParams.get("year") ?? String(currentYear);
  if (!/^\d{4}$/.test(value) || Number(value) < GITHUB_FIRST_YEAR || Number(value) > currentYear) {
    return NextResponse.json({ error: `Please choose a year between ${GITHUB_FIRST_YEAR} and ${currentYear}.` }, { status: 400 });
  }
  const year = Number(value);
  const revalidate = year === currentYear ? LIVE : ARCHIVED;
  const token = process.env.GITHUB_TOKEN?.trim();
  try {
    let result: { total: number; days: CalendarData["days"] };
    let source: CalendarData["source"] = "github-contributions-api";
    if (token) {
      try {
        result = await loadFromGraphql(token, year, revalidate);
        source = "github-graphql";
      } catch (error) {
        console.error("GitHub GraphQL unavailable, using open API:", error instanceof Error ? error.message : error);
        result = await loadFromOpenApi(year, revalidate);
      }
    } else {
      result = await loadFromOpenApi(year, revalidate);
    }
    const body: CalendarData = { username: GITHUB_USERNAME, year, ...result, source, fetchedAt: new Date().toISOString() };
    return NextResponse.json(body, { headers: { "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
  } catch (error) {
    console.error("GitHub activity unavailable:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
