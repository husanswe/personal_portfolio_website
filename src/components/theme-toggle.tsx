"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || "dark", () => "dark");
  function setTheme(next: string) {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("husan-theme-v1", next); } catch { /* Theme still works when storage is unavailable. */ }
  }
  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      <button type="button" aria-label="Switch to light mode" aria-pressed={theme === "light"} onClick={() => setTheme("light")}><IconSun size={16} stroke={1.6} /></button>
      <button type="button" aria-label="Switch to dark mode" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><IconMoon size={16} stroke={1.6} /></button>
    </div>
  );
}
