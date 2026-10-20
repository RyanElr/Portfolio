"use client";

import { useEffect, useRef, type RefObject } from "react";

const STARS = 260;

type Star = { x: number; y: number; z: number };

const spawn = (star: Star, far = true) => {
  star.x = (Math.random() - 0.5) * 2;
  star.y = (Math.random() - 0.5) * 2;
  star.z = far ? 0.6 + Math.random() * 0.4 : 0.05 + Math.random() * 0.95;
};

// Ember starfield flying toward the viewer; `speed` (0..1) stretches stars into warp streaks.
export default function WarpField({ speed }: { speed: RefObject<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext("2d");
    if (!node || !context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stars: Star[] = Array.from({ length: STARS }, () => {
      const star = { x: 0, y: 0, z: 0 };
      spawn(star, false);
      return star;
    });
    let frame = 0;
    let last = 0;
    let boost = 0;
    let visible = false;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = node.clientWidth;
      height = node.clientHeight;
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const frames = last ? Math.min(4, (now - last) / 16.67) : 1;
      last = now;
      // Ease toward the scroll speed so streaks stretch and relax smoothly.
      boost += ((speed.current ?? 0) - boost) * (1 - Math.pow(0.88, frames));
      const still = motion.matches;
      const step = still ? 0 : (0.0018 + boost * 0.045) * frames;
      const focal = Math.min(width, height) * 0.55;
      const cx = width / 2;
      const cy = height * 0.45;
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      for (const star of stars) {
        const tail = star.z + step * (2 + boost * 10);
        star.z -= step;
        const sx = cx + (star.x / star.z) * focal;
        const sy = cy + (star.y / star.z) * focal;
        if (star.z <= 0.02 || sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
          spawn(star);
          continue;
        }
        const tx = cx + (star.x / tail) * focal;
        const ty = cy + (star.y / tail) * focal;
        const near = 1 - star.z;
        const alpha = Math.min(1, near * near * 1.4);
        context.strokeStyle = star.z < 0.25 ? `rgba(255, 214, 200, ${alpha})` : `rgba(255, 81, 64, ${alpha})`;
        context.lineWidth = 0.6 + near * 1.8;
        context.beginPath();
        context.moveTo(tx, ty);
        context.lineTo(sx + 0.01, sy);
        context.stroke();
      }
      frame = visible && !still ? requestAnimationFrame(draw) : 0;
      if (!frame) last = 0;
    };

    const start = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    const sizes = new ResizeObserver(() => { resize(); start(); });
    seen.observe(node);
    sizes.observe(node);
    motion.addEventListener("change", start);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      sizes.disconnect();
      motion.removeEventListener("change", start);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_50%_45%,#000_35%,transparent_75%)]"
    />
  );
}
