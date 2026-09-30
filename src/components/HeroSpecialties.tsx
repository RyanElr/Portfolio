"use client";

import type { PointerEvent } from "react";
import styles from "./HeroSpecialties.module.css";

export default function HeroSpecialties() {
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--rx", `${(0.5 - (event.clientY-rect.top)/rect.height)*14}deg`);
    event.currentTarget.style.setProperty("--ry", `${((event.clientX-rect.left)/rect.width-0.5)*18}deg`);
  };
  return <div className={styles.row}>
    {[{ title: "Interfaces 3D", subtitle: "& animations", icon: "◇" }, { title: "Front & back", subtitle: "modernes", icon: "</>" }].map((item,i)=><div key={item.title} className={styles.stage} onPointerMove={tilt} onPointerLeave={e=>{e.currentTarget.style.removeProperty("--rx");e.currentTarget.style.removeProperty("--ry");}}>
      <div className={`${styles.plaque} ${i ? styles.dark : ""}`}>
        <span className={styles.edge} aria-hidden="true" />
        <span className={styles.icon} aria-hidden="true">{item.icon}</span>
        <span className={styles.copy}><strong>{item.title}</strong><span>{item.subtitle}</span></span>
        <span className={styles.reflection} aria-hidden="true" />
      </div>
    </div>)}
  </div>;
}
