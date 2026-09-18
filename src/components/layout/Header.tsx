"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { darkSections, navItems, sections, type SectionId } from "@/content/sections";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";
import { CrossMark } from "@/components/ui/CrossMark";
import { GooIndicator } from "@/components/ui/GooIndicator";

interface Props {
  /** "home" usa o scroll por seção; "page" navega com âncoras para /#id */
  variant?: "home" | "page";
}

export function Header({ variant = "home" }: Props) {
  const api = useSectionScroll();
  const [open, setOpen] = useState(false);

  const activeId = api ? sections[api.index]?.id : undefined;
  const dark = variant === "home" && !!activeId && darkSections.includes(activeId);
  // com rolagem livre (desktop) o header passa por cima do conteúdo: ganha fundo translúcido
  const solid = variant === "page" || api?.mode === "native";

  // botão do menu que representa a seção ativa (calendário fica sob "Eventos")
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navId = activeId === "calendario" ? "eventos" : activeId;
  const activeNav = variant === "home" ? navItems.findIndex((n) => n.id && n.id === navId) : -1;

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
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 md:px-8 md:py-5 transition-colors duration-500",
        dark ? "text-paper" : "text-ink",
        solid && "border-b backdrop-blur-md md:py-3",
        solid && (dark ? "border-paper/10 bg-ink/80" : "border-ink/10 bg-paper/85"),
      )}
    >
      <Link
        href="/"
        onClick={(e) => {
          if (variant === "home" && api) {
            e.preventDefault();
            go("inicio");
          }
        }}
        className="block h-7 md:h-9"
        aria-label="CROSS, início"
      >
        {/* no header a logo é sempre monocromática: só as letras, na cor que contrasta com a seção */}
        <CrossMark letters={dark ? "#f3f0e8" : "#0b0b0c"} className="h-full" />
      </Link>

      <nav ref={navRef} aria-label="Principal" className="relative hidden items-center gap-1 lg:flex">
        {/* pílula líquida da seção ativa: alto contraste com o fundo da seção */}
        <GooIndicator containerRef={navRef} getItem={(i) => itemRefs.current[i]} activeIndex={activeNav} color={dark ? "#ffc91f" : "#0b0b0c"} />
        {navItems.map((item, i) => (
          <Link
            key={item.label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            aria-current={i === activeNav ? "true" : undefined}
            href={linkFor(item)}
            onClick={(e) => {
              if (item.id && variant === "home" && api) {
                e.preventDefault();
                go(item.id);
              }
            }}
            className={cn(
              "relative z-10 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors duration-200",
              i === activeNav ? (dark ? "text-ink delay-150" : "text-paper delay-150") : "hover:opacity-70",
              item.href && "font-mono text-xs uppercase tracking-widest",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <PillButton
          tone="yellow"
          size="sm"
          className="hidden sm:inline-flex"
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
          className={cn(
            "hidden size-10 place-items-center rounded-full border-2 md:grid lg:hidden",
            dark ? "border-paper/40" : "border-ink/30",
          )}
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
            className="grain fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-8 pt-24 text-paper lg:hidden"
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
