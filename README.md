# Husan Suleyman — Portfolio

A responsive, pitch black portfolio for a junior backend engineer, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Tabler Icons.

## Run locally

Install Node.js 20.9 or newer, then run:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

```sh
npm run build
npm start
```

## Deploy on Vercel

1. Push this project to your GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected **Next.js** framework and default build settings.
4. Click **Deploy**.

No database, paid services, API keys, or environment variables are required. The GitHub calendar uses a Next.js server route, so deploy as a normal Next.js application rather than a static HTML export.

## Update your content

- Edit your name, role, social links, projects, tech stack, and skills in `src/lib/portfolio.ts`.
- Edit the About and Languages sections in `src/app/page.tsx`.
- Update colors and responsive styling in `src/app/globals.css`.
- When Klean or Texmart is deployed, add its URL in `src/lib/portfolio.ts` and update its status. It will automatically become a clickable project.
- Klean and Texmart use lightweight illustrative covers, clearly labeled on the page. Swarovski uses your supplied screenshot in `public/projects/swarovski.png`.
- Tech stack categories use responsive black-and-white cards with always-glowing icons in `src/components/tech-stack.tsx`.

## GitHub activity

The calendar fetches the actual public contribution calendar for `husanswe` from GitHub on the server. It starts with 2026, automatically selects the latest calendar year, and adds future year options as time passes. The graph shows a full January–December calendar, daily hover/focus/tap details, total contributions, current streak, longest streak within the selected year, and active days.

The browser refreshes once a minute while the page is visible and when returning to the tab. Server responses are cached for 60 seconds. GitHub itself may take additional time to reflect new activity; this is near-live rather than an instant stream. The calendar counts **contributions**, which can include commits, pull requests, reviews, and issues; it does not falsely label every contribution as a commit. Private activity is limited to what your GitHub profile makes public.

The public calendar requires no token. If GitHub is temporarily unavailable, the site displays an honest error and retry button, or keeps the last successful result when a background refresh fails. It never fabricates activity. GitHub could change its public HTML format; `src/lib/github-calendar.ts` validates the complete calendar and fails explicitly if the format changes.

## Theme and accessibility

Dark mode is the default, regardless of the device theme. The sun and moon controls save the visitor's choice locally and restore it before the page paints. The site includes semantic sections, a skip link, visible keyboard focus, reduced motion support, and touch-friendly social links. The activity calendar scrolls within its panel on narrow screens without widening the page.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Calendar tests cover streak boundaries, future dates, weekday alignment, and malformed upstream data. If `.tools/github-calendar.html` is present locally, they also check the parser against the downloaded real calendar.

## Create a repository

Create an empty repository such as `husan-portfolio` on GitHub. Do not initialize it with a README or other files if you will push this existing project.

```sh
git init -b main
git add .
git commit -m "Build Husan Suleyman portfolio"
git remote add origin https://github.com/husanswe/husan-portfolio.git
git push -u origin main
```

Your own project links, social profiles, and biographical text are used throughout. The Swarovski project is presented as a frontend recreation, without implying affiliation with the brand.
