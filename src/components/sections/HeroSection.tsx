import HeroSpecialties from "@/components/HeroSpecialties";
import GsapReveal from "@/components/GsapReveal";

export default function HeroSection() {
  return (
    <section className="relative flex items-center pt-24 min-h-dvh pb-32">
      <div className="absolute -inset-x-24 -top-40 h-72 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.3),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_55%)] opacity-70 blur-3xl -z-10" />

      <GsapReveal y={60} className="max-w-2xl relative z-10">
        <p className="text-sm font-medium tracking-[0.22em] uppercase text-ember-400/80">
          Portfolio • Next.js • Three.js • GSAP
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
          Ryan, développeur{" "}
          <span className="accent-relief-text">Full‑stack</span>{" "}
          qui aime les interfaces vivantes.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-foreground/80 max-w-xl">
          Je conçois et développe des expériences web rapides, propres et animées.
        </p>
        <HeroSpecialties />
      </GsapReveal>

      <p className="absolute bottom-20 md:bottom-10 left-0 text-xs uppercase tracking-[0.22em] text-white/50">Défile pour explorer <span className="ml-3 text-ember-400">↓</span></p>
    </section>
  );
}
