"use client";

import { useEffect, useRef, useState } from "react";

type Rain = { context: AudioContext; gain: GainNode; stop: () => void };

// Minor-pentatonic notes (A) for the falling "code" glints, high enough to sit above the hiss.
const GLINTS = [880, 1046.5, 1174.7, 1318.5, 1568, 1760, 2093, 2349.3, 2637];

// Digital rain: crushed white noise, slow filter waves, a low drone and random glints.
function createMatrixRain(context: AudioContext): Rain {
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  // White noise held and quantised in short random steps: a grainy, "digital" hiss.
  const buffer = context.createBuffer(1, context.sampleRate * 8, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length;) {
    const value = Math.round((Math.random() * 2 - 1) * 8) / 8;
    const hold = 2 + Math.floor(Math.random() * 5);
    for (let j = 0; j < hold && i < samples.length; j++, i++) samples[i] = value;
  }
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 0.7;
  const air = context.createBiquadFilter();
  air.type = "highshelf";
  air.frequency.value = 6000;
  air.gain.value = -12;
  const hiss = context.createGain();
  hiss.gain.value = 0.55;
  noise.connect(band).connect(air).connect(hiss).connect(master);

  // Slow sweeps of the filter, like waves of rain passing over the screen.
  const wave = context.createOscillator();
  wave.frequency.value = 0.07;
  const waveDepth = context.createGain();
  waveDepth.gain.value = 1300;
  wave.connect(waveDepth).connect(band.frequency);
  const pulse = context.createOscillator();
  pulse.frequency.value = 0.23;
  const pulseDepth = context.createGain();
  pulseDepth.gain.value = 0.18;
  pulse.connect(pulseDepth).connect(hiss.gain);

  // Low, slightly detuned drone underneath.
  const drone = context.createGain();
  drone.gain.value = 0.18;
  const droneFilter = context.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 180;
  drone.connect(droneFilter).connect(master);
  const voices = [55, 55.4, 82.4].map((frequency) => {
    const voice = context.createOscillator();
    voice.type = "sawtooth";
    voice.frequency.value = frequency;
    voice.connect(drone);
    return voice;
  });

  // Glints echo slightly, so they trail like falling characters.
  const echo = context.createDelay(1);
  echo.delayTime.value = 0.28;
  const feedback = context.createGain();
  feedback.gain.value = 0.35;
  const glints = context.createGain();
  glints.gain.value = 0.5;
  glints.connect(master);
  glints.connect(echo).connect(feedback).connect(echo);
  echo.connect(master);

  const glint = () => {
    const at = context.currentTime + 0.02;
    const tone = context.createOscillator();
    tone.type = Math.random() < 0.7 ? "square" : "triangle";
    tone.frequency.value = GLINTS[Math.floor(Math.random() * GLINTS.length)];
    const soft = context.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = 3200;
    const envelope = context.createGain();
    const peak = 0.05 + Math.random() * 0.07;
    const length = 0.05 + Math.random() * 0.12;
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(peak, at + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + length);
    tone.connect(soft).connect(envelope).connect(glints);
    tone.start(at);
    tone.stop(at + length + 0.05);
  };
  // Irregular timing, sometimes in quick bursts, like a column of glyphs dropping.
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => {
      if (context.state === "running") {
        glint();
        if (Math.random() < 0.3) window.setTimeout(glint, 70);
        if (Math.random() < 0.15) window.setTimeout(glint, 140);
      }
      schedule();
    }, 180 + Math.random() * 900);
  };

  noise.start();
  wave.start();
  pulse.start();
  voices.forEach((voice) => voice.start());
  schedule();

  return {
    context,
    gain: master,
    stop: () => {
      window.clearTimeout(timer);
      [noise, wave, pulse, ...voices].forEach((node) => node.stop());
    },
  };
}

export default function AmbientAudio() {
  const audio = useRef<Rain | null>(null);
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
        current.stop();
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
      if (!audio.current) audio.current = createMatrixRain(new AudioContext());
      const { context, gain } = audio.current;
      await context.resume();
      const next = !enabledRef.current;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
      gain.gain.linearRampToValueAtTime(next ? 0.035 : 0, context.currentTime + (next ? 1.5 : 0.35));
      if (!next) window.setTimeout(() => { if (!enabledRef.current) void context.suspend(); }, 400);
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
