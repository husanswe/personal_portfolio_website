import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Husan Suleyman — Junior Backend Engineer",
  description: "Junior backend engineer working with PHP and Laravel. Explore my projects, tech stack, and GitHub activity.",
  applicationName: "Husan Suleyman's portfolio",
  openGraph: {
    title: "Husan Suleyman — Junior Backend Engineer",
    description: "Building thoughtful products with PHP, Laravel, and a love for solving problems.",
    type: "website",
  },
  twitter: { card: "summary", creator: "@husanswe" },
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
