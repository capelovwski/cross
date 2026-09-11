"use client";

import { sections } from "@/content/sections";
import { useSectionScroll } from "./ScrollContext";
import { cn } from "@/lib/utils";

/** Indicador lateral de progresso (bolinhas clicáveis). */
export function SectionNav() {
  const api = useSectionScroll();
  if (!api) return null;
  const active = api.index;
  const onDark = ["o-que-e", "calendario", "contato", "go", "up"].includes(sections[active].id);

  return (
    <nav
      aria-label="Seções da página"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 md:right-5 md:flex"
    >
      {sections.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => api.goTo(i)}
            aria-label={`Ir para ${s.nav}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2 py-0.5"
          >
            <span
              className={cn(
                "pointer-events-none translate-x-1 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                onDark ? "bg-paper text-ink" : "bg-ink text-paper",
              )}
            >
              {s.num} {s.nav}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                isActive ? "h-6 w-2" : "size-2 opacity-50 group-hover:opacity-100",
                isActive ? "bg-yellow" : onDark ? "bg-paper" : "bg-ink",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
