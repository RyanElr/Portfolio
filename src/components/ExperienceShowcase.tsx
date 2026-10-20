"use client";

import { useEffect, useState } from "react";
import ExperienceDeck from "@/components/ExperienceDeck";
import ExperienceList from "@/components/ExperienceList";
import type { Experience } from "@/components/ExperienceCard";

// The pinned 3D deck needs room and motion; phones, short screens and reduced motion get the list.
const DECK_QUERY = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

export default function ExperienceShowcase({ experiences }: { experiences: Experience[] }) {
  const [deck, setDeck] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DECK_QUERY);
    const update = () => setDeck(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return deck ? <ExperienceDeck experiences={experiences} /> : <ExperienceList experiences={experiences} />;
}
