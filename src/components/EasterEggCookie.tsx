"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

export default function EasterEggCookie() {
  const consent = useConsent();
  const allowed = consent?.easterEgg === true;

  useEffect(() => {
    if (consent === undefined) return;
    // Stored as plain text so it reads cleanly in the dev tools (no ";" or "," allowed in a cookie value).
    const message = "Easter Egg trouvé ! Félicitation et à bientôt pour de nouvelles aventures";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    try {
      // Optional cookie: only set after consent, and removed when consent is withdrawn.
      document.cookie = allowed
        ? `easter_egg=${message}; Path=/; SameSite=Lax${secure}`
        : `easter_egg=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    } catch {
      // The site still works when the browser blocks cookies.
    }
  }, [consent, allowed]);

  return null;
}
