import ExperienceList from "@/components/ExperienceList";
import experiences from "@/data/experiences.json";
import GsapReveal from "@/components/GsapReveal";

export default function ExperiencesSection() {
  return (
    <section className="min-h-[calc(100dvh-72px)] lg:min-h-[calc(100dvh-96px)] flex flex-col pt-16 lg:pt-20">
      <GsapReveal>
        <header className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Expériences
          </h2>
          <p className="mt-2 text-sm text-foreground/75 max-w-xl">
            De freelance à développeur full‑stack en startup, j’ai surtout travaillé
            sur des interfaces complexes, des APIs et de la mise en production.
          </p>
        </header>
      </GsapReveal>

      <div className="flex-1">
        <ExperienceList experiences={experiences} />
      </div>
    </section>
  );
}

