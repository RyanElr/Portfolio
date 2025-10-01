import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatrixRain from "@/components/MatrixRain";
import ProjectsGrid from "@/components/ProjectsGrid";
import projects from "@/data/projects.json";

export default function ProjectsPage() {
  return (
    <div className="font-sans min-h-dvh relative">
      {/* Fond Matrix plein écran */}
      <div className="hidden sm:block fixed inset-0 -z-10 opacity-25 pointer-events-none">
        <MatrixRain />
      </div>

      <Header />

      <main className="relative mx-auto max-w-5xl px-4 py-12 pb-20 sm:pb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Projets</h1>
        <div className="mt-6">
          <ProjectsGrid projects={projects} />
        </div>
      </main>
    </div>
  );
}
