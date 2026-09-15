"use client";

/**
 * FullPageScroll
 *
 * Dois modos:
 *  - "snap" (padrão): feed engatado por seção, 1 gesto = 1 tela.
 *      · mobile (< 768px): o trilho acompanha o dedo e encaixa (estilo Reels).
 *      · desktop: a cada troca a seção que chega "se constrói" (os elementos
 *        entram em coreografia, ver `Reveal`/`Stagger`) e a que sai se desmonta,
 *        com um leve atraso de paralaxe entre o trilho e o conteúdo. A sensação
 *        é a de página que vai se montando a cada scroll, como nos sites da Apple.
 *  - "native" (prefers-reduced-motion): documento comum com rolagem livre;
 *    cada seção tem altura mínima de uma tela. O índice ativo (header,
 *    bolinhas) é acompanhado por IntersectionObserver.
 *
 * Regras do modo snap:
 *  - 1 gesto de roda/trackpad = 1 seção, independente da intensidade
 *    (inércia filtrada por cooldown + delta "novo"/não decaindo).
 *  - 1 swipe = 1 seção em touch (limiar de distância ou velocidade).
 *  - Teclado: ↑ ↓ PageUp PageDown Space Home End.
 *  - Hash (#up) e âncoras do menu funcionam nos dois modos.
 *  - Seção maior que a tela: rolagem interna primeiro, depois troca.
 */

import { Children, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ScrollContext, SectionStateContext, type ScrollApi, type SectionState } from "./ScrollContext";
import { cn } from "@/lib/utils";
import { MOBILE, REDUCED_MOTION, useMediaQuery } from "@/lib/useMediaQuery";

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
/** distância mínima (px) ou velocidade (px/ms) para trocar de seção ao soltar o dedo */
const SWIPE_PX = 60;
const SWIPE_VELOCITY = 0.35;
/** quanto o trilho acompanha o dedo (1 = 1:1, como um feed). Nas pontas o valor cai (efeito elástico). */
const DRAG_FOLLOW = 1;
/** desktop: o conteúdo da seção inativa fica deslocado (vh) e chega um pouco depois do trilho (paralaxe) */
const DEPTH_SHIFT_VH = 6;
const DEPTH_LAG_MS = 100;

/**
 * Procura, do alvo até `root`, um elemento que ainda pode rolar na direção `dir`.
 * Numa seção, a "altura real" do conteúdo é a altura de layout da casca (offsetHeight),
 * que ignora transformações: durante a coreografia os elementos animados esticam o
 * scrollHeight por alguns px e um gesto legítimo acabaria engolido pela rolagem interna.
 */
function findScrollable(target: EventTarget | null, dir: number, root: HTMLElement) {
  let el = target instanceof HTMLElement ? target : null;
  while (el && el !== root) {
    const { overflowY } = getComputedStyle(el);
    if (/(auto|scroll)/.test(overflowY)) {
      const shell = el.hasAttribute("data-section") ? (el.firstElementChild?.firstElementChild as HTMLElement | null) : null;
      const contentH = shell ? shell.offsetHeight : el.scrollHeight;
      if (contentH > el.clientHeight + 1) {
        if (dir > 0 && el.scrollTop + el.clientHeight < contentH - 1) return el;
        if (dir < 0 && el.scrollTop > 0) return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

export function FullPageScroll({ ids, children, chrome, duration: durationProp = 650, cooldown: cooldownProp = 420, className }: Props) {
  const count = ids.length;
  const mobile = useMediaQuery(MOBILE);
  // mobile: encaixe curto com desaceleração natural e bloqueio mínimo (só evita disparo duplo
  // do mesmo gesto). desktop: o bloqueio é menor que a transição; um gesto novo no meio dela
  // simplesmente muda o alvo (a transição CSS continua de onde está, sem solavanco).
  const duration = mobile ? 460 : durationProp;
  const cooldown = mobile ? 120 : cooldownProp;
  const ease = mobile ? "cubic-bezier(0.22, 1, 0.36, 1)" : "var(--ease-section)";
  const sectionsArr = useMemo(() => Children.toArray(children), [children]);

  const reduce = useMediaQuery(REDUCED_MOTION);
  const mode: "snap" | "native" = reduce ? "native" : "snap";
  // coreografia de construção só no desktop (no mobile o feed já tem o arraste 1:1)
  const build = mode === "snap" && !mobile;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lockedUntil = useRef(0);
  const nativeUntil = useRef(0);
  const lastWheel = useRef({ t: 0, abs: 0 });
  const touch = useRef({ x: 0, y: 0, horizontal: false, dragging: false, lastY: 0, lastT: 0, vel: 0, inner: false, basePx: 0 });

  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  const goTo = useCallback(
    (target: number | string) => {
      const i = clamp(typeof target === "number" ? target : Math.max(0, ids.indexOf(target)));
      if (mode === "native") {
        document.getElementById(ids[i])?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${ids[i]}`);
        return;
      }
      if (i === indexRef.current) return;
      indexRef.current = i;
      setIndex(i);
      lockedUntil.current = performance.now() + cooldown;
      // reseta a rolagem interna da seção que ficou pra trás (e qualquer scroll que o browser
      // tenha aplicado no container por causa de uma âncora)
      const root = rootRef.current;
      if (root) root.scrollTop = 0;
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

  /* -------- modo native: acompanha a seção visível -------- */
  useEffect(() => {
    if (mode !== "native") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        // a seção com maior área visível vira a ativa
        let best: { i: number; r: number } | null = null;
        for (const en of entries) {
          const i = Number((en.target as HTMLElement).dataset.index);
          if (en.isIntersecting && (!best || en.intersectionRatio > best.r)) best = { i, r: en.intersectionRatio };
        }
        if (best && best.i !== indexRef.current) {
          indexRef.current = best.i;
          setIndex(best.i);
        }
      },
      { threshold: [0.35, 0.5, 0.65] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mode]);

  /* -------- hash inicial -------- */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = ids.indexOf(hash);
    // o browser (ou o router) pode rolar o container (overflow hidden) até a âncora em volta da
    // hidratação; desfaz agora e logo depois, para o trilho ser a única fonte de posição
    const reset = () => {
      if (rootRef.current) rootRef.current.scrollTop = 0;
    };
    reset();
    const t = setTimeout(reset, 80);
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
      clearTimeout(t);
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

    const baseTransform = () => `translate3d(0, ${-(indexRef.current * 100) / count}%, 0)`;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      const track = trackRef.current;
      // posição atual do trilho em px. Se uma transição ainda estiver rolando, congela onde está:
      // o dedo assume o controle no meio do movimento, sem esperar terminar.
      let basePx = -indexRef.current * root.clientHeight;
      if (track) {
        const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        const settled = Math.abs(m.m42 - basePx) < 1;
        if (!settled && Number.isFinite(m.m42)) {
          basePx = m.m42;
          track.style.transition = "none";
          track.style.transform = `translate3d(0, ${basePx}px, 0)`;
        }
      }
      lockedUntil.current = 0;
      touch.current = { x: t.clientX, y: t.clientY, horizontal: false, dragging: false, lastY: t.clientY, lastT: performance.now(), vel: 0, inner: false, basePx };
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dy = touch.current.y - t.clientY; // >0 = dedo subiu = próxima seção
      const dx = touch.current.x - t.clientX;
      const now = performance.now();
      // velocidade instantânea (px/ms)
      const dt = Math.max(1, now - touch.current.lastT);
      touch.current.vel = (touch.current.lastY - t.clientY) / dt;
      touch.current.lastY = t.clientY;
      touch.current.lastT = now;

      // gesto horizontal (carrossel, linha do tempo) → deixa o browser cuidar
      if (touch.current.horizontal || (!touch.current.dragging && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy))) {
        touch.current.horizontal = true;
        return;
      }
      const dir = Math.sign(dy);
      if (!dir) return;
      // seção maior que a tela: rolagem interna primeiro
      if (!touch.current.dragging && findScrollable(e.target, dir, root)) {
        touch.current.inner = true;
        nativeUntil.current = now + 400;
        return;
      }
      if (touch.current.inner) return;
      if (e.cancelable) e.preventDefault();

      // o trilho acompanha o dedo 1:1 (com resistência nas pontas)
      const track = trackRef.current;
      if (!track) return;
      const atEdge = (dir > 0 && indexRef.current === count - 1) || (dir < 0 && indexRef.current === 0);
      const follow = dy * (atEdge ? DRAG_FOLLOW * 0.3 : DRAG_FOLLOW);
      touch.current.dragging = true;
      track.style.transition = "none";
      track.style.transform = `translate3d(0, ${touch.current.basePx - follow}px, 0)`;
    };
    const onTouchEnd = () => {
      const track = trackRef.current;
      const { dragging, y, lastY, vel } = touch.current;
      touch.current.dragging = false;
      if (!track || !dragging) return;
      track.style.transition = `transform ${duration}ms ${ease}`;
      const dy = y - lastY;
      const dir = Math.sign(dy);
      const shouldStep = Math.abs(dy) > SWIPE_PX || (Math.abs(vel) > SWIPE_VELOCITY && Math.sign(vel) === dir);
      if (dir && shouldStep && step(dir)) return; // React aplica o transform da nova seção
      track.style.transform = baseTransform(); // volta pro lugar (ou conclui a transição interrompida)
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
    root.addEventListener("touchcancel", onTouchEnd, { passive: true });
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("scroll", onScrollRoot);
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("scroll", onScrollRoot);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, step, goTo, count, duration, ease]);

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

  const stateFor = (i: number): SectionState => ({ index: i, active: i === index, offset: i - index, build });

  if (mode === "native") {
    return (
      <ScrollContext.Provider value={api}>
        {chrome}
        <div className={className}>
          {sectionsArr.map((child, i) => (
            <section key={ids[i]} id={ids[i]} data-section data-index={i} className="flex min-h-dvh flex-col">
              <SectionStateContext.Provider value={stateFor(i)}>{child}</SectionStateContext.Provider>
            </section>
          ))}
        </div>
      </ScrollContext.Provider>
    );
  }

  return (
    <ScrollContext.Provider value={api}>
      {chrome}
      <div ref={rootRef} className={cn("relative h-dvh w-full overflow-hidden overscroll-none md:bg-ink", className)}>
        <div
          ref={trackRef}
          className="will-change-transform"
          style={{
            transform: `translate3d(0, ${-(index * 100) / count}%, 0)`,
            transition: `transform ${duration}ms ${ease}`,
            height: `${count * 100}%`,
          }}
        >
          {sectionsArr.map((child, i) => {
            const active = i === index;
            // desktop: a seção inativa fica um pouco menor, mais escura e deslocada na direção de onde vem;
            // o conteúdo chega com um leve atraso em relação ao trilho (profundidade)
            const shift = active || mobile ? 0 : Math.sign(i - index) * DEPTH_SHIFT_VH;
            const contentMs = mobile ? duration : duration + DEPTH_LAG_MS;
            return (
              <section
                key={ids[i]}
                id={ids[i]}
                data-section
                data-index={i}
                aria-current={active ? "page" : undefined}
                tabIndex={-1}
                className="h-dvh w-full overflow-y-auto overscroll-contain no-scrollbar outline-none"
              >
                {/* linha minmax(100%, auto): a seção ocupa a tela inteira e cresce se o conteúdo for maior */}
                <div
                  className="grid h-full grid-rows-[minmax(100%,auto)] origin-center will-change-transform"
                  style={
                    mobile
                      ? undefined // feed puro: sem escala/opacidade, só o trilho se move (mais leve)
                      : {
                          transform: active ? "translate3d(0,0,0) scale(1)" : `translate3d(0, ${shift}vh, 0) scale(0.95)`,
                          opacity: active ? 1 : 0.55,
                          transition: `transform ${contentMs}ms var(--ease-section), opacity ${contentMs}ms var(--ease-section)`,
                        }
                  }
                >
                  <SectionStateContext.Provider value={stateFor(i)}>{child}</SectionStateContext.Provider>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
