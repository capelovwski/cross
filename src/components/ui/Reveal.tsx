"use client";

/**
 * Reveal / Stagger: animações de entrada.
 *
 * Dois comportamentos, decididos pelo estado da seção (ver `useSectionState`):
 *  - `build` (desktop, feed engatado): a coreografia é comandada pela seção.
 *    Quando ela vira a ativa, os elementos "se montam" (subida + blur + escala,
 *    com atraso pequeno depois do trilho começar a andar); quando ela sai,
 *    eles se desmontam rápido, para se montarem de novo na próxima visita.
 *  - fora disso (mobile, /store, reduced motion): fade + slide ao entrar na
 *    viewport, uma vez só.
 */
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useSectionState } from "@/components/scroll/ScrollContext";

type From = "up" | "down" | "left" | "right" | "scale";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p";
  once?: boolean;
  /** de onde o elemento vem na coreografia de construção (desktop) */
  from?: From;
}

const EASE = [0.22, 1, 0.36, 1] as const;
/** atraso base depois que o trilho começa a andar: a seção "chega" e então se monta */
const BUILD_DELAY = 0.16;

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function buildVariants(from: From, delay: number): Variants {
  const start =
    from === "left" ? { x: -56, y: 0 } : from === "right" ? { x: 56, y: 0 } : from === "down" ? { x: 0, y: -44 } : from === "scale" ? { x: 0, y: 12 } : { x: 0, y: 56 };
  return {
    hidden: {
      opacity: 0,
      ...start,
      scale: from === "scale" ? 0.86 : 0.97,
      filter: "blur(10px)",
      transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.95, delay: BUILD_DELAY + delay, ease: EASE },
    },
  };
}

/** Fade + slide ao entrar na viewport (ou coreografia da seção no desktop). */
export function Reveal({ children, delay = 0, y = 28, className, as = "div", once = true, from = "up" }: Props) {
  const reduce = useReducedMotion();
  const section = useSectionState();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  if (section?.build) {
    return (
      <Tag className={className} initial="hidden" animate={section.active ? "show" : "hidden"} variants={buildVariants(from, delay)}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      variants={{ hidden: { ...variants.hidden, y }, show: variants.show }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Container que escalona a entrada dos filhos. */
export function Stagger({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const section = useSectionState();
  if (reduce) return <div className={className}>{children}</div>;
  if (section?.build) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate={section.active ? "show" : "hidden"}
        variants={{
          hidden: { transition: { staggerChildren: 0.02 } },
          show: { transition: { staggerChildren: 0.09, delayChildren: BUILD_DELAY + delay } },
        }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const itemBuildVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(8px)", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.85, ease: EASE } },
};

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const section = useSectionState();
  return (
    <motion.div className={className} variants={section?.build ? itemBuildVariants : itemVariants}>
      {children}
    </motion.div>
  );
}
