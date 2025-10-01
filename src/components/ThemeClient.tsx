"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { themeFor } from "@/lib/theme";

export default function ThemeClient() {
  const pathname = usePathname();
  useEffect(() => {
    const t = themeFor(pathname || "/");
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--rain", t.rain);
    root.style.setProperty("--fg", t.fg);
    root.style.setProperty("--bg", t.bg);
  }, [pathname]);
  return null;
}
