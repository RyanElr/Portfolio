import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatrixRain from "@/components/MatrixRain";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-black relative isolate">
      {/* Fond Matrix sur toute la page, derrière le contenu mais au-dessus du fond */}
      <div className="hidden sm:block absolute inset-0 z-0 opacity-[0.35] mix-blend-screen pointer-events-none">
        <MatrixRain />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-none pb-24 pb-safe sm:pb-0">
        {/* Hero only with animation */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          {/* Animated background gradient (full-bleed) */}
          <div className="absolute -inset-40 opacity-30 z-10">
            <div className="h-full w-[200%] bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.35),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.12),transparent_40%)] animate-gradient-pan" />
          </div>

          {/* Voile noir pour le contraste (au-dessus du Matrix, sous le contenu) */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="px-0 text-center">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight animate-fade-up">
                <HoverTitle text="Ryan • Développeur Full-stack" accentUntil={4} />
              </h1>
              <p className="mt-4 max-w-xl text-foreground/80 animate-fade-up animate-fade-up-delay-1">
                Next.js, TypeScript, Tailwind. J’aime construire des interfaces rapides et élégantes.
              </p>
              <div className="mt-6 flex justify-center gap-3 animate-fade-up animate-fade-up-delay-2">
                <a href="/projects" className="btn-accent rounded-md px-5 py-2 text-sm font-semibold hover:scale-[1.05] transition-transform duration-150 ease-out ">
                  Voir mes projets
                </a>
                <a href="/experiences" className="rounded-md px-5 py-2 text-sm font-semibold border border-accent hover:scale-[1.05] transition-transform duration-150 ease-out">
                  Mes expériences
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HoverTitle({ text, accentUntil = 0 }: { text: string; accentUntil?: number }) {
  return (
    <span className="inline-block">
      {Array.from(text).map((ch, i) => {
        const isAccent = i < accentUntil;
        const display = ch === " " ? "\u00A0" : ch;
        return (
          <span
            key={i}
            className={`${isAccent ? "text-accent" : ""} inline-block transition-transform duration-150 ease-out hover:scale-[1.15]`}
          >
            {display}
          </span>
        );
      })}
    </span>
  );
}
