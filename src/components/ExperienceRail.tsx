"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ExperienceRail.module.css";

const pieces = Array.from({ length: 34 }, (_, i) => {
  const angle = i * 2.39996;
  const distance = 75 + (i % 7) * 19;
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotation: (i % 2 ? 1 : -1) * (220 + i * 31) };
});

export default function ExperienceRail() {
  const rail = useRef<HTMLDivElement>(null);
  const traveler = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const fragments = useRef<HTMLDivElement>(null);
  const shockwave = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = -1;
    let exploded = false;
    let explosion: gsap.core.Timeline | null = null;
    const reset = () => {
      explosion?.kill();
      explosion = null;
      exploded = false;
      gsap.set(body.current, { opacity: 1, scale: 1, rotation: 0 });
      gsap.set(shockwave.current, { opacity: 0, scale: 0 });
      if (fragments.current) gsap.set(fragments.current.children, { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0 });
    };
    const render = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // The character follows a reading line through the experience cards.
      const distance = Math.max(1, rect.height - 32);
      const progress = gsap.utils.clamp(0, 1, (window.innerHeight * 0.63 - rect.top) / distance);
      if (progress === previous) return;
      previous = progress;
      gsap.set(traveler.current, { y: progress * distance });
      gsap.set(fill.current, { scaleY: progress });
      if (progress < 0.88 || motion.matches) {
        if (exploded) reset();
      } else if (progress >= 0.97 && !exploded && !motion.matches) {
        exploded = true;
        const nodes = fragments.current?.children;
        const timeline = gsap.timeline();
        explosion = timeline;
        timeline.to(body.current, { scale: 1.35, duration: 0.13, ease: "power2.in" }, 0);
        timeline.to(body.current, { opacity: 0, scale: 0.15, rotation: 130, duration: 0.12 }, 0.13);
        timeline.fromTo(shockwave.current, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 5, duration: 0.55, ease: "power2.out" }, 0.13);
        if (nodes) Array.from(nodes).forEach((fragment, i) => {
          const piece = pieces[i];
          const start = 0.13 + (i % 4) * 0.012;
          const spread = window.innerWidth < 640 ? 0.65 : 1;
          timeline.set(fragment, { opacity: 1, scale: 1.15, x: 0, y: 0 }, start);
          timeline.to(fragment, {
            x: piece.x * spread, y: piece.y * spread,
            rotation: piece.rotation, rotationX: (i % 2 ? 1 : -1) * 160,
            rotationY: (i % 3 - 1) * 220,
            duration: 0.6, ease: "power3.out",
          }, start);
          timeline.to(fragment, { y: piece.y * spread + 65, duration: 0.65, ease: "power2.in" }, start + 0.6);
          timeline.to(fragment, { opacity: 0, scale: 0, duration: 0.65, ease: "power2.in" }, start + 0.6);
        });
      }
      node.style.setProperty("--jaw", `${motion.matches ? 20 : 12 + Math.abs(Math.sin(progress * 65)) * 26}deg`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const change = () => { previous = -1; schedule(); };
    const observer = new ResizeObserver(change);
    observer.observe(node);
    if (node.parentElement) observer.observe(node.parentElement);
    window.addEventListener("pageshow", change);
    document.fonts.ready.then(change);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", change);
    motion.addEventListener("change", change);
    render();
    return () => {
      cancelAnimationFrame(frame);
      explosion?.kill();
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", change);
      window.removeEventListener("pageshow", change);
      motion.removeEventListener("change", change);
    };
  }, []);

  return (
    <div ref={rail} className={styles["experience-rail"]} aria-hidden="true">
      <div className={styles["experience-rail-track"]} />
      <div ref={fill} className={styles["experience-rail-fill"]} />
      <div ref={traveler} className={styles["experience-traveler"]}>
        <div ref={body} className={styles["experience-pacman"]}>
          <span className={styles["pacman-half"] + " " + styles["pacman-left"]} />
          <span className={styles["pacman-half"] + " " + styles["pacman-right"]} />
          <span className={styles["pacman-eye"]} />
        </div>
        <span ref={shockwave} className={styles["pacman-shockwave"]} />
        <div ref={fragments} className={styles["pacman-fragments"]}>
          {pieces.map((_, i) => <span key={i} className={styles["pacman-fragment"]} style={{ width: 5 + i % 4, height: 5 + (i * 3) % 5, clipPath: i % 2 ? "polygon(0 0,100% 20%,60% 100%)" : "polygon(10% 0,100% 10%,80% 100%,0 70%)" }} />)}
      </div>
      </div>
      <span className={styles["experience-rail-end"]} />
    </div>
  );
}
