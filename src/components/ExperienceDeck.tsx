"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ExperienceCard, { type Experience } from "@/components/ExperienceCard";
import ExperienceTilt from "@/components/ExperienceTilt";
import WarpField from "@/components/WarpField";
import styles from "./ExperienceDeck.module.css";

// Share of each scroll segment where the card rests before the next one flies in.
const HOLD = 0.22;
// Space kept free for the HUD: counter above the cards, progress steps below.
const HUD_TOP = 180;
const HUD_BOTTOM = 70;

// Turns linear scroll into "rest, fly, rest" so each card stays readable.
function settle(raw: number, count: number) {
  const segment = Math.min(count - 1, Math.floor(raw));
  if (segment >= count - 1) return count - 1;
  const t = Math.max(0, Math.min(1, (raw - segment - HOLD) / (1 - 2 * HOLD)));
  return segment + t * t * (3 - 2 * t);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function ExperienceDeck({ experiences }: { experiences: Experience[] }) {
  const count = experiences.length;
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const grid = useRef<HTMLDivElement>(null);
  const speed = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const outer = track.current;
    const scene = stage.current;
    if (!outer || !scene) return;
    let frame = 0;
    let last = 0;
    let current = -1;
    let shown = 0;
    let fit = 1;
    let visible = false;

    const measure = () => {
      const tallest = Math.max(...cards.current.map((card) => card?.offsetHeight ?? 0));
      fit = Math.min(1, (scene.clientHeight - HUD_TOP - HUD_BOTTOM) / Math.max(1, tallest));
    };

    const target = () => {
      const rect = outer.getBoundingClientRect();
      const distance = Math.max(1, outer.offsetHeight - window.innerHeight);
      return settle(Math.max(0, Math.min(1, -rect.top / distance)) * (count - 1), count);
    };

    const render = (now: number) => {
      const goal = target();
      if (current < 0) current = goal;
      const frames = last ? Math.min(4, (now - last) / 16.67) : 1;
      last = now;
      const previous = current;
      current += (goal - current) * (1 - Math.pow(1 - 0.1, frames));
      if (Math.abs(goal - current) < 0.0005) current = goal;
      speed.current = Math.min(1, Math.abs(current - previous) * 22 / Math.max(frames, 0.25));

      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = i - current;
        const side = i % 2 ? 1 : -1;
        let transform: string;
        let opacity: number;
        let filter = "none";
        if (d >= 0) {
          // Waiting cards recede into the scene, fanned to alternating sides.
          transform = `translate3d(${side * d * 140}px, ${-d * 60}px, ${-d * 560}px) rotateX(${d * 12}deg) rotateY(${-side * d * 18}deg)`;
          opacity = Math.max(0, 1 - d * 0.42);
          if (d > 0.02) filter = `brightness(${Math.max(0.35, 1 - d * 0.4).toFixed(3)})`;
        } else {
          // Read cards rush past the camera, tumbling down and away.
          const k = -d;
          transform = `translate3d(${side * k * 90}px, ${k * 220}px, ${k * 820}px) rotateX(${-k * 48}deg) rotateZ(${side * k * 10}deg)`;
          opacity = Math.max(0, 1 - k * 1.6);
          filter = `blur(${(k * 10).toFixed(2)}px)`;
        }
        card.style.transform = `translate(-50%, -50%) ${transform} scale(${fit.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = filter;
        card.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
        card.style.pointerEvents = Math.abs(d) < 0.4 ? "auto" : "none";
      });

      grid.current?.style.setProperty("--grid-shift", `${(current * 420).toFixed(1)}px`);
      const index = Math.round(current);
      if (index !== shown) { shown = index; setActive(index); }

      const moving = current !== goal || speed.current > 0.001;
      if (!moving) speed.current = 0;
      frame = visible && moving ? requestAnimationFrame(render) : 0;
      if (!frame) last = 0;
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const resize = () => { measure(); schedule(); };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    seen.observe(outer);
    const sizes = new ResizeObserver(resize);
    sizes.observe(scene);
    cards.current.forEach((card) => card && sizes.observe(card));
    window.addEventListener("scroll", schedule, { passive: true });
    measure();
    visible = true;
    // Lay the deck out before the first paint instead of waiting a frame.
    render(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      sizes.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, [count]);

  const current = experiences[active];

  return (
    <div
      ref={track}
      className={styles.track}
      style={{ height: `${count * 100}dvh`, "--hud-top": `${HUD_TOP}px`, "--hud-bottom": `${HUD_BOTTOM}px` } as CSSProperties}
    >
      <div ref={stage} className={styles.stage}>
        <WarpField speed={speed} />
        <div ref={grid} className={styles.grid} aria-hidden="true" />

        <div className={styles.hud} aria-hidden="true">
          <div className={styles.counter}>
            <span key={active} className={styles.index}>{pad(active + 1)}</span>
            <span className={styles.total}>/ {pad(count)}</span>
          </div>
          <span key={current.id} className={styles.company}>{current.entreprise}</span>
        </div>

        <div className={styles.scene}>
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              ref={(node) => { cards.current[i] = node; }}
              className={styles.card}
            >
              <ExperienceTilt>
                <ExperienceCard exp={exp} />
              </ExperienceTilt>
            </div>
          ))}
        </div>

        <div className={styles.progress} aria-hidden="true">
          {experiences.map((exp, i) => (
            <span key={exp.id} className={i <= active ? styles.stepOn : styles.step} />
          ))}
        </div>
        <span className={styles.hint} data-hidden={active === count - 1} aria-hidden="true">Défiler</span>
      </div>
    </div>
  );
}
