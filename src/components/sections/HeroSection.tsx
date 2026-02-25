import HeroCanvas from "@/components/HeroCanvas";
import GsapReveal from "@/components/GsapReveal";

export default function HeroSection() {
  return (
    <section className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center pt-16 lg:pt-24 h-[calc(100dvh-72px)] lg:h-[calc(100dvh-96px)]">
      <div className="absolute -inset-x-24 -top-40 h-72 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.3),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_55%)] opacity-70 blur-3xl -z-10" />

      <GsapReveal y={60}>
        <p className="text-sm font-medium tracking-[0.22em] uppercase text-orange-400/80">
          Portfolio • Next.js • Three.js
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
          Ryan, développeur{" "}
          <span className="text-orange-400">Full‑stack</span>{" "}
          qui aime les interfaces vivantes.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-foreground/80 max-w-xl">
          Je conçois et développe des expériences web rapides, propres et animées.
          Next.js, TypeScript, Three.js & GSAP sont mes outils du quotidien.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(249,115,22,0.45)]">
            Interfaces 3D & animations
          </span>
          <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-foreground/90">
            Front & back modernes
          </span>
        </div>
      </GsapReveal>

      <GsapReveal delay={0.1} y={80} className="order-first lg:order-none">
        <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-orange-500/35 via-transparent to-transparent opacity-80" />
          <HeroCanvas className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.4),_transparent_55%)] mix-blend-screen" />
        </div>
      </GsapReveal>
    </section>
  );
}

