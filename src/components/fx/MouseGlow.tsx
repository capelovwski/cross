"use client";

/** Brilho radial que segue o mouse dentro da seção (fundos escuros). */
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export function MouseGlow({ color = "255,201,31", size = 520 }: { color?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 24 });
  const sy = useSpring(y, { stiffness: 120, damping: 24 });
  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${sx}px ${sy}px, rgba(${color},0.16), transparent 70%)`;

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    const leave = () => {
      x.set(-1000);
      y.set(-1000);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return <motion.div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: bg }} />;
}
