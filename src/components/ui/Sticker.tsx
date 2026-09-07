"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "yellow" | "red" | "blue" | "ink" | "white" | "paper";

const tones: Record<Tone, string> = {
  yellow: "bg-yellow text-ink",
  red: "bg-red text-white",
  blue: "bg-blue text-white",
  ink: "bg-ink text-yellow",
  white: "bg-white text-ink",
  paper: "bg-paper text-ink",
};

interface Props {
  children: ReactNode;
  tone?: Tone;
  /** rotação em graus (2 a 8 recomendado) */
  rotate?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** usa fonte display (condensada) */
  display?: boolean;
  shadow?: boolean;
  wobble?: boolean;
}

const sizes = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
  lg: "px-5 py-2 text-lg",
  xl: "px-7 py-3 text-2xl md:text-4xl",
};

/** Etiqueta rotacionada estilo adesivo colado. */
export function Sticker({ children, tone = "yellow", rotate = -4, size = "md", className, display = true, shadow = true, wobble = true }: Props) {
  return (
    <motion.span
      initial={{ rotate, scale: 1 }}
      whileHover={wobble ? { rotate: rotate * -0.6, scale: 1.06 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 14 }}
      className={cn(
        "inline-flex items-center rounded-pill border-2 border-ink font-semibold uppercase tracking-wide select-none",
        display && "font-display tracking-widest",
        shadow && "shadow-sticker",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
