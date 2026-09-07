"use client";

/**
 * FullPageScroll — scroll "engatado" por seção.
 *
 * Implementação customizada (sem lib) escolhida por ser a mais estável e
 * previsível: controlamos 100% do estado (índice) e a transição é um único
 * `transform: translateY` com easing, sem depender do scroll nativo.
 *
 * Regras:
 *  - 1 gesto de roda/trackpad = 1 seção, independente da intensidade.
 *    Inércia de trackpad é filtrada por (a) cooldown de ~850ms e (b) só
 *    disparar quando o delta é "novo" (gap > 150ms) ou não está decaindo.
 *  - 1 swipe = 1 seção em touch (limiar de 50px).
 *  - Teclado: ↑ ↓ PageUp PageDown Space Home End.
 *  - Hash (#up) e âncoras do menu continuam funcionando.
 *  - Se uma seção for maior que a viewport (mobile / janela baixa), a rolagem
 *    interna acontece primeiro; só quando ela chega ao limite o próximo gesto
 *    avança de seção.
 *  - prefers-reduced-motion → modo "native": documento comum com scroll-snap
 *    de proximidade e sem hijack.
 */

import { Children, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ScrollContext, type ScrollApi } from "./ScrollContext";
import { cn } from "@/lib/utils";

interface Props {
  ids: readonly string[];
  children: ReactNode;
  /** duração da transição em ms */
  duration?: number;
  /** bloqueio após cada avanço em ms */
  cooldown?: number;
  className?: string;
  /** elementos fixos (header, indicador) renderizados dentro do provider */
  chrome?: ReactNode;
}

const WHEEL_GAP_MS = 150;
const SWIPE_PX = 50;

/** Procura, do alvo até `root`, um elemento que ainda pode rolar na direção `dir`. */
function findScrollable(target: EventTarget | null, dir: number, root: HTMLElement) {
  let el = target instanceof HTMLElement ? target : null;
  while (el && el !== root) {
    const { overflowY } = getComputedStyle(el);
    if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return el;
      if (dir < 0 && el.scrollTop > 0) return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function FullPageScroll({ ids, children, chrome, duration = 750, cooldown = 850, className }: Props) {
  const count = ids.length;
  const sectionsArr = useMemo(() => Children.toArray(children), [children]);

  const [mode, setMode] = useState<"snap" | "native">("snap");
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const lockedUntil = useRef(0);
  const nativeUntil = useRef(0);
  const lastWheel = useRef({ t: 0, abs: 0 });
  const touch = useRef({ x: 0, y: 0, fired: false, horizontal: false });

  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  const goTo = useCallback(
    (target: number | string) => {
      const i = clamp(typeof target === "number" ? target : Math.max(0, ids.indexOf(target)));
      if (mode === "native") {
        document.getElementById(ids[i])?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (i === indexRef.current) return;
      indexRef.current = i;
      setIndex(i);
      lockedUntil.current = performance.now() + cooldown;
      // reseta a rolagem interna da seção que ficou pra trás
      const root = rootRef.current;
      root?.querySelectorAll<HTMLElement>("[data-section]").forEach((s, si) => {
        if (si !== i) s.scrollTop = 0;
      });
      history.replaceState(null, "", `#${ids[i]}`);
    },
    [clamp, cooldown, ids, mode],
  );

  const step = useCallback(
    (dir: number) => {
      const now = performance.now();
      if (now < lockedUntil.current) return false;
      const next = clamp(indexRef.current + dir);
      if (next === indexRef.current) return false;
      goTo(next);
      return true;
    },
    [clamp, goTo],
  );

  /* -------- modo (reduced motion) + hash inicial -------- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMode(mq.matches ? "native" : "snap");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = ids.indexOf(hash);
    // pula para a seção do hash no próximo frame (evita setState síncrono no effect)
    const raf = i > 0 ? requestAnimationFrame(() => goTo(i)) : 0;
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      const j = ids.indexOf(h);
      if (j >= 0 && j !== indexRef.current) goTo(j);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- listeners (só no modo snap) -------- */
  useEffect(() => {
    if (mode !== "snap") return;
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      const dir = Math.sign(e.deltaY);
      if (!dir) return;
      // deixa a rolagem interna acontecer primeiro
      if (findScrollable(e.target, dir, root)) {
        nativeUntil.current = performance.now() + 500;
        return;
      }
      e.preventDefault();
      const now = performance.now();
      const abs = Math.abs(e.deltaY);
      const gap = now - lastWheel.current.t;
      const fresh = gap > WHEEL_GAP_MS || abs >= lastWheel.current.abs; // novo gesto ou delta não decaindo
      lastWheel.current = { t: now, abs };
      if (now < nativeUntil.current) return;
      if (fresh) step(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, fired: false, horizontal: false };
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = touch.current.y - e.touches[0].clientY;
      const dx = touch.current.x - e.touches[0].clientX;
      // gesto horizontal (carrossel, linha do tempo) → deixa o browser cuidar
      if (touch.current.horizontal || (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy))) {
        touch.current.horizontal = true;
        return;
      }
      const dir = Math.sign(dy);
      if (!dir) return;
      if (findScrollable(e.target, dir, root)) {
        nativeUntil.current = performance.now() + 400;
        return; // rolagem interna nativa
      }
      if (e.cancelable) e.preventDefault();
      if (touch.current.fired) return;
      if (Math.abs(dy) > SWIPE_PX && performance.now() > nativeUntil.current) {
        touch.current.fired = true;
        step(dir);
      }
    };
    const onTouchEnd = () => {
      touch.current.fired = false;
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(count - 1);
          break;
      }
    };

    // Foco via Tab em seção fora da tela → traz a seção (acessibilidade de teclado / leitor de tela)
    const onFocusIn = (e: FocusEvent) => {
      const sec = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-section]");
      if (!sec) return;
      const i = Number(sec.dataset.index);
      root.scrollTop = 0; // o browser tenta rolar o container; desfaz
      if (!Number.isNaN(i) && i !== indexRef.current) {
        lockedUntil.current = 0;
        goTo(i);
      }
    };
    const onScrollRoot = () => {
      if (root.scrollTop !== 0) root.scrollTop = 0;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("scroll", onScrollRoot);
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("scroll", onScrollRoot);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, step, goTo, count]);

  // trava o scroll do documento enquanto o modo snap estiver ativo
  useEffect(() => {
    if (mode !== "snap") return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mode]);

  const api: ScrollApi = useMemo(
    () => ({ index, count, mode, goTo, next: () => step(1), prev: () => step(-1) }),
    [index, count, mode, goTo, step],
  );

  if (mode === "native") {
    return (
      <ScrollContext.Provider value={api}>
        {chrome}
        <div className={cn("snap-y snap-proximity", className)}>
          {sectionsArr.map((child, i) => (
            <section key={ids[i]} id={ids[i]} data-section data-index={i} className="min-h-dvh snap-start">
              {child}
            </section>
          ))}
        </div>
      </ScrollContext.Provider>
    );
  }

  return (
    <ScrollContext.Provider value={api}>
      {chrome}
      <div ref={rootRef} className={cn("relative h-dvh w-full overflow-hidden overscroll-none", className)}>
        <div
          className="will-change-transform"
          style={{
            transform: `translate3d(0, ${-(index * 100) / count}%, 0)`,
            transition: `transform ${duration}ms var(--ease-section)`,
            height: `${count * 100}%`,
          }}
        >
          {sectionsArr.map((child, i) => (
            <section
              key={ids[i]}
              id={ids[i]}
              data-section
              data-index={i}
              aria-current={i === index ? "page" : undefined}
              tabIndex={-1}
              className="h-dvh w-full overflow-y-auto overscroll-contain no-scrollbar outline-none"
            >
              {child}
            </section>
          ))}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
