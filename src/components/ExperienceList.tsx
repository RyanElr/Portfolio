"use client";

import ExperienceRail from "@/components/ExperienceRail";
import ExperienceTilt from "@/components/ExperienceTilt";
import GsapReveal from "@/components/GsapReveal";

type Experience = {
  id: string;
  poste: string;
  entreprise: string;
  logo?: string;
  debut: string;
  fin: string;
  missions: string[];
  tech: string[];
};

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      <ExperienceRail />

      <ul className="relative space-y-5 pl-12 sm:pl-16">
        {experiences.map((exp, index) => (
          <li key={exp.id} className="relative">
            {/* Timeline dot */}
            <GsapReveal delay={index * 0.12} y={30}>
              {/* Card */}
              <ExperienceTilt>
              <div
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_40px_rgba(0,0,0,0.5)]
                           transition-all duration-300 ease-out hover:border-ember-400/20 hover:shadow-[0_20px_60px_rgba(250,37,22,0.08)]"
              >
                {/* Top glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ember-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-5 sm:p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
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
                  <ul className="mt-4 space-y-2">
                    {exp.missions.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-ember-400/60 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
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
              </div>
              </ExperienceTilt>
            </GsapReveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "";
  if (value.toLowerCase() === "aujourd'hui") return "Aujourd'hui";
  const [y, m] = value.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
  });
}
