"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

// Max rotation in degrees on each axis.
const TILT_X = 9;
const TILT_Y = 12;

export default function ExperienceTilt({ children }: { children: ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const allowed = useRef(false);
  // Eased values chase the pointer target so the card glides instead of snapping.
  const target = useRef({ x: 0.5, y: 0.5, active: 0 });
  const current = useRef({ x: 0.5, y: 0.5, active: 0 });
  const last = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      allowed.current = query.matches;
      if (!query.matches) {
        cancelAnimationFrame(frame.current);
        frame.current = 0;
        target.current = { x: 0.5, y: 0.5, active: 0 };
        current.current = { ...target.current };
        surface.current?.removeAttribute("style");
      }
    };
    update();
    query.addEventListener("change", update);
    return () => { query.removeEventListener("change", update); cancelAnimationFrame(frame.current); };
  }, []);

  const step = (now: number) => {
    const card = surface.current;
    const t = target.current;
    const c = current.current;
    // Scale easing by elapsed time so 60 Hz and 120 Hz screens feel the same.
    const frames = last.current ? Math.min(4, (now - last.current) / 16.67) : 1;
    last.current = now;
    const follow = 1 - Math.pow(1 - 0.14, frames);
    const fade = 1 - Math.pow(1 - 0.12, frames);
    c.x += (t.x - c.x) * follow;
    c.y += (t.y - c.y) * follow;
    c.active += (t.active - c.active) * fade;
    if (card) {
      card.style.setProperty("--tilt-x", `${((0.5 - c.y) * 2 * TILT_X * c.active).toFixed(3)}deg`);
      card.style.setProperty("--tilt-y", `${((c.x - 0.5) * 2 * TILT_Y * c.active).toFixed(3)}deg`);
      card.style.setProperty("--light-x", `${(c.x * 100).toFixed(2)}%`);
      card.style.setProperty("--light-y", `${(c.y * 100).toFixed(2)}%`);
      card.style.setProperty("--lift", `${(-8 * c.active).toFixed(2)}px`);
      card.style.setProperty("--shine", c.active.toFixed(3));
    }
    const settled = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) + Math.abs(t.active - c.active) < 0.001;
    if (settled) last.current = 0;
    if (settled && t.active === 0) {
      frame.current = 0;
      card?.removeAttribute("style");
      return;
    }
    frame.current = settled ? 0 : requestAnimationFrame(step);
  };
  const run = () => { if (!frame.current) frame.current = requestAnimationFrame(step); };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!allowed.current || event.pointerType === "touch") return;
    // Measure the stationary wrapper, never the tilted card.
    const bounds = event.currentTarget.getBoundingClientRect();
    target.current = {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
      active: 1,
    };
    run();
  };
  const reset = () => {
    if (!allowed.current) return;
    target.current = { x: 0.5, y: 0.5, active: 0 };
    run();
  };
  return (
    <div className="experience-perspective" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <div ref={surface} className="experience-tilt">
        {children}
        <span className="experience-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
