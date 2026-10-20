"use client";

export type Experience = {
  id: string;
  poste: string;
  entreprise: string;
  logo?: string;
  debut: string;
  fin: string;
  missions: string[];
  tech: string[];
};

export default function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <article className="experience-card group">
      {/* Thickness and ground shadow sit behind the face in 3D space */}
      <div className="experience-card-shadow" aria-hidden="true" />
      <div className="experience-card-edge" aria-hidden="true" />
      <div className="experience-card-face" aria-hidden="true" />

      <div className="experience-card-content p-5 sm:p-6">
        {/* Header row */}
        <div className="experience-depth-high flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full accent-relief-badge bg-ember-400/10 border border-ember-400/25 px-2.5 py-0.5 text-[10px] font-medium text-ember-300 tracking-wide uppercase">
                {exp.entreprise}
              </span>
              <span className="text-[10px] text-foreground/40 font-mono">
                {formatDate(exp.debut)} → {formatDate(exp.fin)}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-white/95">
              {exp.poste}
            </h3>
          </div>
        </div>

        {/* Missions */}
        <ul className="experience-depth-low mt-4 space-y-2">
          {exp.missions.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-ember-400/60 flex-shrink-0" />
              {m}
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="experience-depth-mid mt-4 flex flex-wrap gap-1.5">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] rounded-lg px-2.5 py-1 bg-white/5 border border-white/8 text-foreground/60
                         transition-all duration-200 hover:border-ember-400/30 hover:text-ember-200 hover:bg-ember-400/5 cursor-default"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function formatDate(value: string) {
  if (!value) return "";
  if (value.toLowerCase() === "aujourd'hui") return "Aujourd'hui";
  const [y, m] = value.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
  });
}
