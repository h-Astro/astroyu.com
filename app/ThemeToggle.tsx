"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("astroyu-theme");
      } catch {
        /* Storage may be disabled. */
      }
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
    try {
      localStorage.setItem("astroyu-theme", next ? "dark" : "light");
    } catch {
      /* Keep the current session preference. */
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="theme-toggle size-10 cursor-pointer rounded-full border-[var(--line)] bg-transparent text-[var(--ink)] transition-all duration-300 hover:rotate-[16deg] hover:bg-[var(--soft)] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      aria-pressed={dark}
    >
      {dark ? (
        <Moon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Sun className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
      )}
    </Button>
  );
}
