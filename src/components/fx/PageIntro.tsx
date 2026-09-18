"use client";

/**
 * Tela de carregamento.
 * Fundo cinza escuro. A logo entra dando um pulo e, no alto do pulo, as camadas coloridas
 * (vermelho, amarelo e azul) escorregam para trás dela, como um empilhado de adesivos.
 * Depois de segurar um instante, tudo sobe e revela o site.
 * Com prefers-reduced-motion a tela só aparece e some, sem pulo.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CrossMark } from "@/components/ui/CrossMark";

const EASE = [0.22, 1, 0.36, 1] as const;
const BG = "#1c1c20";

/** camadas de trás para frente: quanto mais longe, mais deslocada */
const layers = [
  { color: "#1b4fe0", x: -30, y: 22 },
  { color: "#ffc91f", x: -20, y: 15 },
  { color: "#e8262a", x: -10, y: 7.5 },
];

const MARK = "h-14 sm:h-20 md:h-24";

export function PageIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), reduce ? 350 : 1450);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          style={{ backgroundColor: BG }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.25 : 0.62, ease: EASE }}
          aria-hidden
        >
          <motion.div
            className="relative"
            initial={reduce ? false : { y: 46, opacity: 0 }}
            animate={
              reduce
                ? { y: 0, opacity: 1 }
                : {
                    y: [46, -34, 0],
                    opacity: [0, 1, 1],
                    // esmaga na saída e estica no pulo
                    scaleY: [0.86, 1.08, 1],
                    scaleX: [1.12, 0.97, 1],
                  }
            }
            transition={reduce ? { duration: 0.2 } : { duration: 0.78, times: [0, 0.52, 1], ease: EASE }}
            style={{ transformOrigin: "50% 100%" }}
          >
            {layers.map((l, i) => (
              <motion.div
                key={l.color}
                className="absolute inset-0"
                initial={reduce ? false : { x: 0, y: 0, opacity: 0 }}
                animate={reduce ? { x: l.x, y: l.y, opacity: 1 } : { x: l.x, y: l.y, opacity: 1 }}
                transition={
                  reduce
                    ? { duration: 0.2 }
                    : { duration: 0.5, delay: 0.3 + (layers.length - 1 - i) * 0.06, ease: [0.34, 1.56, 0.64, 1] }
                }
              >
                <CrossMark letters={l.color} className={MARK} />
              </motion.div>
            ))}
            <CrossMark letters="#f3f0e8" className={`relative ${MARK}`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
