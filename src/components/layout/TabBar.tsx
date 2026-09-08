"use client";

/**
 * Barra de abas fixa no rodapé (só mobile): navegação estilo app.
 * A aba "Mais" abre um bottom sheet com todas as seções e a Cross Store.
 */
import Link from "next/link";
import { useState } from "react";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { sections, type SectionId } from "@/content/sections";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LogoBox } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const Icon = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
  go: <path d="M5 12h14M12 5l7 7-7 7" />,
  events: <path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4" />,
  more: <path d="M4 7h16M4 12h16M4 17h16" />,
};

const tabs: { id: SectionId | "more"; label: string; icon: keyof typeof Icon }[] = [
  { id: "inicio", label: "Início", icon: "home" },
  { id: "up", label: "UP", icon: "up" },
  { id: "go", label: "GO", icon: "go" },
  { id: "eventos", label: "Eventos", icon: "events" },
  { id: "more", label: "Mais", icon: "more" },
];

interface Props {
  variant?: "home" | "page";
}

export function TabBar({ variant = "home" }: Props) {
  const api = useSectionScroll();
  const [more, setMore] = useState(false);
  const activeId = api ? sections[api.index]?.id : undefined;

  const go = (id: SectionId) => {
    setMore(false);
    if (api && variant === "home") api.goTo(id);
    else window.location.href = `/#${id}`;
  };

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-paper/10 bg-ink/85 text-paper backdrop-blur-xl pb-safe md:hidden"
      >
        <ul className="grid grid-cols-5">
          {tabs.map((t) => {
            const active = t.id !== "more" && t.id === activeId && !more;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => (t.id === "more" ? setMore((m) => !m) : go(t.id))}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                    active || (t.id === "more" && more) ? "text-yellow" : "text-paper/60",
                  )}
                >
                  <span className={cn("grid size-7 place-items-center rounded-full transition-colors", (active || (t.id === "more" && more)) && "bg-yellow/15")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {Icon[t.icon]}
                    </svg>
                  </span>
                  {t.label}
                </button>
              </li>
            );
          })}
        </ul>
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
