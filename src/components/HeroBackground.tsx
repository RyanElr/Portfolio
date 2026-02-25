 "use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import MatrixRain from "@/components/MatrixRain";
import HeroCanvas from "@/components/HeroCanvas";

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !blobRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.to(blobRef.current, {
        scale: 1.05,
        yPercent: -4,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden sm:block absolute inset-0 z-0 opacity-0 pointer-events-none"
    >
      <div className="absolute inset-0 mix-blend-screen">
        <MatrixRain />
      </div>

      <div
        ref={blobRef}
        className="absolute inset-0"
      >
        <div className="absolute -inset-x-[20%] -top-40 h-[60vh] bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.45),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.35),_transparent_55%)] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2">
          <HeroCanvas className="w-full h-full rounded-full overflow-hidden border border-white/10 bg-black/60/60 shadow-[0_40px_140px_rgba(0,0,0,0.9)]" />
        </div>
      </div>
    </div>
  );
}

