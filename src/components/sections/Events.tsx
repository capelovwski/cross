"use client";

import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { events, type CrossEvent } from "@/content/events";
import { cn, isPlaceholder } from "@/lib/utils";

const toneClass: Record<CrossEvent["tone"], string> = {
  ink: "bg-ink text-paper",
  red: "bg-red text-white",
  blue: "bg-blue text-white",
  yellow: "bg-yellow text-ink",
  paper: "bg-paper text-ink border-2 border-dashed border-ink/30",
};

const badgeTone: Record<CrossEvent["status"], "yellow" | "white" | "ink" | "paper"> = {
  open: "yellow",
  soon: "white",
  tbd: "white",
  paused: "ink",
};

function EventCard({ ev, i }: { ev: CrossEvent; i: number }) {
  const paused = ev.status === "paused";
  const rot = [-1.2, 1, -0.8, 1.4, -1][i % 5];
  return (
    <StaggerItem className="h-full w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-auto">
      <article
        className={cn(
          "grain group relative flex h-full flex-col justify-between rounded-card-lg p-4 pt-6 shadow-float transition-transform duration-300 hover:-translate-y-1 md:p-5 md:pt-7",
          toneClass[ev.tone],
          paused && "opacity-80",
        )}
        style={{ rotate: `${rot}deg` }}
      >
        <span className="absolute -top-3 right-4 z-10">
          <Sticker tone={badgeTone[ev.status]} size="sm" rotate={i % 2 ? 4 : -5}>
            {ev.badge}
          </Sticker>
        </span>
        <div>
          <p className={cn("font-mono text-[10px] uppercase tracking-widest opacity-70")}>
            {ev.tribe === "cross" ? "UP + GO" : ev.tribe.toUpperCase()}
          </p>
          <h3 className="font-display mt-1 break-words text-3xl leading-[0.9] xl:text-4xl">{ev.name}</h3>
          <p className="mt-2 text-xs font-semibold leading-snug opacity-90 md:text-sm">{ev.tagline}</p>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed opacity-80">{ev.description}</p>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          <p className={cn("font-mono text-[11px] uppercase tracking-widest", paused ? "line-through opacity-60" : "opacity-90")}>{ev.dateLabel}</p>
          {ev.cta && !paused ? (
            <PillButton
              tone={ev.tone === "yellow" || ev.tone === "paper" ? "ink" : "yellow"}
              size="sm"
              href={isPlaceholder(ev.cta.href) ? "#whatsapp" : ev.cta.href}
              className="self-start"
            >
              {ev.cta.label}
            </PillButton>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              {paused ? "volta no próximo ano" : "fica de olho no WhatsApp"}
            </span>
          )}
        </div>
      </article>
    </StaggerItem>
  );
}

export function Events() {
  return (
    <SectionShell id="eventos" bg="paper" align="top">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <Reveal as="h2" className="font-display text-5xl leading-[0.9] sm:text-6xl md:text-7xl">
          O que vem por aí
        </Reveal>
        <Reveal delay={0.1} className="max-w-sm text-sm text-ink/70 md:text-base">
          Acampamentos, retiros e a conferência do ano. Bota na agenda e chama a galera.
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-ink/50 lg:hidden">← deslize pro lado →</span>
        </Reveal>
      </div>
      <Stagger className="-mx-5 flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 pt-3 no-scrollbar md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0 [touch-action:pan-x] lg:[touch-action:auto]">
        {events.map((ev, i) => (
          <EventCard key={ev.id} ev={ev} i={i} />
        ))}
      </Stagger>
    </SectionShell>
  );
}
