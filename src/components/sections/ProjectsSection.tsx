"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import ProjectsGrid, { Project } from "@/components/ProjectsGrid";
import projects from "@/data/projects.json";
import GsapReveal from "@/components/GsapReveal";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface RevealPayload {
  project: Project;
  originRect: DOMRect; // bounding box of the card that was clicked
}

/* ══════════════════════════════════════════════════════════════════════════
   ProjectsSection
══════════════════════════════════════════════════════════════════════════ */
export default function ProjectsSection() {
  const [payload, setPayload] = useState<RevealPayload | null>(null);

  const handleReveal = useCallback((project: Project, originRect: DOMRect) => {
    setPayload({ project, originRect });
  }, []);

  const handleClose = useCallback(() => {
    setPayload(null);
  }, []);

  return (
    <section className="min-h-[calc(100dvh-72px)] lg:min-h-[calc(100dvh-96px)] flex flex-col pt-16 lg:pt-20">
      <GsapReveal>
        <header className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Projets
          </h2>
          <p className="mt-2 text-sm text-foreground/75 max-w-xl">
            Une sélection de projets perso et pro autour du web moderne,
            des APIs et d&apos;interfaces animées.
          </p>
        </header>
      </GsapReveal>

      <div className="mt-6 flex-1">
        <ProjectsGrid
          projects={projects}
          onRevealProject={handleReveal}
        />
      </div>

      {payload && (
        <ProjectDetailModal
          project={payload.project}
          originRect={payload.originRect}
          onClose={handleClose}
        />
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ProjectDetailModal  –  cinematic expand + Matrix glitch
══════════════════════════════════════════════════════════════════════════ */
function ProjectDetailModal({
  project,
  originRect,
  onClose,
}: {
  project: Project;
  originRect: DOMRect;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const glitchRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false);

  /* ── OPEN animation ───────────────────────────────────────────────── */
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const glitch = glitchRef.current;
    const content = contentRef.current;
    if (!backdrop || !panel || !glitch || !content) return;

    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    // Starting clip-path centred on the source card
    const cx = originRect.left + originRect.width / 2;
    const cy = originRect.top + originRect.height / 2;
    const rx = originRect.width / 2;
    const ry = originRect.height / 2;

    const startClip = `inset(${cy - ry}px ${vpW - cx - rx}px ${vpH - cy - ry}px ${cx - rx}px round 16px)`;
    const endClip = `inset(0px 0px 0px 0px round 0px)`;

    // Hide pieces before animating
    gsap.set(content.children, { autoAlpha: 0, y: 24 });
    gsap.set(glitch, { autoAlpha: 0 });

    const tl = gsap.timeline();

    // 1. Backdrop fade-in
    tl.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });

    // 2. Panel expands from card position via clip-path
    tl.fromTo(
      panel,
      { clipPath: startClip, autoAlpha: 1 },
      {
        clipPath: endClip,
        duration: 0.65,
        ease: "expo.inOut",
      },
      "<0.05"
    );

    // 3. Matrix glitch flash at the peak
    tl.to(glitch, { autoAlpha: 0.6, duration: 0.06 }, "-=0.12")
      .to(glitch, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });

    // 4. Content lines cascade in
    tl.to(
      content.children,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.07,
        ease: "power3.out",
      },
      "-=0.1"
    );

    return () => { tl.kill(); };
  }, [originRect]);

  /* ── CLOSE animation ─────────────────────────────────────────────── */
  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const glitch = glitchRef.current;
    if (!panel || !backdrop || !glitch) { onClose(); return; }

    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const cx = originRect.left + originRect.width / 2;
    const cy = originRect.top + originRect.height / 2;
    const rx = originRect.width / 2;
    const ry = originRect.height / 2;
    const endClip = `inset(${cy - ry}px ${vpW - cx - rx}px ${vpH - cy - ry}px ${cx - rx}px round 16px)`;

    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(glitch, { autoAlpha: 0.5, duration: 0.05 })
      .to(glitch, { autoAlpha: 0, duration: 0.1 })
      .to(panel, {
        clipPath: endClip,
        duration: 0.5,
        ease: "expo.inOut",
      })
      .to(backdrop, { autoAlpha: 0, duration: 0.2 }, "-=0.15");
  };

  /* ── Keyboard: Escape ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Matrix glitch scanlines overlay */}
      <div
        ref={glitchRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(234,179,8,0.08) 0px, rgba(234,179,8,0.08) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Expanding panel */}
      <div
        ref={panelRef}
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{ willChange: "clip-path" }}
      >
        {/* Dark full-screen bg so the clip-path reveals look solid */}
        <div className="absolute inset-0 bg-[#080808]" />

        {/* Centered card content */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
          <div
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-black shadow-[0_40px_140px_rgba(0,0,0,0.9)]"
            onMouseLeave={handleClose}
          >

            {/* Hero image */}
            <div className="relative aspect-video bg-black/40">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.titre}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Close button top-right */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white hover:border-amber-400/80 hover:text-amber-300 transition-colors duration-150"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content cascade */}
            <div ref={contentRef} className="p-5 sm:p-8 space-y-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white">{project.titre}</h3>
                {project.sousTitre && (
                  <p className="mt-1 text-sm text-foreground/70">{project.sousTitre}</p>
                )}
              </div>

              {project.description && (
                <p className="text-sm text-foreground/80 leading-relaxed">{project.description}</p>
              )}

              {project.tech && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-100 px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
