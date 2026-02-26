"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

import getLogoSrc from "@/app/utils/fonction";

export type Project = {
  id: string;
  titre: string;
  sousTitre?: string;
  description?: string;
  logo?: string;
  image?: string;
  images?: string[];
  tech?: string[];
};

export default function ProjectsGrid({
  projects,
  onRevealProject,
}: {
  projects: Project[];
  onRevealProject?: (project: Project, originRect: DOMRect) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
      {projects.map((p) => (
        <ProjectTile
          key={p.id}
          project={p}
          onReveal={onRevealProject}
        />
      ))}
    </div>
  );
}

function ProjectTile({
  project,
  onReveal,
}: {
  project: Project;
  onReveal?: (project: Project, originRect: DOMRect) => void;
}) {
  const [percent, setPercent] = useState(0);
  const articleRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => { tweenRef.current?.kill(); };
  }, []);

  const startLoading = () => {
    if (!barRef.current) return;

    tweenRef.current?.kill();
    const progress = { value: 0 };
    setPercent(0);
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" });

    tweenRef.current = gsap.to(progress, {
      value: 100,
      duration: 2,
      ease: "none",
      onUpdate: () => {
        setPercent(Math.round(progress.value));
        if (barRef.current) {
          gsap.set(barRef.current, { scaleX: progress.value / 100 });
        }
      },
      onComplete: () => {
        setPercent(100);
        if (articleRef.current && onReveal) {
          onReveal(project, articleRef.current.getBoundingClientRect());
        }
      },
    });
  };

  const stopLoading = () => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    setPercent(0);
    if (barRef.current) {
      gsap.to(barRef.current, {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <article
      ref={articleRef}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-pointer"
      onMouseEnter={startLoading}
      onMouseLeave={stopLoading}
    >
      {/* Image only */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {project.image ? (
          <Image
            src={getLogoSrc(project.image, "=w1600")}
            alt={project.titre}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-foreground/30 text-sm">
            Aucune image
          </div>
        )}

        {/* Dark gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Loading bar overlay (on hover) */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              ref={barRef}
              className="h-full w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 scale-x-0 origin-left"
            />
          </div>
          <div className="mt-1 text-[10px] text-amber-200/80 text-right font-mono">
            {percent}%
          </div>
        </div>
      </div>
    </article>
  );
}
