import getLogoSrc from "@/app/utils/fonction";// components/ExperienceList.tsx
type Experience = {
  id: string;
  poste: string;
  entreprise: string;
  logo?: string;
  debut: string; // YYYY-MM
  fin: string;   // YYYY-MM | "Présent"
  missions: string[];
  tech: string[];
};

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <ul className="space-y-6">
      {experiences.map((exp) => (
        <li key={exp.id}>
          <div className="flex items-start gap-3">
            {exp.logo ? (
              <img
                src={getLogoSrc(exp.logo)}
                alt={exp.entreprise}
                className="h-12 w-12 shrink-0 rounded bg-black/60 object-contain p-1 border border-white/15 shadow"
                loading="lazy"
                decoding="async"
              />
            ) : null}

            {/* Card plus sombre */}
            <div
              className="group relative flex-1 overflow-hidden rounded-xl border border-white/5
                         bg-white/[0.02] supports-[backdrop-filter]:bg-white/[0.03] supports-[backdrop-filter]:backdrop-blur-sm
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_28px_rgba(0,0,0,0.45)]
                         transition-transform duration-200 ease-out hover:-translate-y-[2px]"
            >
              {/* voile vertical assombri */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent" />

              <div className="relative p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                    {exp.poste} · <span className="text-foreground/70">{exp.entreprise}</span>
                  </h3>
                  <span className="text-xs sm:text-sm text-foreground/60 whitespace-nowrap">
                    {formatDate(exp.debut)} – {formatDate(exp.fin)}
                  </span>
                </div>

                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-foreground/90">
                  {exp.missions.map((m, i) => <li key={i}>{m}</li>)}
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full px-2 py-1 bg-[var(--accent)] text-white/95
                                 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_6px_16px_rgba(0,0,0,0.4)]
                                 transition-transform duration-150 ease-out hover:scale-[1.05]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatDate(value: string) {
  if (!value) return "";
  if (value.toLowerCase() === "aujourd'hui") return "Aujourd'hui";
  const [y, m] = value.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });
}

/** Transforme automatiquement un lien Drive en lien direct image. */

