 "use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import ProjectsGrid, { Project } from "@/components/ProjectsGrid";
import projects from "@/data/projects.json";
import GsapReveal from "@/components/GsapReveal";

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current || !activeProject) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: "power2.out" }
    ).fromTo(
      panelRef.current,
      { y: 40, scale: 0.85, autoAlpha: 0 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power4.out",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [activeProject]);

  return (
    <section className="min-h-[calc(100dvh-72px)] lg:min-h-[calc(100dvh-96px)] flex flex-col pt-16 lg:pt-20">
      <GsapReveal>
        <header className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Projets
          </h2>
          <p className="mt-2 text-sm text-foreground/75 max-w-xl">
            Une sélection de projets perso et pro autour du web moderne,
            des APIs et d’interfaces animées.
          </p>
        </header>
      </GsapReveal>

      <div className="mt-6 flex-1">
        <ProjectsGrid
          projects={projects}
          onRevealProject={setActiveProject}
        />
      </div>

      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          overlayRef={overlayRef}
          panelRef={panelRef}
        />
      )}
    </section>
  );
}

function ProjectDetailModal({
  project,
  onClose,
  overlayRef,
  panelRef,
}: {
  project: Project;
  onClose: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
  panelRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          ref={panelRef}
          className="relative max-w-3xl w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/95 shadow-[0_40px_140px_rgba(0,0,0,0.9)]"
        >
          <div className="relative aspect-video bg-black/40">
            {project.image && (
              <img
                src={project.image}
                alt={project.titre}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <div className="relative p-5 sm:p-6 space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">
              {project.titre}
            </h3>
            {project.sousTitre && (
              <p className="text-sm text-foreground/80">
                {project.sousTitre}
              </p>
            )}

            {project.tech && project.tech.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
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

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-foreground/80 hover:border-amber-400/80 hover:text-amber-200 transition-colors duration-150"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

