"use client";

/**
 * Efeito de profundidade com o mouse (só ponteiro fino, sem reduce-motion):
 * - `tilt`: o elemento inclina em 3D conforme a posição do mouse dentro dele.
 * - `parallax`: o elemento desliza alguns px seguindo o mouse na janela.
 */
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { FINE_POINTER, useMediaQuery } from "@/lib/useMediaQuery";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** graus máximos de inclinação */
  max?: number;
  /** rotação base (mantém o "adesivo torto") */
  rotate?: number;
}

export function Tilt({ children, className, max = 8, rotate = 0 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    };
    const leave = () => {
      px.set(0.5);
      py.set(0.5);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [enabled, px, py]);

  return (
    <div ref={ref} className={className} style={{ perspective: 900 }}>
      <motion.div style={enabled ? { rotateX, rotateY, rotate, transformStyle: "preserve-3d" } : { rotate }}>{children}</motion.div>
    </div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** deslocamento máximo em px (negativo inverte a direção) */
  strength?: number;
}

export function Parallax({ children, className, strength = 14 }: ParallaxProps) {
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const x = useTransform(sx, [-1, 1], [-strength, strength]);
  const y = useTransform(sy, [-1, 1], [-strength, strength]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, mx, my]);

  return (
    <motion.div className={className} style={enabled ? { x, y } : undefined}>
      {children}
    </motion.div>
  );
}
