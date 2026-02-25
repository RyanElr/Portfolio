 "use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GsapRevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export default function GsapReveal({
  children,
  delay = 0,
  y = 40,
  className,
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, scale: 0.96, skewY: 3 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          skewY: 0,
          duration: 1.1,
          ease: "power4.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

