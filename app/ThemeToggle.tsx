"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("astroyu-theme"); } catch { /* Storage may be disabled. */ }
      const next = saved === "dark" || (saved !== "light" && media.matches);
      document.documentElement.dataset.theme = next ? "dark" : "light";
      setDark(next);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("astroyu-theme", next ? "dark" : "light"); } catch { /* Keep the current session preference. */ }
  }

  return (
    <button
      className="theme-toggle grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-transparent p-0 text-[var(--ink)] transition-all duration-300 hover:rotate-[16deg] hover:bg-[var(--soft)] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      aria-pressed={dark}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        {dark ? <path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" /> : <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}
      </svg>
    </button>
  );
}
