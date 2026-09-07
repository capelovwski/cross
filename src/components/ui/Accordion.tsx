"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

interface Item {
  q: string;
  a: string;
}

interface Props {
  items: Item[];
  className?: string;
  /** abre o primeiro item por padrão */
  defaultOpen?: number | null;
}

/** Accordion de FAQ: linha com pergunta + ícone "+" que vira "×". */
export function Accordion({ items, className, defaultOpen = null }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <li
            key={item.q}
            className={cn(
              "rounded-card border-2 border-ink/10 bg-white shadow-float transition-colors",
              isOpen && "border-ink",
            )}
          >
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-7 md:py-5"
              >
                <span className="text-base font-semibold leading-snug md:text-lg">{item.q}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full bg-ink text-yellow transition-transform duration-300",
                    isOpen && "rotate-45 bg-yellow text-ink",
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  key="panel"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75 md:px-7 md:pb-6 md:text-base">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
