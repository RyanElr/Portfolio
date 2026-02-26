"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import gsap from "gsap";

import GsapReveal from "@/components/GsapReveal";

/* ── Zod schema ────────────────────────────────────────────────────────── */
const contactSchema = z.object({
  user_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(60, "Le nom est trop long (60 max).")
    .regex(/^[a-zA-ZÀ-ÿ\s\-'.]+$/, "Le nom contient des caractères invalides."),
  user_email: z
    .string()
    .email("L'adresse email n'est pas valide.")
    .max(120, "L'email est trop long."),
  subject: z
    .string()
    .min(3, "Le sujet doit contenir au moins 3 caractères.")
    .max(120, "Le sujet est trop long (120 max)."),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(2000, "Le message est trop long (2000 max)."),
  // Honeypot — if this field is filled, it's a bot
  _honey: z.string().max(0, "").optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ── Fake terminal lines ─────────────────────────────────────────────────── */
const TERMINAL_LINES = [
  "$ git clone ryan-elr/portfolio",
  "$ npm install",
  "$ npm run dev",
  "▶  Ready on http://localhost:3000",
  "$ curl -X POST /api/contact \\",
  '  -d \'{"message": "Bonjour !"}\'',
  "✔  Message envoyé.",
];

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [terminalText, setTerminalText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur", // validate on blur for a smooth UX
  });

  /* ── Typing effect in terminal ──────────────────────────────────────── */
  useEffect(() => {
    const full = TERMINAL_LINES.join("\n");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTerminalText(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalText]);

  /* ── Submit handler ─────────────────────────────────────────────────── */
  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check
    if (data._honey) return;
    if (status === "sending") return;

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
      await emailjs.send(serviceId, templateId, {
        user_name: data.user_name,
        user_email: data.user_email,
        subject: data.subject,
        message: data.message,
      }, publicKey);

      setStatus("sent");
      reset();

      // Success card pulse
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

      // Fireworks
      if (fireworksRef.current) {
        const container = fireworksRef.current;
        container.innerHTML = "";
        const particles: HTMLSpanElement[] = [];
        for (let i = 0; i < 14; i++) {
          const dot = document.createElement("span");
          dot.className = "absolute h-1.5 w-1.5 rounded-full bg-amber-400";
          container.appendChild(dot);
          particles.push(dot);
        }
        particles.forEach((dot) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 50 + Math.random() * 60;
          gsap.fromTo(
            dot,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.3,
              duration: 0.7 + Math.random() * 0.4,
              ease: "power2.out",
              onComplete: () => dot.remove(),
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
    <section className="min-h-[calc(100dvh-72px)] lg:min-h-[calc(100dvh-96px)] flex flex-col pt-10 lg:pt-12">
      <GsapReveal>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-3 text-sm text-foreground/80 max-w-md">
          Un projet, une idée, ou juste envie de discuter technique ?
          Envoie‑moi un message, je reviens vers toi rapidement.
        </p>
      </GsapReveal>

      {/* Two-column layout on desktop */}
      <div className="mt-6 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT — decorative panel */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* Fake terminal */}
          <div className="rounded-2xl border border-white/10 bg-black/70 overflow-hidden backdrop-blur-sm">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/8 bg-white/4">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-white/40 font-mono">zsh</span>
            </div>
            <div
              ref={terminalRef}
              className="p-4 font-mono text-xs text-green-400/90 leading-relaxed h-40 overflow-hidden whitespace-pre-wrap"
            >
              {terminalText}
              <span className="inline-block w-1.5 h-3.5 bg-green-400/80 ml-0.5 animate-pulse" />
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/RyanElr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 hover:border-amber-400/50 hover:bg-amber-500/6 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/60 group-hover:text-amber-300 transition-colors">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="text-sm text-white/70 group-hover:text-amber-200 transition-colors">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ryanelr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 hover:border-amber-400/50 hover:bg-amber-500/6 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/60 group-hover:text-amber-300 transition-colors">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm text-white/70 group-hover:text-amber-200 transition-colors">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* RIGHT — contact form */}
        <div>
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/85 to-black/90 shadow-[0_30px_120px_rgba(0,0,0,0.85)] px-5 py-6 sm:px-7 sm:py-7"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-400/25 via-transparent to-transparent" />

            <div
              ref={fireworksRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            />

            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="relative space-y-4" noValidate>
              {/* Honeypot — hidden from humans, visible to bots */}
              <input
                {...register("_honey")}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -top-[9999px] -left-[9999px] opacity-0 h-0 w-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground/65 mb-1">Nom</label>
                  <input
                    {...register("user_name")}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-white/5 transition-colors ${errors.user_name
                      ? "border-red-400/70 focus:border-red-400 focus:ring-1 focus:ring-red-400/50"
                      : "border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                      }`}
                    placeholder="Ton nom"
                  />
                  {errors.user_name && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.user_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/65 mb-1">Email</label>
                  <input
                    {...register("user_email")}
                    type="email"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-white/5 transition-colors ${errors.user_email
                      ? "border-red-400/70 focus:border-red-400 focus:ring-1 focus:ring-red-400/50"
                      : "border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                      }`}
                    placeholder="tu@exemple.com"
                  />
                  {errors.user_email && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.user_email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/65 mb-1">Sujet</label>
                <input
                  {...register("subject")}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-white/5 transition-colors ${errors.subject
                    ? "border-red-400/70 focus:border-red-400 focus:ring-1 focus:ring-red-400/50"
                    : "border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                    }`}
                  placeholder="Parlons de ton projet"
                />
                {errors.subject && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/65 mb-1">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-white/5 resize-none transition-colors ${errors.message
                    ? "border-red-400/70 focus:border-red-400 focus:ring-1 focus:ring-red-400/50"
                    : "border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/60"
                    }`}
                  placeholder="Donne-moi quelques détails : objectifs, délais, budget…"
                />
                {errors.message && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.message.message}</p>
                )}
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
                  Ou directement :{" "}
                  <a href="mailto:ryan.elr@outlook.com" className="underline hover:text-amber-300 transition-colors">
                    ryan.elr@outlook.com
                  </a>
                </p>
              </div>

              {status === "sent" && (
                <p className="text-xs text-emerald-400 pt-1">Message bien envoyé, merci !</p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400 pt-1">
                  Impossible d&apos;envoyer pour l&apos;instant. Vérifie la config EmailJS.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Mini footer */}
      <footer className="mt-auto pt-8 pb-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-foreground/35">
          <span>© {new Date().getFullYear()} Ryan El R. — Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/RyanElr" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/ryanelr/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </section>
  );
}
