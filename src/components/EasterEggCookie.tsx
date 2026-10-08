"use client";

import { useEffect } from "react";

export default function EasterEggCookie() {
  useEffect(() => {
    const message = "Easter Egg trouvé ! Félicitation et à bientôt pour de nouvelles aventures";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    try {
      document.cookie = `easter_egg=${encodeURIComponent(message)}; Path=/; SameSite=Lax${secure}`;
    } catch {
      // The site still works when the browser blocks cookies.
    }
  }, []);

  return null;
}
