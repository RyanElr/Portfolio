"use client";

import { useEffect, useRef, useState } from "react";
import CookieIcon from "@/components/CookieIcon";
import { saveConsent, useConsent } from "@/lib/consent";

const button =
  "rounded-full px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400";
// Accept and refuse share the same weight so neither choice is nudged (CNIL guidance).
const choice = `${button} border border-ember-400/40 bg-ember-400/10 text-ember-200 hover:bg-ember-400/20 hover:border-ember-400/70`;
const quiet = `${button} text-white/60 underline-offset-4 hover:text-white hover:underline`;

export default function CookieConsent() {
  const consent = useConsent();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  const openPreferences = () => {
    setEasterEgg(consent?.easterEgg ?? false);
    setOpen(true);
  };
  const decide = (value: boolean) => {
    saveConsent(value);
    setOpen(false);
  };

  if (consent === undefined) return null;
  const pending = consent === null && !open;

  return (
    <>
      {pending ? (
        <section
          aria-label="Gestion des cookies"
          className="fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-xl rounded-2xl border border-ember-400/25 bg-[#0b0505]/95 p-4 shadow-[0_20px_60px_#000c,0_0_40px_#fa25161a] backdrop-blur-md md:bottom-6 md:left-24 md:right-24 sm:p-5 motion-safe:animate-[cookie-in_500ms_cubic-bezier(.2,.8,.2,1)]"
        >
          <div className="flex gap-3 sm:gap-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-ember-400/30 bg-ember-400/10 text-ember-200">
              <CookieIcon size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white">Un cookie ?</h2>
              <p className="mt-1 text-xs leading-relaxed text-white/65">
                Aucun traceur publicitaire ni mesure d’audience ici. Un cookie nécessaire retient ton choix
                pendant 6 mois, et un cookie facultatif cache un petit easter egg.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className={choice} onClick={() => decide(false)}>Tout refuser</button>
                <button type="button" className={choice} onClick={() => decide(true)}>Tout accepter</button>
                <button type="button" className={quiet} onClick={openPreferences}>Personnaliser</button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={openPreferences}
          aria-label="Gérer les cookies"
          title="Gérer les cookies"
          className="group fixed bottom-20 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white/70 backdrop-blur-md transition-colors hover:border-ember-400/60 hover:text-ember-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400 md:bottom-6 md:left-6"
        >
          <CookieIcon size={20} className="transition-transform duration-300 motion-safe:group-hover:rotate-[20deg]" />
        </button>
      )}

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        aria-labelledby="cookie-preferences-title"
        className="m-auto w-[min(100%-2rem,28rem)] rounded-2xl border border-ember-400/25 bg-[#0b0505] p-0 text-white shadow-[0_30px_80px_#000,0_0_50px_#fa25161f] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-ember-400/30 bg-ember-400/10 text-ember-200">
              <CookieIcon size={20} />
            </span>
            <h2 id="cookie-preferences-title" className="text-base font-semibold">Préférences cookies</h2>
          </div>

          <ul className="mt-4 space-y-3">
            <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Nécessaire</span>
                <span className="text-[11px] uppercase tracking-wide text-white/40">Toujours actif</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                <code className="text-ember-200">cookie_consent</code> mémorise ton choix pendant 6 mois.
              </p>
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-sm font-medium">Easter egg</span>
                <input
                  type="checkbox"
                  checked={easterEgg}
                  onChange={(event) => setEasterEgg(event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-6 w-11 flex-shrink-0 rounded-full border border-white/15 bg-white/10 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-[18px] after:w-[18px] after:rounded-full after:bg-white/70 after:transition-transform peer-checked:border-ember-400/60 peer-checked:bg-ember-500/70 peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-400"
                />
              </label>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                <code className="text-ember-200">easter_egg</code> contient un message caché pour les curieux. Durée : la session.
              </p>
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" className={choice} onClick={() => decide(false)}>Tout refuser</button>
            <button type="button" className={choice} onClick={() => decide(easterEgg)}>Enregistrer</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
