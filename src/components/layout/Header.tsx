"use client";

/**
 * Header: barra sólida flutuante de alto contraste.
 * A cor da barra é sempre a que mais contrasta com a seção atual (ver `headerThemes`), e cada
 * troca de seção passa uma onda líquida pela barra (LiquidFill). O texto troca de cor quando a
 * onda cruza o meio da barra, para nunca ficar ilegível durante a transição.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { headerThemes, navItems, sections, type SectionId } from "@/content/sections";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { LiquidFill } from "./LiquidFill";

interface Props {
  /** "home" usa o scroll por seção; "page" navega com âncoras para /#id */
  variant?: "home" | "page";
}

/**
 * momento em que a borda da onda da cor final cruza o meio da barra:
 * atraso 140 ms + ~47% de 850 ms com o easing (0.65, 0, 0.35, 1). A cor do texto troca de uma vez
 * nesse instante (sem transição), para não existir quadro com texto apagado.
 */
const TEXT_SWAP_MS = 540;

export function Header({ variant = "home" }: Props) {
  const api = useSectionScroll();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const index = variant === "home" && api ? api.index : 0;
  const activeId: SectionId | undefined = variant === "home" && api ? sections[index]?.id : undefined;
  const target = activeId ? headerThemes[activeId] : { bg: "paper" as const, wave: "yellow" as const };

  // tema aplicado ao conteúdo (texto, logo, botões): acompanha a onda com um pequeno atraso
  const [shown, setShown] = useState(target.bg);
  useEffect(() => {
    const t = setTimeout(() => setShown(target.bg), reduce ? 0 : TEXT_SWAP_MS);
    return () => clearTimeout(t);
  }, [target.bg, reduce]);

  const dark = shown === "ink";

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const go = (id: SectionId) => {
    setOpen(false);
    if (api && variant === "home") api.goTo(id);
  };

  const linkFor = (item: (typeof navItems)[number]) => {
    if (item.href) return item.href;
    return variant === "home" ? `#${item.id}` : `/#${item.id}`;
  };

  return (
    <header
      className={cn(
        "fixed inset-x-3 top-[calc(env(safe-area-inset-top,0px)+14px)] z-50 flex h-11 items-center justify-between rounded-2xl px-3",
        "shadow-[0_14px_34px_-16px_rgba(11,11,12,0.6)]",
        "md:inset-x-6 md:top-4 md:h-16 md:rounded-[22px] md:px-5 lg:inset-x-8",
        dark ? "text-paper" : "text-ink",
      )}
    >
      <LiquidFill index={index} color={target.bg} wave={target.wave} className="z-[41] rounded-[inherit]" />

      <Link
        href="/"
        onClick={(e) => {
          if (variant === "home" && api) {
            e.preventDefault();
            go("inicio");
          }
        }}
        className="relative z-[42] block h-6 w-[6.4rem] md:h-8 md:w-[8.2rem]"
        aria-label="CROSS, início"
      >
        <Logo name="cross-black" priority sizes="140px" className={cn("absolute inset-0 h-full w-full object-contain", dark ? "opacity-0" : "opacity-100")} alt="" />
        <Logo name="cross-white" priority sizes="140px" className={cn("absolute inset-0 h-full w-full object-contain", dark ? "opacity-100" : "opacity-0")} alt="" />
      </Link>

      <nav aria-label="Principal" className="relative z-[42] hidden items-center gap-1 lg:flex">
        {navItems.map((item) => {
          const active = !!item.id && item.id === activeId;
          return (
            <Link
              key={item.label}
              href={linkFor(item)}
              onClick={(e) => {
                if (item.id && variant === "home" && api) {
                  e.preventDefault();
                  go(item.id);
                }
              }}
              aria-current={active ? "true" : undefined}
              className={cn(
                "rounded-pill px-3 py-1.5 text-sm font-semibold",
                active ? (dark ? "bg-yellow text-ink" : "bg-ink text-paper") : dark ? "hover:bg-paper/15" : "hover:bg-ink/10",
                item.href && "font-mono text-xs uppercase tracking-widest",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative z-[42] flex items-center gap-2">
        <PillButton
          tone={dark ? "yellow" : "ink"}
          size="sm"
          href={variant === "home" ? "#faca-parte" : "/#faca-parte"}
          onClick={() => variant === "home" && go("faca-parte")}
        >
          Encontrar um PGM
        </PillButton>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className={cn("hidden size-10 place-items-center rounded-full border-2 md:grid lg:hidden", dark ? "border-paper/50" : "border-ink/40")}
        >
          <span className="relative block h-3 w-5">
            <span className={cn("absolute inset-x-0 top-0 h-0.5 bg-current transition-transform", open && "translate-y-[5px] rotate-45")} />
            <span className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform", open && "-translate-y-[5px] -rotate-45")} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grain fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-8 pt-28 text-paper lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={item.label}>
                  <Link
                    href={linkFor(item)}
                    onClick={(e) => {
                      if (item.id && variant === "home" && api) {
                        e.preventDefault();
                        go(item.id);
                      } else setOpen(false);
                    }}
                    className="flex items-baseline gap-3 py-2 font-display text-4xl tracking-wide"
                  >
                    <span className="font-mono text-xs text-yellow">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <PillButton tone="yellow" size="lg" href="#faca-parte" onClick={() => go("faca-parte")}>
                Encontrar um PGM
              </PillButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
