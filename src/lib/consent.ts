"use client";

import { useEffect, useState } from "react";

// Bump the version when the list of optional cookies changes, so visitors are asked again.
const VERSION = 1;
const NAME = "cookie_consent";
// The CNIL recommends keeping a consent choice for about six months.
const MAX_AGE = 60 * 60 * 24 * 182;
const EVENT = "cookie-consent-change";

export type Consent = { version: number; easterEgg: boolean; decidedAt: string };

// Readable value, e.g. "v1|easter_egg=on|2026-10-20T20:18:22.322Z".
function serialize(consent: Consent) {
  return `v${consent.version}|easter_egg=${consent.easterEgg ? "on" : "off"}|${consent.decidedAt}`;
}

export function readConsent(): Consent | null {
  try {
    const entry = document.cookie.split("; ").find((part) => part.startsWith(`${NAME}=`));
    if (!entry) return null;
    const [version, easterEgg, decidedAt] = entry.slice(NAME.length + 1).split("|");
    if (version !== `v${VERSION}` || !/^easter_egg=(on|off)$/.test(easterEgg ?? "")) return null;
    return { version: VERSION, easterEgg: easterEgg === "easter_egg=on", decidedAt: decidedAt ?? "" };
  } catch {
    return null;
  }
}

export function saveConsent(easterEgg: boolean): Consent {
  const consent: Consent = { version: VERSION, easterEgg, decidedAt: new Date().toISOString() };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  try {
    document.cookie = `${NAME}=${serialize(consent)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  } catch {
    // The choice still applies for this visit when the browser blocks cookies.
  }
  window.dispatchEvent(new CustomEvent<Consent>(EVENT, { detail: consent }));
  return consent;
}

/** `undefined` until read on the client, `null` when the visitor has not chosen yet. */
export function useConsent() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  useEffect(() => {
    setConsent(readConsent());
    const change = (event: Event) => setConsent((event as CustomEvent<Consent>).detail);
    window.addEventListener(EVENT, change);
    return () => window.removeEventListener(EVENT, change);
  }, []);
  return consent;
}
