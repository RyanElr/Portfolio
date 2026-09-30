"use client";

import { useEffect, useRef, useState } from "react";

export default function AmbientAudio() {
  const audio = useRef<{ context: AudioContext; gain: GainNode; source: AudioBufferSourceNode } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    const visibility = () => {
      const current = audio.current;
      if (!current) return;
      if (document.hidden) void current.context.suspend();
      else if (enabledRef.current) void current.context.resume().catch(() => {
        enabledRef.current = false;
        setEnabled(false);
      });
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      const current = audio.current;
      if (current) {
        current.source.stop();
        void current.context.close();
        audio.current = null;
      }
    };
  }, []);

  const toggle = async () => {
    if (busy.current) return;
    busy.current = true;
    setError(false);
    try {
      if (!audio.current) {
        const context = new AudioContext();
        const buffer = context.createBuffer(1, context.sampleRate * 6, context.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        // White noise with the sharp frequencies removed: a soft, low breath.
        const highpass = context.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 45;
        highpass.Q.value = 0.5;
        const lowpass = context.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 220;
        lowpass.Q.value = 0.5;
        const gain = context.createGain();
        gain.gain.value = 0;
        source.connect(highpass).connect(lowpass).connect(gain).connect(context.destination);
        source.start();
        audio.current = { context, gain, source };
      }
      const { context, gain } = audio.current;
      await context.resume();
      const next = !enabledRef.current;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
      gain.gain.linearRampToValueAtTime(next ? 0.025 : 0, context.currentTime + (next ? 1.2 : 0.35));
      enabledRef.current = next;
      setEnabled(next);
    } catch {
      setError(true);
      enabledRef.current = false;
      setEnabled(false);
    } finally {
      busy.current = false;
    }
  };

  const label = enabled ? "Couper l’ambiance sonore" : "Activer l’ambiance sonore";
  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 md:right-6 z-50 flex items-center gap-3">
      {error && <p role="status" className="max-w-48 rounded-lg bg-black/90 p-2 text-xs text-white/80">Son indisponible. Réessaie pour l’activer.</p>}
      <button type="button" onClick={toggle} aria-label={label} aria-pressed={enabled} title={label}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white/70 backdrop-blur-md transition-colors hover:border-ember-400/60 hover:text-ember-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400">
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {enabled ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>}
        </svg>
      </button>
    </div>
  );
}
