import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { weekly } from "@/content/events";
import { buildCalendar, formatRange } from "@/lib/calendar";
import { cn } from "@/lib/utils";

const tribeDot: Record<string, string> = { up: "bg-red", go: "bg-blue", cross: "bg-yellow" };

export function Calendar() {
  const { months, undated } = buildCalendar(new Date(), 12);
  const withEvents = months.filter((m) => m.items.length);

  return (
    <SectionShell id="calendario" bg="ink" align="top">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Reveal as="h2" className="font-display text-4xl leading-[0.9] text-yellow sm:text-6xl md:text-7xl">
          Agenda
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-paper/60">
          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-red" /> UP</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-blue" /> GO</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-yellow" /> UP + GO</span>
        </Reveal>
      </div>

      {/* régua de 12 meses */}
      <Reveal delay={0.1} className="mb-4 grid grid-cols-6 gap-1 md:mb-5 md:grid-cols-12 md:gap-2">
        {months.map((m) => (
          <div
            key={m.key}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 font-mono text-[10px] uppercase tracking-widest md:gap-1 md:py-2",
              m.items.length ? "border-yellow bg-yellow text-ink" : "border-paper/15 text-paper/50",
            )}
          >
            <span>{m.short}</span>
            <span className="text-[9px] opacity-70">{String(m.year).slice(2)}</span>
          </div>
        ))}
      </Reveal>

      <div className="grid flex-1 grid-cols-1 gap-3 md:gap-4 lg:grid-cols-12 lg:gap-6">
        {/* semanal */}
        <Stagger className="flex flex-col gap-2 md:gap-3 lg:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/60">Toda semana</p>
          {weekly.map((w) => (
            <StaggerItem key={w.tribe} className={cn("rounded-card p-3 text-white shadow-float md:p-4", w.tribe === "up" ? "bg-red" : "bg-blue")}>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl md:text-4xl">{w.label.split(" · ")[0]}</span>
                <span className="font-display text-lg text-yellow md:text-2xl">{w.when}</span>
              </div>
              <p className="mt-1 text-xs opacity-85 md:text-sm">
                {w.label.split(" · ")[1]} · {w.place}
              </p>
            </StaggerItem>
          ))}
          <div className="mt-auto hidden lg:block">
            <Sticker tone="paper" size="sm" rotate={-3}>
              Sem encontro em feriados
            </Sticker>
          </div>
        </Stagger>

        {/* lista por mês */}
        <Stagger className="flex flex-col gap-2 lg:col-span-8" delay={0.15}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/60">Eventos · próximos 12 meses</p>
          <ol className="flex flex-col divide-y divide-paper/10">
            {withEvents.map((m) => (
              <StaggerItem key={m.key}>
                <li className="grid grid-cols-[4rem_1fr] items-start gap-3 py-2 md:grid-cols-[6rem_1fr] md:py-3">
                  <span className="font-display text-2xl leading-none text-yellow md:text-4xl">
                    {m.short}
                    <span className="block font-mono text-[10px] tracking-widest text-paper/50">{m.year}</span>
                  </span>
                  <ul className="flex flex-col gap-2">
                    {m.items.map((ev) => (
                      <li key={ev.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <i className={cn("size-2 rounded-full", tribeDot[ev.tribe])} />
                        <span className="font-mono text-xs uppercase tracking-widest text-paper/70">{formatRange(ev.start, ev.end)}</span>
                        <span className="font-semibold">{ev.name}</span>
                        <span className="hidden text-sm text-paper/60 sm:inline">· {ev.tagline}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              </StaggerItem>
            ))}
            {undated.length > 0 && (
              <StaggerItem>
                <li className="grid grid-cols-[4.5rem_1fr] items-start gap-3 py-3 md:grid-cols-[6rem_1fr]">
                  <span className="font-display text-2xl leading-none text-paper/40">?</span>
                  <ul className="flex flex-col gap-2">
                    {undated.map((ev) => (
                      <li key={ev.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/70">
                        <i className={cn("size-2 rounded-full", tribeDot[ev.tribe])} />
                        <span className="font-semibold">{ev.name}</span>
                        <span className="font-mono text-xs uppercase tracking-widest">{ev.dateLabel}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              </StaggerItem>
            )}
          </ol>
        </Stagger>
      </div>
    </SectionShell>
  );
}
