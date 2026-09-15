"use client";

/**
 * Trilha ambiente do site.
 * - Começa em silêncio (navegadores bloqueiam som automático). O botão de som liga a música
 *   bem baixinha (fade-in até ~12%) e a escolha fica salva: nas próximas visitas ela volta
 *   sozinha no primeiro toque/clique na página.
 * - O <audio> vive no layout raiz, então continua tocando ao navegar entre / e /store.
 * - Se não houver arquivo em /audio/ambient.(mp3|m4a|wav), o botão nem aparece.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const VOLUME = 0.12;
const KEY = "cross:ambient";

interface AudioApi {
  available: boolean;
  playing: boolean;
  toggle: () => void;
}

const AudioContext = createContext<AudioApi>({ available: false, playing: false, toggle: () => {} });
export const useAmbientAudio = () => useContext(AudioContext);

export function AmbientAudioProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const fade = useRef<number>(0);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const a = ref.current;
    if (!a) return;
    cancelAnimationFrame(fade.current);
    const from = a.volume;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      a.volume = from + (target - from) * k;
      if (k < 1) fade.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    fade.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const a = ref.current;
    if (!a) return false;
    try {
      a.muted = false;
      a.volume = 0;
      await a.play();
      fadeTo(VOLUME);
      setPlaying(true);
      return true;
    } catch {
      return false; // bloqueado até uma interação do usuário
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    fadeTo(0, () => a.pause());
    setPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      try {
        localStorage.setItem(KEY, "off");
      } catch {}
    } else {
      void start().then((ok) => {
        if (ok) {
          try {
            localStorage.setItem(KEY, "on");
          } catch {}
        }
      });
    }
  }, [playing, start, stop]);

  // escolha salva: tenta tocar; se o navegador bloquear, espera o primeiro toque/clique
  useEffect(() => {
    let wanted = false;
    try {
      wanted = localStorage.getItem(KEY) === "on";
    } catch {}
    if (!wanted) return;
    let cancelled = false;
    const resume = () => {
      if (cancelled) return;
      void start().then((ok) => {
        if (ok) cleanup();
      });
    };
    const cleanup = () => {
      cancelled = true;
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    void start().then((ok) => {
      if (ok) return;
      window.addEventListener("pointerdown", resume, { passive: true });
      window.addEventListener("keydown", resume);
    });
    return cleanup;
  }, [start]);

  return (
    <AudioContext.Provider value={{ available, playing, toggle }}>
      {children}
      <audio
        ref={ref}
        loop
        preload="none"
        // só é "indisponível" quando NENHUMA fonte carregou (um 404 numa fonte com outra tocando é normal)
        onError={(e) => {
          const a = e.currentTarget;
          if (a.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setAvailable(false);
        }}
        aria-hidden
      >
        <source src="/audio/ambient.mp3" type="audio/mpeg" />
        <source src="/audio/ambient.m4a" type="audio/mp4" />
        {/* última candidata: se ela falhar, nenhuma serviu */}
        <source src="/audio/ambient.wav" type="audio/wav" onError={() => setAvailable(false)} />
      </audio>
    </AudioContext.Provider>
  );
}

/** Botão de som: alto-falante mudo / barras animadas quando está tocando. */
export function AudioToggle({ className, dark }: { className?: string; dark?: boolean }) {
  const { available, playing, toggle } = useAmbientAudio();
  if (!available) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Desligar música" : "Ligar música"}
      title={playing ? "Desligar música" : "Ligar música (bem baixinha)"}
      className={cn(
        "grid size-10 place-items-center rounded-full border-2 transition-colors",
        dark ? "border-paper/40 text-paper hover:bg-paper/10" : "border-ink/30 text-ink hover:bg-ink/10",
        playing && "border-yellow bg-yellow text-ink hover:bg-yellow-deep",
        className,
      )}
    >
      {playing ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="w-[3px] rounded-full bg-current animate-eq" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path d="M22 9l-6 6M16 9l6 6" />
        </svg>
      )}
    </button>
  );
}
