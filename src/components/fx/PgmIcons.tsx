"use client";

/**
 * Ícones animados dos três passos do PGM (32×32, traço de 2px em ink).
 * Todos desenham o traço ao aparecer e depois ficam num loop sutil.
 * Com prefers-reduced-motion aparecem prontos e parados.
 *  - Amar: coração que se desenha, ganha cor e bate.
 *  - Servir: igreja local (telhado, cruz, porta) com raios que acendem.
 *  - Transbordar: um PGM que se divide em dois (multiplicação).
 */
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const INK = "#0b0b0c";
const RED = "#e8262a";
const YELLOW = "#ffc91f";
const PAPER = "#f3f0e8";

const stroke = { stroke: INK, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const draw = (delay = 0): Transition => ({ pathLength: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2, delay } });

function useAnim() {
  return !useReducedMotion();
}

export function IconAmar({ className }: { className?: string }) {
  const anim = useAnim();
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <motion.path
        d="M16 26.5C8 20.6 4 16 4 11.2 4 7.9 6.5 5.5 9.4 5.5c2.6 0 4.9 1.7 6.6 4 1.7-2.3 4-4 6.6-4 2.9 0 5.4 2.4 5.4 5.7C28 16 24 20.6 16 26.5Z"
        {...stroke}
        initial={anim ? { pathLength: 0, opacity: 0, fill: "rgba(232,38,42,0)" } : false}
        animate={
          anim
            ? { pathLength: 1, opacity: 1, fill: RED, scale: [1, 1, 1.14, 1, 1.08, 1] }
            : { pathLength: 1, opacity: 1, fill: RED }
        }
        transition={
          anim
            ? {
                ...draw(),
                fill: { duration: 0.4, delay: 0.8 },
                scale: { duration: 1.4, delay: 1.2, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.3, 0.45, 0.6, 0.75, 1] },
              }
            : undefined
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 55%" }}
      />
    </svg>
  );
}

export function IconServir({ className }: { className?: string }) {
  const anim = useAnim();
  const init = anim ? { pathLength: 0, opacity: 0 } : false;
  const on = { pathLength: 1, opacity: 1 };
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      {/* raios: a igreja "acesa" */}
      {[
        "M5 9.5 3 8",
        "M27 9.5 29 8",
        "M4.5 15H2",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          {...stroke}
          stroke={RED}
          initial={anim ? { opacity: 0 } : false}
          animate={anim ? { opacity: [0, 1, 0] } : { opacity: 1 }}
          transition={anim ? { duration: 1.8, delay: 1.1 + i * 0.2, repeat: Infinity, repeatDelay: 0.4 } : undefined}
        />
      ))}
      {/* corpo + telhado */}
      <motion.path d="M8.5 14.5V26.5h15V14.5" {...stroke} initial={init} animate={on} transition={anim ? draw(0.1) : undefined} />
      <motion.path d="M6 15.5 16 8l10 7.5" {...stroke} initial={init} animate={on} transition={anim ? draw(0) : undefined} />
      {/* porta */}
      <motion.path d="M14 26.5v-5a2 2 0 0 1 4 0v5" {...stroke} initial={init} animate={on} transition={anim ? draw(0.45) : undefined} />
      {/* cruz no topo */}
      <motion.g
        initial={anim ? { opacity: 0, y: 3 } : false}
        animate={anim ? { opacity: 1, y: [0, -0.8, 0] } : { opacity: 1 }}
        transition={anim ? { opacity: { duration: 0.3, delay: 0.7 }, y: { duration: 2.2, delay: 1, repeat: Infinity, ease: "easeInOut" } } : undefined}
      >
        <path d="M16 2.5v5.5M13.7 4.6h4.6" {...stroke} stroke={RED} strokeWidth={2.2} />
      </motion.g>
    </svg>
  );
}

export function IconTransbordar({ className }: { className?: string }) {
  const anim = useAnim();
  const cycle: Transition = { duration: 3.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] };
  const cell = (dir: -1 | 1, fill: string) => (
    <motion.g
      initial={anim ? { x: 0, scale: 0.6, opacity: 0 } : false}
      animate={anim ? { x: [0, dir * 6.5, dir * 6.5, 0], scale: [1.2, 1, 1, 1.2], opacity: 1 } : { x: dir * 6.5, scale: 1, opacity: 1 }}
      transition={anim ? { x: cycle, scale: cycle, opacity: { duration: 0.3 } } : undefined}
      style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
    >
      <circle cx="16" cy="16" r="7.2" fill={fill} stroke={INK} strokeWidth={2} />
      {/* pessoas no grupo */}
      <circle cx="13.6" cy="15" r="1.5" fill={INK} />
      <circle cx="18.4" cy="15" r="1.5" fill={INK} />
      <circle cx="16" cy="18.8" r="1.5" fill={INK} />
    </motion.g>
  );
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 overflow-visible", className)} aria-hidden>
      {cell(1, RED)}
      {cell(-1, YELLOW)}
    </svg>
  );
}

export const pgmStepIcons = [IconAmar, IconServir, IconTransbordar];
export const pgmBadgeFill = PAPER;
