"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Desktop-only Matrix rain effect rendered to a canvas.
 *  Mouse repulsion: columns within `REPEL_RADIUS` pixels of the cursor freeze.
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const katakana =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = (katakana + latin + nums).split("");

    const fontSize = 16; // px
    const REPEL_RADIUS = 120; // px around cursor that freezes columns

    let columns = Math.floor(width / fontSize);
    let drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));

    let lastTime = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;

    const tint = getTint(pathname);

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (time - lastTime < frameInterval) return;
      lastTime = time;

      // Trail / fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      const mouse = mouseRef.current;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const dropY = drops[i] * fontSize;

        // Check if this column is inside the repulsion radius
        let frozen = false;
        if (mouse) {
          // Distance from column centre to mouse
          const dx = x + fontSize / 2 - mouse.x;
          // We use the current drop Y for vertical distance
          const dy = dropY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS) {
            frozen = true;
          }
        }

        if (!frozen) {
          // Bright head character
          const text = alphabet[Math.floor(Math.random() * alphabet.length)];
          ctx.fillStyle = "#ffffff"; // white head
          ctx.fillText(text, x, dropY);

          // Slightly dimmer body colour
          ctx.fillStyle = tint;
          const bodyText = alphabet[Math.floor(Math.random() * alphabet.length)];
          ctx.fillText(bodyText, x, dropY + fontSize);

          if (dropY > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        // When frozen we simply skip advancing — column pauses in place
      }
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    // Track the mouse position relative to the canvas
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [pathname]);

  return <canvas ref={canvasRef} className="block w-full h-full" aria-hidden />;
}

function getTint(_pathname: string) {
  // jaune moutarde #eab308
  return "rgba(234, 179, 8, 0.9)";
}
