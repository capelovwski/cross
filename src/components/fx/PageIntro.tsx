"use client";

/**
 * Cortina de entrada (roda a cada carregamento completo da página).
 * Desktop: três painéis verticais (vermelho, azul, amarelo) sobem em sequência.
 * Mobile: um painel único desliza para cima com a logo "carimbando" no centro.
 * Respeita prefers-reduced-motion (não renderiza).
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { MOBILE, useMediaQuery } from "@/lib/useMediaQuery";

const EASE = [0.76, 0, 0.24, 1] as const;

export function PageIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const mobile = useMediaQuery(MOBILE);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1150);
    return () => clearTimeout(t);
  }, []);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
          {mobile ? (
            <motion.div
              className="grain-light absolute inset-0 flex items-center justify-center bg-ink"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <motion.div
                initial={{ scale: 1.6, opacity: 0, rotate: -6 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                className="w-[52vw]"
              >
                <Logo name="cross-home" priority sizes="60vw" className="w-full" alt="" />
              </motion.div>
            </motion.div>
          ) : (
            <>
              {(["bg-red", "bg-blue", "bg-yellow"] as const).map((bg, i) => (
                <motion.div
                  key={bg}
                  className={`absolute top-0 h-full w-1/3 ${bg}`}
                  style={{ left: `${i * 33.34}%` }}
                  initial={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.75, ease: EASE, delay: i * 0.08 }}
                />
              ))}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Logo name="cross-white" priority sizes="240px" className="w-56 drop-shadow-[4px_5px_0_rgba(11,11,12,1)]" alt="" />
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
