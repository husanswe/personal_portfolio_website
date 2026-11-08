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

No database or paid services are required. An optional free `GITHUB_TOKEN` makes the GitHub graph real-time (see below). The GitHub calendar uses a Next.js server route, so deploy as a normal Next.js application rather than a static HTML export.

## SEO and social sharing

The site includes a canonical URL, Open Graph website metadata, a large X/Twitter card, author information, a sitemap, and robots instructions. The 1200 × 630 sharing image uses the black-and-white branding and a locally bundled JetBrains Mono font, with no external font request at build or request time. The font license is included in `assets/fonts/OFL.txt`.

Vercel's production domain supplies absolute sharing and sitemap URLs automatically through `VERCEL_PROJECT_PRODUCTION_URL`. If you use a custom canonical domain, set the optional `SITE_URL` environment variable to its full HTTPS address in Vercel before deploying. For local testing, copy `.env.example` to `.env.local` and set `SITE_URL` there. Never commit `.env.local`. Without a configured domain or Vercel environment, links use the local preview address. Preview deployments are marked noindex to avoid duplicate search results.

## Update your content

- Edit your name, role, social links, projects, tech stack, and skills in `src/lib/portfolio.ts`.
- Edit the About and Languages sections in `src/app/page.tsx`.
- Update colors and responsive styling in `src/app/globals.css`.
- The hero uses your supplied portrait in `public/images/husan-suleyman.png`, with a rectangular frame and subtle 10px corners beside the text on large screens and a centered portrait below the heading on phones. Next.js serves responsive image sizes.
- When Klean or Texmart is deployed, add its URL in `src/lib/portfolio.ts` and update its status. It will automatically become a clickable project.
- Texmart uses a lightweight illustrative cover, clearly labeled on the page. Klean, Swarovski, and Breed use your supplied screenshots in `public/projects/`. The four projects form a two-column grid that stacks on phones; live projects have clickable previews and titles.
- The combined Skills & Technologies section uses six responsive black-and-white cards with always-glowing icons in `src/components/skills-technologies.tsx`. Edit its grouped skills in `src/lib/portfolio.ts`.
- The LinkedIn-style Experience section contains only the three roles from the supplied screenshot. Edit them in `src/lib/portfolio.ts`. The company-logo tiles use the supplied reference image.

## GitHub activity

The Activity section shows the same contribution graph as the GitHub profile page: the last 12 months, Sunday-to-Saturday columns, five intensity levels, hover/tap details per day, and the total contributions in the last year.

Data comes from the server route `src/app/api/github/route.ts`:

1. **Official GitHub GraphQL API (recommended, real-time).** Create a GitHub personal access token (classic, no scopes needed) and add it in Vercel as the `GITHUB_TOKEN` environment variable, then redeploy. The graph then matches github.com exactly and updates within about a minute.
2. **Open GitHub contributions API (fallback, no token).** Without `GITHUB_TOKEN`, or if GraphQL fails, the route uses [github-contributions-api](https://github.com/grubersjoe/github-contributions-api). That service caches GitHub's data, so new activity can take longer to appear.

The browser refreshes the graph every minute while the page is visible. The graph counts **contributions** (commits, pull requests, reviews, issues), exactly as GitHub does. Private activity appears only if your GitHub profile shows private contributions.

## Theme and accessibility

All interface text, including project-cover illustrations and form controls, uses the locally hosted JetBrains Mono variable font.

Dark mode is the default, regardless of the device theme. The sun and moon controls save the visitor's choice locally and restore it before the page paints. The site includes semantic sections, a skip link, visible keyboard focus, reduced motion support, and touch-friendly social links. The activity graph scrolls within its panel on narrow screens without widening the page.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Calendar tests cover both data sources, weekday alignment, month labels, and malformed upstream data.

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
