"use client";

/** Um círculo que se divide em dois e volta: a ideia de "multiplicar" do PGM. */
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Multiply({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  const reduce = useReducedMotion();
  const t = { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.35, 0.65, 1] };
  return (
    <span className={cn("relative block size-12", className)} aria-hidden>
      {[-1, 1].map((dir) => (
        <motion.span
          key={dir}
          className={cn("absolute left-1/2 top-1/2 -ml-3 -mt-3 block size-6 rounded-full", dotClassName)}
          animate={reduce ? { x: dir * 10 } : { x: [0, dir * 11, dir * 11, 0], scale: [1.25, 1, 1, 1.25] }}
          transition={reduce ? undefined : t}
        />
      ))}
    </span>
  );
}
