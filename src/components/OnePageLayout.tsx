"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

import MatrixRain from "@/components/MatrixRain";
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

export default function DiscreteSliderLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndex = useRef(0);
  const isAnimating = useRef(false);

  const handleNavigate = useCallback((index: number) => {
    if (index === activeIndex || isAnimating.current) return;
    setActiveIndex(index);
  }, [activeIndex]);

  // Handle GSAP Transitions between slides
  useEffect(() => {
    if (activeIndex === prevIndex.current) return;

    const outId = SECTIONS[prevIndex.current].id;
    const inId = SECTIONS[activeIndex].id;

    const outNode = document.getElementById(`slide-${outId}`);
    const inNode = document.getElementById(`slide-${inId}`);

    if (!outNode || !inNode) return;

    isAnimating.current = true;
    const direction = activeIndex > prevIndex.current ? 1 : -1;

    // Reset scroll of the incoming node
    inNode.scrollTop = 0;

    // Prepare incoming slide
    gsap.killTweensOf([outNode, inNode]);

    // Position incoming slide off-screen and make it visible
    gsap.set(inNode, { xPercent: 100 * direction, autoAlpha: 1, zIndex: 20 });
    gsap.set(outNode, { zIndex: 10 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outNode, { autoAlpha: 0, xPercent: 0 }); // hide the old one when done
        prevIndex.current = activeIndex;
        isAnimating.current = false;
      }
    });

    tl.to(outNode, {
      xPercent: -40 * direction, // push out slightly for parallax
      opacity: 0,
      duration: 0.7,
      ease: "power3.inOut",
    }, 0);

    tl.to(inNode, {
      xPercent: 0,
      duration: 0.7,
      ease: "power3.inOut",
    }, 0);

  }, [activeIndex]);

  // Initial setup: make only the first slide visible
  useEffect(() => {
    SECTIONS.forEach((sec, idx) => {
      const node = document.getElementById(`slide-${sec.id}`);
      if (node) {
        if (idx === 0) {
          gsap.set(node, { autoAlpha: 1, xPercent: 0, zIndex: 20 });
        } else {
          gsap.set(node, { autoAlpha: 0, xPercent: 0, zIndex: 10 });
        }
      }
    });
  }, []);

  return (
    <div className="font-sans h-[100dvh] w-screen overflow-hidden bg-black relative isolate">
      {/* Background Matrix */}
      <div className="hidden sm:block absolute inset-0 z-0 opacity-[0.35] mix-blend-screen pointer-events-none">
        <MatrixRain />
      </div>

      {/* Floating Header overlaps the slider */}
      <SliderHeader
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
      />

      {/* 
        Main Viewport Container:
        All slides are stacked absolutely. 
        GSAP moves them in and out via xPercent.
      */}
      <main className="relative z-10 w-full h-full overflow-hidden">

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

/**
 * Slide wrapper:
 * - Positioned absolutely taking the full screen
 * - Handles its own internal vertical scrolling overflow-y-auto
 * - Initially hidden via CSS opacity-0, except GSAP will take over
 */
function Slide({
  id,
  children,
  noPaddingTop = false,
}: {
  id: SectionId;
  children: React.ReactNode;
  noPaddingTop?: boolean;
}) {
  return (
    <section
      id={`slide-${id}`}
      className={`
        absolute inset-0 w-full h-full
        overflow-y-auto overflow-x-hidden
        flex flex-col opacity-0 invisible
        ${noPaddingTop ? "" : "pt-14 sm:pt-16"} /* Padding to account for the fixed header */
        px-4 sm:px-8
      `}
    >
      <div className="mx-auto w-full max-w-6xl flex-1 flex flex-col min-h-full">
        {children}
      </div>
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
    <header className="absolute top-0 left-0 right-0 z-40 bg-[rgba(11,11,11,0.8)] backdrop-blur sm:border-b sm:border-black/40">
      <div className="hidden sm:flex mx-auto max-w-7xl px-4 sm:px-8 py-4 items-center justify-between">
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

      {/* Mobile Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/40 bg-[rgba(11,11,11,0.9)] backdrop-blur pb-[max(env(safe-area-inset-bottom),0px)]">
        <ul className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2 text-[11px]">
          {SECTIONS.map(({ id, label }, idx) => {
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
