import getLogoSrc from "@/app/utils/fonction";

type Project = {
  id: string;
  titre: string;
  sousTitre?: string;
  description?: string;
  logo?: string;
  image?: string;
  tech?: string[];
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <article
          key={p.id}
          className="group overflow-hidden rounded-xl border border-white/15 bg-white/5 backdrop-blur-md"
        >
          <div className="relative aspect-video bg-black/40">
            {p.image ? (
              <img
                  src={getLogoSrc(p.image, "=w1600")}
                  alt={p.titre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />            ) : (
              <div className="h-full w-full flex items-center justify-center text-foreground/40">
                Aucune image
              </div>
            )}

          </div>
          <div className="p-4">
            <h3 className="text-base font-semibold tracking-tight group-hover:text-accent">
              {p.titre}
            </h3>
            {p.sousTitre && (
              <p className="text-sm text-foreground/70 mt-1">{p.sousTitre}</p>
            )}
            {p.tech && p.tech.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs rounded-full px-2 py-1 bg-[var(--accent)] text-white transition-transform duration-150 ease-out hover:scale-[1.05]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}


