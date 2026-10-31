type SiteEnvironment = {
  SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

export function getSiteUrl(environment: SiteEnvironment = {
  SITE_URL: process.env.SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
}): URL {
  const address = [environment.SITE_URL, environment.VERCEL_PROJECT_PRODUCTION_URL, environment.VERCEL_URL]
    .map(value => value?.trim()).find(Boolean);
  if (!address) return new URL("http://127.0.0.1:3000");
  const url = new URL(address.includes("://") ? address : `https://${address}`);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("SITE_URL must be a public HTTP or HTTPS website address.");
  }
  return new URL(url.origin);
}
