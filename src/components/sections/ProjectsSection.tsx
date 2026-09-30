"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";

import ProjectsGrid, { Project } from "@/components/ProjectsGrid";
import projects from "@/data/projects";
import GsapReveal from "@/components/GsapReveal";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface RevealPayload {
  project: Project;
  originRect: DOMRect;
}

/* ══════════════════════════════════════════════════════════════════════════
   ProjectsSection
══════════════════════════════════════════════════════════════════════════ */
export default function ProjectsSection() {
  const [payload, setPayload] = useState<RevealPayload | null>(null);

  const handleReveal = useCallback((project: Project, originRect: DOMRect) => {
    setPayload(current => current ?? { project, originRect });
  }, []);

  const handleClose = useCallback(() => {
    setPayload(null);
  }, []);

  return (
    <section className="flex flex-col flex-1 pt-4">
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

      {payload && typeof document !== "undefined" && createPortal(
        <ProjectDetailModal
          project={payload.project}
          originRect={payload.originRect}
          onClose={handleClose}
        />,
        document.body
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ProjectDetailModal  –  cinematic expand + Matrix glitch + image carousel
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
  const shardsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRegionRef = useRef<HTMLDivElement>(null);
  const openTimeline = useRef<gsap.core.Timeline | null>(null);

  // Carousel state
  const images = (project.images && project.images.length > 0)
    ? project.images
    : project.image ? [project.image] : [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isCarouselAnim = useRef(false);

  const goToSlide = useCallback((nextIdx: number) => {
    if (isCarouselAnim.current || !carouselRef.current) return;
    if (nextIdx === currentIdx) return;
    const n = images.length;
    const safeIdx = ((nextIdx % n) + n) % n;
    const direction = nextIdx > currentIdx ? 1 : -1;

    const current = carouselRef.current.children[currentIdx] as HTMLElement;
    const next = carouselRef.current.children[safeIdx] as HTMLElement;
    if (!current || !next) return;

    isCarouselAnim.current = true;
    gsap.set(next, { xPercent: 100 * direction, autoAlpha: 1 });

    gsap.to(current, { xPercent: -60 * direction, autoAlpha: 0, duration: 0.45, ease: "power3.inOut" });
    gsap.to(next, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(current, { autoAlpha: 0 });
        isCarouselAnim.current = false;
        setCurrentIdx(safeIdx);
      },
    });
  }, [currentIdx, images.length]);

  // Initialize: show first, hide others
  useEffect(() => {
    if (!carouselRef.current) return;
    Array.from(carouselRef.current.children).forEach((el, i) => {
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, xPercent: i === 0 ? 0 : 100 });
    });
    setCurrentIdx(0);
  }, [project.id]);

  // Trackpad / mouse-wheel horizontal swipe support
  useEffect(() => {
    if (images.length <= 1) return;
    const el = carouselRef.current;
    if (!el) return;

    let accumulated = 0;
    const THRESHOLD = 60; // px needed to trigger a slide change

    const onWheel = (e: WheelEvent) => {
      // Only react to horizontal movement (trackpad 2-finger swipe)
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      accumulated += e.deltaX;
      if (accumulated > THRESHOLD) {
        accumulated = 0;
        goToSlide(currentIdx + 1);
      } else if (accumulated < -THRESHOLD) {
        accumulated = 0;
        goToSlide(currentIdx - 1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [images.length, currentIdx, goToSlide]);

  /* ── OPEN animation ───────────────────────────────────────────────── */
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const glitch = glitchRef.current;
    const content = contentRef.current;
    if (!backdrop || !panel || !glitch || !content) return;

    const shards = shardsRef.current;
    const card = cardRef.current;
    if (!shards || !card) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(glitch, { autoAlpha: 0 });
    gsap.set(content.children, { autoAlpha: 1, y: 0 });
    gsap.set(panel, { autoAlpha: reduced ? 1 : 0 });
    const imageRegion = imageRegionRef.current;
    if (!imageRegion) return;
    const target = imageRegion.getBoundingClientRect();
    const tiles = Array.from(shards.children) as HTMLElement[];
    const columns = 6, rows = 4;
    tiles.forEach((tile, i) => {
      const col = i % columns, row = Math.floor(i / columns);
      tile.replaceChildren();
      // Reuse the exact rendered image, object-fit, gradients and controls.
      // Each shard is a clipped window onto the final modal, not a stretched background.
      const replica = imageRegion.cloneNode(true) as HTMLElement;
      replica.setAttribute("aria-hidden", "true");
      replica.inert = true;
      replica.style.cssText = `position:absolute;width:${target.width}px;height:${target.height}px;left:0;top:0;transform-origin:0 0;pointer-events:none;visibility:visible;opacity:1;`;
      tile.appendChild(replica);
      gsap.set(replica, { x: -col * originRect.width / columns, y: -row * originRect.height / rows, scaleX: originRect.width / target.width, scaleY: originRect.height / target.height });
      gsap.set(tile, {
        left: originRect.left + col * originRect.width / columns,
        top: originRect.top + row * originRect.height / rows,
        width: originRect.width / columns + 1,
        height: originRect.height / rows + 1,
        backgroundSize: `${originRect.width}px ${originRect.height}px`,
        backgroundPosition: `${-col * originRect.width / columns}px ${-row * originRect.height / rows}px`,
      });
    });
    const tl = gsap.timeline();
    openTimeline.current = tl;
    if (reduced) {
      gsap.set(shards, { autoAlpha: 0 });
      tl.to(backdrop, { autoAlpha: 1, duration: 0.15 });
    } else {
      gsap.set(backdrop, { autoAlpha: 0 });
      tl.to(backdrop, { autoAlpha: 1, duration: 0.3 }, 0);
      // Phase 1: the original card breaks into 24 independently rotating tiles.
      tl.to(tiles, {
        x: i => Math.cos(i * 2.4) * (80 + (i % 5) * 22),
        y: i => Math.sin(i * 2.4) * (60 + (i % 4) * 20),
        rotationX: i => (i % 2 ? 1 : -1) * 55,
        rotationY: i => (i % 3 - 1) * 70,
        rotationZ: i => (i % 2 ? 1 : -1) * 18,
        scale: 0.78, duration: 0.8, ease: "power3.out",
      }, 0);
      // Phase 2: fragments converge at the modal's location before it is revealed.
      tiles.forEach((tile, i) => {
        const col = i % columns, row = Math.floor(i / columns);
        const imageHeight = target.height;
        tl.to(tile.firstElementChild, {
          x: -col * target.width / columns, y: -row * target.height / rows,
          scaleX: 1, scaleY: 1, duration: 0.95, ease: "power3.inOut",
        }, 0.8);
        tl.to(tile, {
          left: target.left + col * target.width / columns,
          top: target.top + row * imageHeight / rows,
          width: target.width / columns + 1, height: imageHeight / rows + 1,
          backgroundSize: `${target.width}px ${imageHeight}px`,
          backgroundPosition: `${-col * target.width / columns}px ${-row * imageHeight / rows}px`,
          x: 0, y: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
          duration: 0.95, ease: "power3.inOut",
        }, 0.8);
      });
      // Let the surrounding panel settle before the image finishes assembling.
      gsap.set(imageRegion, { autoAlpha: 0 });
      tl.to(panel, { autoAlpha: 1, duration: 0.45 }, 1.2);
      tl.set(imageRegion, { autoAlpha: 1 }, 1.8);
      tl.to(shards, { autoAlpha: 0, duration: 0.2, ease: "none" }, 1.8);
    }
    return () => {
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [originRect]);

  /* ── CLOSE animation ─────────────────────────────────────────────── */
  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    openTimeline.current?.kill();
    gsap.set(shardsRef.current, { autoAlpha: 0 });

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
      .to(panel, { clipPath: endClip, duration: 0.5, ease: "expo.inOut" })
      .to(backdrop, { autoAlpha: 0, duration: 0.2 }, "-=0.15");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goToSlide(currentIdx + 1);
      if (e.key === "ArrowLeft") goToSlide(currentIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, goToSlide]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={project.titre}>
      <div ref={shardsRef} className="pointer-events-none absolute inset-0 z-30" style={{ perspective: 1000 }}>
        {Array.from({ length: 24 }, (_, i) => <div key={i} className="absolute overflow-hidden bg-black" style={{ backfaceVisibility: "hidden" }} />)}
      </div>
      {/* Dim backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Matrix glitch scanlines overlay */}
      <div
        ref={glitchRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(250,37,22,0.08) 0px, rgba(250,37,22,0.08) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Expanding panel */}
      <div
        ref={panelRef}
        className="absolute inset-0 z-20 flex items-center justify-center p-6"
        style={{ willChange: "clip-path" }}
      >
        <div className="absolute inset-0 bg-[#080808]" />

        {/* Modal card — centered, capped size */}
        <div
          ref={cardRef}
          className="relative z-10 w-full max-w-5xl mx-auto max-h-[90dvh] overflow-y-auto"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-black shadow-[0_40px_140px_rgba(0,0,0,0.9)]">

            {/* ── Image carousel ──────────────────────────────────── */}
            <div ref={imageRegionRef} className="relative bg-black" style={{ aspectRatio: "16/9" }}>

              {/* Slides container */}
              <div ref={carouselRef} className="absolute inset-0">
                {images.map((src, i) => (
                  <div key={i} className="absolute inset-0">
                    <Image
                      src={src}
                      alt={`${project.titre} - screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-contain"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Gradient bottom fade */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToSlide(currentIdx - 1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:border-ember-400/80 hover:text-ember-300 transition-colors"
                    aria-label="Image précédente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToSlide(currentIdx + 1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:border-ember-400/80 hover:text-ember-300 transition-colors"
                    aria-label="Image suivante"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${i === currentIdx
                          ? "bg-ember-400 scale-125"
                          : "bg-white/40 hover:bg-white/70"
                          }`}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white hover:border-ember-400/80 hover:text-ember-300 transition-colors"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
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
                      className="rounded-full bg-ember-500/10 border border-ember-400/40 text-ember-100 px-3 py-1"
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

