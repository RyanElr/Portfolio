 "use client";

import { useState } from "react";

import MatrixRain from "@/components/MatrixRain";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

type SectionId = "hero" | "experiences" | "projects" | "contact";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Accueil" },
  { id: "experiences", label: "Expériences" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
];

export default function OnePageLayout() {
  const [active, setActive] = useState<SectionId>("hero");

  const handleNavigate = (target: SectionId) => {
    setActive(target);
    const el = document.getElementById(`section-${target}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-black relative isolate">
      <div className="hidden sm:block absolute inset-0 z-0 opacity-[0.35] mix-blend-screen pointer-events-none">
        <MatrixRain />
      </div>

      <OnePageHeader
        active={active}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pb-safe pt-4 space-y-24">
        <section id="section-hero">
          <HeroSection />
        </section>
        <section id="section-experiences">
          <ExperiencesSection />
        </section>
        <section id="section-projects">
          <ProjectsSection />
        </section>
        <section id="section-contact">
          <ContactSection />
        </section>

        <footer className="mt-10 text-xs text-foreground/60">
          <Footer />
        </footer>
      </main>
    </div>
  );
}

function OnePageHeader({
  active,
  onNavigate,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <header className="w-full sticky top-0 z-40 bg-[rgba(11,11,11,0.8)] backdrop-blur sm:border-b sm:border-black/40">
      <div className="hidden sm:flex mx-auto max-w-6xl px-4 py-3 items-center justify-between">
        <span className="font-semibold tracking-tight text-lg text-orange-400">
          Ryan.dev
        </span>
        <nav className="flex gap-6 text-sm items-center">
          {SECTIONS.map(({ id, label }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={`relative inline-flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-300"
                    : "text-foreground/80 hover:text-orange-300"
                }`}
              >
                <span>{label}</span>
                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/40 bg-[rgba(11,11,11,0.9)] backdrop-blur pb-[max(env(safe-area-inset-bottom),0px)]">
        <ul className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2 text-[11px]">
          {SECTIONS.map(({ id, label }) => {
            const isActive = id === active;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={`flex flex-col items-center justify-center gap-1 py-1 rounded-md transition-colors ${
                    isActive
                      ? "text-orange-300"
                      : "text-foreground/80 hover:text-orange-300"
                  }`}
                >
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

