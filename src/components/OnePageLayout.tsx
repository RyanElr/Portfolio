"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AmbientAudio from "@/components/AmbientAudio";
import ScrollSculpture from "@/components/ScrollSculpture";

import MatrixRain from "@/components/MatrixRain";
import HeroSection from "@/components/sections/HeroSection";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

type SectionId = "hero" | "experiences" | "projects" | "contact";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "hero", label: "Accueil", icon: <IconHome /> },
  { id: "experiences", label: "Expériences", icon: <IconBriefcase /> },
  { id: "projects", label: "Projets", icon: <IconGrid /> },
  { id: "contact", label: "Contact", icon: <IconMail /> },
];

export default function DiscreteSliderLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useRef(0);
  const handleNavigate = useCallback((index: number) => {
    document.getElementById(`slide-${SECTIONS[index].id}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const tops = SECTIONS.map(({ id }) => document.getElementById(`slide-${id}`)?.getBoundingClientRect().top ?? 0);
      const anchor = window.innerHeight * 0.25;
      let index = 0;
      for (let i = 1; i < tops.length; i++) if (tops[i] <= anchor) index = i;
      setActiveIndex(index);
      let segment = 0;
      for (let i = 1; i < tops.length; i++) if (tops[i] <= 0) segment = i;
      const span = segment < 3 ? tops[segment + 1] - tops[segment] : window.innerHeight;
      progress.current = Math.min(3, segment + Math.max(0, -tops[segment] / Math.max(1, span)));
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="font-sans min-h-dvh bg-black relative isolate">
      {/* Background Matrix */}
      <div className="hidden sm:block fixed inset-0 z-0 opacity-[0.10] mix-blend-screen pointer-events-none">
        <MatrixRain />
      </div>

      <ScrollSculpture progress={progress} />
      <AmbientAudio />

      {/* Navigation follows the document scroll. */}
      <SliderHeader
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
      />

      {/* Native scrolling drives the persistent 3D emblem. */}
      <main className="relative z-10 w-full">

        <Slide id="hero" noPaddingTop>
          <HeroSection />
        </Slide>

        <Slide id="experiences">
          <ExperiencesSection />
        </Slide>

        <Slide id="projects">
          <ProjectsSection />
        </Slide>

        <Slide id="contact">
          <div className="flex-1 flex flex-col">
            <ContactSection />
          </div>
        </Slide>

      </main>
    </div>
  );
}

function Slide({ id, children, noPaddingTop = false }: {
  id: SectionId; children: React.ReactNode; noPaddingTop?: boolean;
}) {
  return (
    <section id={`slide-${id}`} className={`relative min-h-dvh scroll-mt-16 px-5 md:px-8 ${noPaddingTop ? "" : "pt-20 pb-28 md:pb-16"}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function SliderHeader({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  return (
    <>
      <header className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-[rgba(11,11,11,0.8)] backdrop-blur border-b border-black/40">
        <div className="flex mx-auto max-w-7xl px-8 py-4 items-center justify-between">
          <span className="font-semibold tracking-tight text-lg text-orange-400">
            Ryan.dev
          </span>
          <nav className="flex gap-8 text-sm items-center">
            {SECTIONS.map(({ id, label }, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(idx)}
                  className={`relative inline-flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${isActive
                    ? "text-orange-300 font-medium"
                    : "text-foreground/80 hover:text-orange-300"
                    }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/40 bg-[rgba(11,11,11,0.9)] backdrop-blur pb-[max(env(safe-area-inset-bottom),0px)]">
        <ul className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2 text-[11px]">
          {SECTIONS.map(({ id, label, icon }, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onNavigate(idx)}
                  className={`flex flex-col items-center justify-center gap-1 py-1 w-full rounded-md transition-colors ${isActive
                    ? "text-orange-300 font-medium"
                    : "text-foreground/80 hover:text-orange-300"
                    }`}
                >
                  <span className="h-6 w-6">{icon}</span>
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
