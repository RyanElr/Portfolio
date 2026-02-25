import Header from "@/components/Header";
import MatrixRain from "@/components/MatrixRain";
import ExperienceList from "@/components/ExperienceList";
import experiences from "@/data/experiences.json";

export default function ExperiencesPage() {
  return (
    <div className="font-sans min-h-dvh relative">
      {/* Fond Matrix sur tout le viewport, derrière tout */}
      <div className="hidden sm:block fixed inset-0 -z-10 opacity-25 pointer-events-none">
        <MatrixRain />
      </div>
      <Header />
      <main className="relative mx-auto max-w-5xl px-4 py-12 pb-20 sm:pb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Expériences</h1>
        <div className="mt-6">
          <ExperienceList experiences={experiences} />
        </div>
      </main>
    </div>
  );
}
