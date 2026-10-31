import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { profile } from "@/lib/portfolio";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const title = `${profile.name} — ${profile.role}`;
const description = "Backend Engineer building backend systems with PHP and Laravel. Explore my projects, experience, skills, technologies, and GitHub activity.";
const sharingImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Husan Suleyman — Backend Engineer. PHP and Laravel." };

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title,
  description,
  applicationName: "Husan Suleyman's portfolio",
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Husan Suleyman",
    locale: "en_US",
    type: "website",
    images: [sharingImage],
  },
  twitter: { card: "summary_large_image", title, description, creator: "@husanswe", images: [sharingImage] },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#000000" }, { media: "(prefers-color-scheme: light)", color: "#000000" }],
};

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('husan-theme-v1')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
