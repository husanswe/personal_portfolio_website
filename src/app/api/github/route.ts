import { NextResponse } from "next/server";
import { CONTRIBUTIONS_QUERY, GITHUB_USERNAME, fromGraphql, fromOpenApi, type CalendarData } from "@/lib/github-calendar";

export const runtime = "nodejs";

const REVALIDATE = 60;

async function loadFromGraphql(token: string) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "HusanSuleymanPortfolio/2.0" },
    body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: GITHUB_USERNAME } }),
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub GraphQL API returned ${response.status}`);
  return fromGraphql(await response.json());
}

async function loadFromOpenApi() {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
    headers: { Accept: "application/json", "User-Agent": "HusanSuleymanPortfolio/2.0" },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub contributions API returned ${response.status}`);
  return fromOpenApi(await response.json());
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN?.trim();
  try {
    let result: { total: number; days: CalendarData["days"] };
    let source: CalendarData["source"] = "github-contributions-api";
    if (token) {
      try {
        result = await loadFromGraphql(token);
        source = "github-graphql";
      } catch (error) {
        console.error("GitHub GraphQL unavailable, using open API:", error instanceof Error ? error.message : error);
        result = await loadFromOpenApi();
      }
    } else {
      result = await loadFromOpenApi();
    }
    const body: CalendarData = { username: GITHUB_USERNAME, ...result, source, fetchedAt: new Date().toISOString() };
    return NextResponse.json(body, { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=${REVALIDATE}` } });
  } catch (error) {
    console.error("GitHub activity unavailable:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
