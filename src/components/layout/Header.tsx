"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, sections, type SectionId } from "@/content/sections";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface Props {
  /** "home" usa o scroll por seção; "page" navega com âncoras para /#id */
  variant?: "home" | "page";
}

export function Header({ variant = "home" }: Props) {
  const api = useSectionScroll();
  const [open, setOpen] = useState(false);

  const activeId = api ? sections[api.index]?.id : undefined;
  const dark = variant === "home" && ["o-que-e", "up", "go", "calendario", "contato"].includes(activeId ?? "");
  // com rolagem livre (desktop) o header passa por cima do conteúdo: ganha fundo translúcido
  const solid = variant === "page" || api?.mode === "native";

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
        className="relative block h-7 w-[7.2rem] md:h-8 md:w-[8.2rem]"
        aria-label="CROSS, início"
      >
        <Logo name="cross-black" priority sizes="140px" className={cn("absolute inset-0 h-full w-full object-contain transition-opacity duration-500", dark ? "opacity-0" : "opacity-100")} alt="" />
        <Logo name="cross-white" priority sizes="140px" className={cn("absolute inset-0 h-full w-full object-contain transition-opacity duration-500", dark ? "opacity-100" : "opacity-0")} alt="" />
      </Link>

      <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={linkFor(item)}
            onClick={(e) => {
              if (item.id && variant === "home" && api) {
                e.preventDefault();
                go(item.id);
              }
            }}
            className={cn(
              "rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors",
              item.id && item.id === activeId ? (dark ? "bg-paper/15" : "bg-ink/10") : "hover:bg-current/10",
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
          href={variant === "home" ? "#whatsapp" : "/#whatsapp"}
          onClick={() => variant === "home" && go("whatsapp")}
        >
          Entrar no grupo
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
              <PillButton tone="yellow" size="lg" href="#whatsapp" onClick={() => go("whatsapp")}>
                Entrar no grupo
              </PillButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
