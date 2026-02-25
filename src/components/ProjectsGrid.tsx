"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import getLogoSrc from "@/app/utils/fonction";

export type Project = {
  id: string;
  titre: string;
  sousTitre?: string;
  description?: string;
  logo?: string;
  image?: string;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
  const titleRef = useRef<HTMLDivElement | null>(null);
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

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
      );
    }
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
      className="group relative overflow-hidden rounded-xl border border-white/15 bg-black/60 backdrop-blur-md transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.65)] cursor-pointer"
      onMouseEnter={startLoading}
      onMouseLeave={stopLoading}
    >
      <div className="relative aspect-video">
        {project.image ? (
          <img
            src={getLogoSrc(project.image, "=w1600")}
            alt={project.titre}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-foreground/40">
            Aucune image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div ref={titleRef} className="mb-2">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight">
              {project.titre}
            </h3>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              ref={barRef}
              className="h-full w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 scale-x-0 origin-left"
            />
          </div>
          <div className="mt-1 text-[11px] text-amber-200/90 text-right">
            {percent}%
          </div>
        </div>
      </div>
    </article>
  );
}
