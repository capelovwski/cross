"use client";

/**
 * Indicador líquido ("amoeba") da seção ativa num menu.
 * Três formas dentro de um filtro gooey (desfoque + limiar de alfa):
 *  - cabeça: pílula que corre rápido até o botão novo;
 *  - cauda: pílula que sai atrasada do botão antigo;
 *  - ponte: faixa fina entre as duas, que afina conforme elas se afastam.
 * O filtro funde as três num só corpo que estica e se recolhe. O texto dos botões fica fora
 * do filtro (acima), então nunca borra. Com reduce-motion o indicador só pula de lugar.
 */
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useId, useRef, type RefObject } from "react";

interface Props {
  /** elemento posicionado (relative) que contém os botões; o indicador se mede contra ele */
  containerRef: RefObject<HTMLElement | null>;
  /** devolve o elemento do botão `i` */
  getItem: (i: number) => HTMLElement | null;
  /** índice do botão ativo; -1 esconde o indicador */
  activeIndex: number;
  color: string;
  /** desfoque do filtro em px: quanto maior, mais "mole" o líquido */
  blur?: number;
}

const HEAD = { stiffness: 520, damping: 36, mass: 0.7 };
const TAIL = { stiffness: 120, damping: 17, mass: 1 };

export function GooIndicator({ containerRef, getItem, activeIndex, color, blur = 6 }: Props) {
  const reduce = useReducedMotion();
  const fid = `goo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const headX = useSpring(0, HEAD);
  const headW = useSpring(0, HEAD);
  const tailX = useSpring(0, TAIL);
  const tailW = useSpring(0, TAIL);
  const y = useSpring(0, HEAD);
  const h = useSpring(0, HEAD);
  const opacity = useSpring(0, { stiffness: 260, damping: 30 });

  const rx = useTransform(h, (v) => v / 2);
  const tailY = useTransform([y, h], ([yy, hh]: number[]) => yy + hh * 0.08);
  const tailH = useTransform(h, (v) => v * 0.84);
  const tailRx = useTransform(tailH, (v) => v / 2);
  const bridgeX = useTransform([headX, headW, tailX, tailW], ([hx, hw, tx, tw]: number[]) => Math.min(hx + hw / 2, tx + tw / 2));
  const bridgeW = useTransform([headX, headW, tailX, tailW], ([hx, hw, tx, tw]: number[]) => Math.abs(hx + hw / 2 - (tx + tw / 2)));
  // a ponte afina quanto mais longe a cabeça está da cauda (pescoço da ameba)
  const bridgeH = useTransform([h, bridgeW], ([hh, bw]: number[]) => hh * Math.max(0.22, 0.55 - bw / 900));
  const bridgeY = useTransform([y, h, bridgeH], ([yy, hh, bh]: number[]) => yy + (hh - bh) / 2);

  const getItemRef = useRef(getItem);
  const activeRef = useRef(activeIndex);
  const visible = useRef(false);
  useEffect(() => {
    getItemRef.current = getItem;
  });

  const place = useCallback(
    (instant: boolean) => {
      const c = containerRef.current;
      if (!c) return;
      const i = activeRef.current;
      const el = i >= 0 ? getItemRef.current(i) : null;
      if (!el) {
        opacity.set(0);
        visible.current = false;
        return;
      }
      const cr = c.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const x = r.left - cr.left;
      const jump = instant || reduce || !visible.current;
      for (const [mv, v] of [
        [headX, x],
        [headW, r.width],
        [tailX, x],
        [tailW, r.width],
        [y, r.top - cr.top],
        [h, r.height],
      ] as const) {
        if (jump) mv.jump(v);
        else mv.set(v);
      }
      opacity.set(1);
      visible.current = true;
    },
    [containerRef, reduce, headX, headW, tailX, tailW, y, h, opacity],
  );

  useEffect(() => {
    activeRef.current = activeIndex;
    place(false);
  }, [activeIndex, place]);

  // fontes carregando, janela redimensionada: reposiciona sem animar
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(true);
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, [containerRef, place]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <filter id={fid} x="-40%" y="-200%" width="180%" height="500%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <motion.g filter={`url(#${fid})`} initial={false} animate={{ fill: color }} transition={{ duration: 0.35 }} style={{ opacity }}>
        <motion.rect x={bridgeX} y={bridgeY} width={bridgeW} height={bridgeH} />
        <motion.rect x={tailX} y={tailY} width={tailW} height={tailH} rx={tailRx} />
        <motion.rect x={headX} y={y} width={headW} height={h} rx={rx} />
      </motion.g>
    </svg>
  );
}
