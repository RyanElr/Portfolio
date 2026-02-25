"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Desktop-only Matrix rain effect rendered to a canvas. */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = (katakana + latin + nums).split("");

    const fontSize = 16; // px
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));

    let lastTime = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;

    // >>> teinte globale jaune moutarde
    const tint = getTint(pathname);

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (time - lastTime < frameInterval) return;
      lastTime = time;

      // trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = tint;

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafRef.current = requestAnimationFrame(draw);

    stopRef.current = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };

    return () => {
      stopRef.current?.();
    };
  }, [pathname]); // <- change la couleur quand la route change

  return <canvas ref={canvasRef} className="block w-full h-full" aria-hidden />;
}

function getTint(pathname: string) {
  // jaune moutarde #eab308
  return "rgba(234, 179, 8, 0.9)";
}
