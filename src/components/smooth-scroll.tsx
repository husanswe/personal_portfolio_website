"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0,
      duration: 1.35,
      wheelMultiplier: 0.85,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
    });

    function scrollToSection(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.classList.contains("skip-link") || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      lenis.scrollTo(target, {
        duration: 1.35,
        onComplete: () => {
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) {
            target.setAttribute("tabindex", "-1");
            target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
          }
          target.focus({ preventScroll: true });
        },
      });
    }

    document.addEventListener("click", scrollToSection);
    return () => {
      document.removeEventListener("click", scrollToSection);
      lenis.destroy();
    };
  }, []);

  return null;
}
