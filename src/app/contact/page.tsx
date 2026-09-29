import ContactSection from "@/components/sections/ContactSection";
import Header from "@/components/Header";
import MatrixRain from "@/components/MatrixRain";

export default function ContactPage() {
  return (
    <div className="font-sans min-h-dvh relative">
      {/* Fond Matrix plein écran */}
      <div className="hidden sm:block fixed inset-0 -z-10 opacity-25 pointer-events-none">
        <MatrixRain />
      </div>

      <Header />

      <main className="relative mx-auto max-w-5xl px-4 py-12 pb-20 sm:pb-12">
        <ContactSection />
      </main>
    </div>
  );
}
