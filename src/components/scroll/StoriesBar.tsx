"use client";

/** Barra de progresso segmentada no topo (só mobile), como nos stories. */
import { sections } from "@/content/sections";
import { useSectionScroll } from "./ScrollContext";
import { cn } from "@/lib/utils";

export function StoriesBar() {
  const api = useSectionScroll();
  if (!api) return null;
  return (
    <div className="pointer-events-none fixed inset-x-3 top-[calc(env(safe-area-inset-top,0px)+6px)] z-[60] flex gap-1 md:hidden" aria-hidden>
      {sections.map((s, i) => (
        <span
          key={s.id}
          className={cn(
            "h-[3px] flex-1 rounded-full transition-colors duration-500",
            i < api.index ? "bg-current opacity-50" : i === api.index ? "bg-yellow" : "bg-current opacity-15",
          )}
        />
      ))}
    </div>
  );
}
