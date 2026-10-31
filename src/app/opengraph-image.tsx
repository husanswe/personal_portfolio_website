import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/portfolio";

export const runtime = "nodejs";
export const alt = "Husan Suleyman — Backend Engineer. PHP and Laravel.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Regular.ttf"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "62px 74px", background: "#000", color: "#fff", fontFamily: "JetBrains Mono", border: "1px solid #333" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <svg width="44" height="48" viewBox="0 0 32 36"><path fill="#fff" d="M2 2h8v12h12V2h8v32h-8V22H10v12H2z" /></svg>
        <span style={{ fontSize: 19, letterSpacing: 3, color: "#999" }}>PHP / LARAVEL</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 91 }}>
        <div style={{ display: "flex", fontSize: 66, letterSpacing: -3 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 17, color: "#aaa" }}>{profile.role}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #333", marginTop: "auto", paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
          <span style={{ color: "#aaa" }}>Thoughtful code. Useful products.</span>
          <span>github.com/husanswe</span>
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "JetBrains Mono", data: font, weight: 400, style: "normal" }] },
  );
}
