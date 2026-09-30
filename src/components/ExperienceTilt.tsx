"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

export default function ExperienceTilt({ children }: { children: ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const allowed = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      allowed.current = query.matches;
      if (!query.matches) {
        cancelAnimationFrame(frame.current);
        surface.current?.removeAttribute("style");
      }
    };
    update();
    query.addEventListener("change", update);
    return () => { query.removeEventListener("change", update); cancelAnimationFrame(frame.current); };
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!allowed.current || event.pointerType === "touch") return;
    // Measure the stationary wrapper, never the tilted card.
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const card = surface.current;
      if (!card) return;
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
      card.style.setProperty("--light-x", `${x * 100}%`);
      card.style.setProperty("--light-y", `${y * 100}%`);
      card.style.setProperty("--lift", "-5px");
      card.style.setProperty("--shine", "1");
    });
  };
  const reset = () => {
    cancelAnimationFrame(frame.current);
    surface.current?.removeAttribute("style");
  };
  return (
    <div className="experience-perspective" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <div ref={surface} className="experience-tilt">{children}</div>
    </div>
  );
}
