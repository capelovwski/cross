"use client";

/**
 * Cursor customizado (só em dispositivos com ponteiro fino e sem reduce-motion):
 * um ponto + um anel que seguem o mouse com mola. Sobre links/botões o anel
 * cresce e fica amarelo; sobre seções escuras inverte por mix-blend-mode.
 */
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from "@/lib/useMediaQuery";

export function Cursor() {
  const finePointer = useMediaQuery(FINE_POINTER);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const enabled = finePointer && !reducedMotion;
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(Boolean(t?.closest("a, button, [role=button], input, textarea, select, summary")));
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <motion.div className="absolute size-2 rounded-full bg-yellow mix-blend-difference" style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        className="absolute rounded-full border-2 border-paper mix-blend-difference"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hover ? 56 : down ? 24 : 36,
          height: hover ? 56 : down ? 24 : 36,
          opacity: hover ? 0.9 : 0.6,
          backgroundColor: hover ? "rgba(255,201,31,0.25)" : "rgba(255,201,31,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
