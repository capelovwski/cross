"use client";

/** Demonstrações interativas do design system (precisam de estado no cliente). */
import { useRef, useState } from "react";
import { GooIndicator } from "@/components/ui/GooIndicator";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";

const demoItems = ["Quem somos", "PGM", "UP", "GO", "Eventos"];

export function GooDemo({ dark = false }: { dark?: boolean }) {
  const [active, setActive] = useState(1);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={cn("rounded-card p-4", dark ? "bg-ink" : "bg-paper")}>
      <div ref={navRef} className="relative flex flex-wrap items-center gap-1">
        <GooIndicator containerRef={navRef} getItem={(i) => itemRefs.current[i]} activeIndex={active} color={dark ? "#ffc91f" : "#0b0b0c"} />
        {demoItems.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative z-10 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors duration-200",
              i === active ? (dark ? "text-ink delay-150" : "text-paper delay-150") : dark ? "text-paper hover:opacity-70" : "text-ink hover:opacity-70",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-current opacity-60">Clique nos itens para ver a pílula escorrer</p>
    </div>
  );
}

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PillButton tone="ink" size="sm" onClick={() => setOpen(true)}>
        Abrir bottom sheet
      </PillButton>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Exemplo">
        <p className="text-sm text-ink/75">
          Sobe do rodapé, fecha arrastando para baixo, tocando fora ou no X. Usado no menu e no FAQ do celular.
        </p>
        <div className="mt-4">
          <PillButton tone="yellow" size="sm" onClick={() => setOpen(false)}>
            Fechar
          </PillButton>
        </div>
      </BottomSheet>
    </>
  );
}
