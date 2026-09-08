"use client";

/**
 * "Ilha" de navegação (só mobile), inspirada na Dynamic Island:
 * pílula preta flutuante com as logos; a aba ativa ganha uma bolha amarela
 * que desliza entre os itens e se expande mostrando o nome.
 * A aba "Mais" abre um bottom sheet com todas as seções e a Cross Store.
 */
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { sections, type SectionId } from "@/content/sections";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LogoBox, type LogoName } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type Tab = { id: SectionId | "more"; label: string; logo?: [LogoName, LogoName]; icon?: React.ReactNode; box?: string };

const tabs: Tab[] = [
  { id: "inicio", label: "Início", logo: ["cross-white", "cross-black"], box: "h-4 w-12" },
  { id: "up", label: "UP", logo: ["up-white", "up-black"], box: "h-4 w-8" },
  { id: "go", label: "GO", logo: ["go-white", "go-black"], box: "h-5 w-6" },
  {
    id: "eventos",
    label: "Eventos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "Mais",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  },
];

interface Props {
  variant?: "home" | "page";
}

export function TabBar({ variant = "home" }: Props) {
  const api = useSectionScroll();
  const [more, setMore] = useState(false);
  const reduce = useReducedMotion();
  const activeId = api ? sections[api.index]?.id : undefined;

  const go = (id: SectionId) => {
    setMore(false);
    if (api && variant === "home") api.goTo(id);
    else window.location.href = `/#${id}`;
  };

  // qual aba está "acesa": a seção ativa, ou "Mais" enquanto o sheet estiver aberto
  const lit = more ? "more" : (tabs.find((t) => t.id === activeId)?.id ?? null);

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] z-[70] flex justify-center px-4 md:hidden"
      >
        <LayoutGroup id="island">
          <motion.ul
            layout
            className="flex items-center gap-0.5 rounded-full border border-white/10 bg-ink/90 p-1.5 text-paper shadow-[0_12px_40px_rgba(11,11,12,0.5)] backdrop-blur-xl"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          >
            {tabs.map((t) => {
              const active = lit === t.id;
              return (
                <motion.li key={t.id} layout transition={{ type: "spring", stiffness: 500, damping: 40 }}>
                  <button
                    type="button"
                    onClick={() => (t.id === "more" ? setMore((m) => !m) : go(t.id))}
                    aria-current={active && t.id !== "more" ? "page" : undefined}
                    aria-label={t.label}
                    className={cn(
                      "relative flex h-11 items-center gap-2 rounded-full px-3.5 transition-colors",
                      active ? "text-ink" : "text-paper/75",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="island-bubble"
                        className="absolute inset-0 rounded-full bg-yellow"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center">
                      {t.logo ? <LogoBox name={active ? t.logo[1] : t.logo[0]} boxClassName={t.box} className="object-center" /> : t.icon}
                    </span>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          key="label"
                          initial={reduce ? false : { width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="relative z-10 overflow-hidden whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                        >
                          {t.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </LayoutGroup>
      </nav>

      <BottomSheet open={more} onClose={() => setMore(false)} title="Menu">
        <ul className="flex flex-col divide-y divide-ink/10">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                className={cn("flex w-full items-center gap-4 py-3 text-left", s.id === activeId && "text-red")}
              >
                <span className="font-mono text-xs text-ink/50">{s.num}</span>
                <span className="font-display text-2xl">{s.nav}</span>
                {s.id === activeId && <span className="ml-auto size-2 rounded-full bg-red" aria-hidden />}
              </button>
            </li>
          ))}
          <li>
            <Link href="/store" onClick={() => setMore(false)} className="flex w-full items-center gap-4 py-3">
              <span className="font-mono text-xs text-ink/50">★</span>
              <LogoBox name="store-black-yellow" boxClassName="h-9 w-32" />
            </Link>
          </li>
        </ul>
      </BottomSheet>
    </>
  );
}
