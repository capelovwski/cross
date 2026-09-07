"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Tone = "yellow" | "ink" | "paper" | "blue" | "red" | "outline" | "outline-light";

const tones: Record<Tone, string> = {
  yellow: "bg-yellow text-ink hover:bg-yellow-deep",
  ink: "bg-ink text-paper hover:bg-ink-soft",
  paper: "bg-paper text-ink hover:bg-white",
  blue: "bg-blue text-white hover:bg-blue-deep",
  red: "bg-red text-white hover:bg-red-deep",
  outline: "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-paper",
  "outline-light": "bg-transparent text-paper border-2 border-paper hover:bg-paper hover:text-ink",
};

const dots: Record<Tone, string> = {
  yellow: "bg-ink",
  ink: "bg-yellow",
  paper: "bg-red",
  blue: "bg-yellow",
  red: "bg-yellow",
  outline: "bg-red group-hover:bg-yellow",
  "outline-light": "bg-yellow",
};

interface Props {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  external?: boolean;
  type?: ComponentProps<"button">["type"];
  ariaLabel?: string;
}

const sizes = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2.5",
  lg: "px-8 py-4 text-lg gap-3",
};

/** Botão em formato pílula com a bolinha antes do texto. */
export function PillButton({ tone = "yellow", size = "md", href, onClick, children, className, external, type = "button", ariaLabel }: Props) {
  const classes = cn(
    "group inline-flex items-center rounded-pill font-semibold tracking-tight select-none whitespace-nowrap",
    "transition-colors duration-200 focus-visible:outline-yellow",
    tones[tone],
    sizes[size],
    className,
  );
  const inner = (
    <>
      <span
        aria-hidden
        className={cn("inline-block size-2 rounded-full transition-transform duration-300 group-hover:scale-150", dots[tone])}
      />
      <span>{children}</span>
    </>
  );

  const motionProps = { whileHover: { scale: 1.04 }, whileTap: { scale: 0.97 }, transition: { type: "spring" as const, stiffness: 400, damping: 22 } };

  if (href) {
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <motion.a {...motionProps} href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
          {inner}
        </motion.a>
      );
    }
    return (
      <motion.span {...motionProps} className="inline-block">
        <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </Link>
      </motion.span>
    );
  }
  return (
    <motion.button {...motionProps} type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {inner}
    </motion.button>
  );
}
