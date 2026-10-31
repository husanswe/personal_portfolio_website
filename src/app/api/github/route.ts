import { NextRequest, NextResponse } from "next/server";
import { parseCalendar } from "@/lib/github-calendar";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const currentYear = Math.max(2026, new Date().getUTCFullYear());
  const value = request.nextUrl.searchParams.get("year") ?? String(currentYear);
  if (!/^\d{4}$/.test(value) || Number(value) < 2026 || Number(value) > currentYear) {
    return NextResponse.json({ error: "Please choose a valid year from 2026 onwards." }, { status: 400 });
  }
  const year = Number(value);
  try {
    const response = await fetch(`https://github.com/users/husanswe/contributions?from=${year}-01-01&to=${year}-12-31`, {
      headers: { Accept: "text/html", "User-Agent": "HusanSuleymanPortfolio/1.0" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`GitHub calendar returned ${response.status}`);
    const days = parseCalendar(await response.text(), year);
    return NextResponse.json({ username: "husanswe", year, total: days.reduce((sum, day) => sum + day.count, 0), days, fetchedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("GitHub calendar unavailable:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable. Please try again or visit my GitHub profile." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
