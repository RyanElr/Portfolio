 "use client";

import { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";

import GsapReveal from "@/components/GsapReveal";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current || status === "sending") return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS env vars manquantes.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

      setStatus("sent");
      formRef.current.reset();

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { scale: 1, boxShadow: "0 30px 120px rgba(0,0,0,0.85)" },
          {
            scale: 1.02,
            boxShadow: "0 40px 140px rgba(234,179,8,0.55)",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          }
        );
      }

      if (fireworksRef.current) {
        const container = fireworksRef.current;
        container.innerHTML = "";

        const particles: HTMLSpanElement[] = [];
        for (let i = 0; i < 10; i++) {
          const dot = document.createElement("span");
          dot.className = "absolute h-1.5 w-1.5 rounded-full bg-amber-400";
          container.appendChild(dot);
          particles.push(dot);
        }

        particles.forEach((dot) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 40 + Math.random() * 40;
          gsap.fromTo(
            dot,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.3,
              duration: 0.6 + Math.random() * 0.4,
              ease: "power2.out",
              onComplete: () => {
                dot.remove();
              },
            }
          );
        });
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="min-h-[calc(100dvh-72px)] lg:min-h-[calc(100dvh-96px)] flex flex-col items-start justify-center pt-16 lg:pt-20">
      <GsapReveal>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Contact
        </h2>
        <p className="mt-3 text-sm text-foreground/80 max-w-md">
          Un projet, une idée, ou juste envie de discuter technique ?
          Envoie‑moi un message, je reviens vers toi rapidement.
        </p>
      </GsapReveal>

      <div className="mt-8 w-full max-w-xl">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/85 to-black/90 shadow-[0_30px_120px_rgba(0,0,0,0.85)] px-5 py-6 sm:px-7 sm:py-7"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-400/25 via-transparent to-transparent" />

          <div
            ref={fireworksRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          />

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-foreground/65 mb-1">
                  Nom
                </label>
                <input
                  name="user_name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                  placeholder="Ton nom"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/65 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                  placeholder="tu@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/65 mb-1">
                Sujet
              </label>
              <input
                name="subject"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                placeholder="Parlons de ton projet"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/65 mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60 resize-none"
                placeholder="Donne-moi quelques détails : objectifs, délais, budget…"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_30px_rgba(234,179,8,0.55)] hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.7)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Envoi..." : "Envoyer"}
              </button>

              <p className="text-xs text-foreground/55">
                Ou écris‑moi directement :{" "}
                <a href="mailto:ryan.elr@outlook.com" className="underline">
                  ryan.elr@outlook.com
                </a>
              </p>
            </div>

            {status === "sent" && (
              <p className="text-xs text-emerald-400 pt-1">
                Message bien envoyé, merci !
              </p>
            )}
            {status === "error" && (
              <p className="text-xs text-red-400 pt-1">
                Impossible d&apos;envoyer pour l&apos;instant. Vérifie la config EmailJS.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

