"use client";

/**
 * Bottom sheet estilo app: sobe do rodapé, fecha arrastando para baixo,
 * tocando fora ou no botão. Bloqueia o scroll por seção enquanto aberto.
 */
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title} data-sheet>
          <motion.button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[28px] bg-paper text-ink shadow-[0_-20px_60px_rgba(11,11,12,0.35)] pb-safe",
              className,
            )}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            <div className="flex shrink-0 flex-col items-center pt-3">
              <span className="h-1.5 w-12 rounded-full bg-ink/20" aria-hidden />
            </div>
            <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-3">
              {title ? <p className="font-display text-3xl">{title}</p> : <span />}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="grid size-9 place-items-center rounded-full bg-ink text-yellow"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6" data-scroll>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
