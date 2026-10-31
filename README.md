# Husan Suleyman — Portfolio

A responsive, pitch black portfolio for a Backend Engineer, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Tabler Icons.

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

## SEO and social sharing

The site includes a canonical URL, Open Graph website metadata, a large X/Twitter card, author information, a sitemap, and robots instructions. The 1200 × 630 sharing image uses the black-and-white branding and a locally bundled JetBrains Mono font, with no external font request at build or request time. The font license is included in `assets/fonts/OFL.txt`.

Vercel's production domain supplies absolute sharing and sitemap URLs automatically through `VERCEL_PROJECT_PRODUCTION_URL`. If you use a custom canonical domain, set the optional `SITE_URL` environment variable to its full HTTPS address in Vercel before deploying. For local testing, copy `.env.example` to `.env.local` and set `SITE_URL` there. Never commit `.env.local`. Without a configured domain or Vercel environment, links use the local preview address. Preview deployments are marked noindex to avoid duplicate search results.

## Update your content

- Edit your name, role, social links, projects, tech stack, and skills in `src/lib/portfolio.ts`.
- Edit the About and Languages sections in `src/app/page.tsx`.
- Update colors and responsive styling in `src/app/globals.css`.
- The hero uses your supplied portrait in `public/images/husan-suleyman.png`, with a rectangular frame and subtle 10px corners beside the text on large screens and a centered portrait below the heading on phones. Next.js serves responsive image sizes.
- When Klean or Texmart is deployed, add its URL in `src/lib/portfolio.ts` and update its status. It will automatically become a clickable project.
- Klean and Texmart use lightweight illustrative covers, clearly labeled on the page. Swarovski uses your supplied screenshot in `public/projects/swarovski.png`.
- The combined Skills & Technologies section uses six responsive black-and-white cards with always-glowing icons in `src/components/skills-technologies.tsx`. Edit its grouped skills in `src/lib/portfolio.ts`.
- The LinkedIn-style Experience section contains only the three roles from the supplied screenshot. Edit them in `src/lib/portfolio.ts`. The company-logo tiles use the supplied reference image.

## GitHub activity

The calendar fetches the actual public contribution calendar for `husanswe` from GitHub on the server. The year selector includes every year from 2023, when the account was opened in February, through the current year, newest first. It automatically selects the current year and adds new year options as time passes. Selecting an earlier year loads that year's actual daily activity, totals, and streaks. The graph shows a full January–December calendar, daily hover/focus/tap details, total contributions, current or year-end streak, longest streak within the selected year, and active days.

The browser refreshes once a minute while the page is visible and when returning to the tab. Server responses are cached for 60 seconds. GitHub itself may take additional time to reflect new activity; this is near-live rather than an instant stream. The calendar counts **contributions**, which can include commits, pull requests, reviews, and issues; it does not falsely label every contribution as a commit. Private activity is limited to what your GitHub profile makes public.

The public calendar requires no token. If GitHub is temporarily unavailable, the site displays an honest error and retry button, or keeps the last successful result when a background refresh fails. It never fabricates activity. GitHub could change its public HTML format; `src/lib/github-calendar.ts` validates the complete calendar and fails explicitly if the format changes.

## Theme and accessibility

All interface text, including project-cover illustrations and form controls, uses the locally hosted JetBrains Mono variable font.

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
