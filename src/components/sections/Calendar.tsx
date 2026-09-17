"use client";

/**
 * Agenda: a seção vira um "app de calendário" na identidade do CROSS.
 *  - Moldura estilo janela (bolinhas vermelha/azul/amarela), mês em Anton gigante,
 *    grade dom→sáb com barras de eventos distribuídas em faixas (multi-dia atravessa
 *    a semana) e os encontros semanais UP (sex) e GO (sáb) como chips recorrentes.
 *  - Barra lateral (desktop): evento selecionado em destaque + próximos + toda semana.
 *  - Mobile: grade compacta com pontinhos e a lista do mês embaixo.
 * As datas vêm de `src/content/events.ts`; o "hoje" é calculado no cliente.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { PillButton } from "@/components/ui/PillButton";
import { useSectionState } from "@/components/scroll/ScrollContext";
import { weekly, type CrossEvent, type Tribe } from "@/content/events";
import { MONTHS_LONG, WEEKDAYS, dated, eventsInMonth, formatRange, monthGrid, nextEvent, toIso, undated, type CalBar } from "@/lib/calendar";
import { cn, isPlaceholder } from "@/lib/utils";

const dot: Record<Tribe, string> = { up: "bg-red", go: "bg-blue", cross: "bg-yellow" };
const solid: Record<Tribe, string> = { up: "bg-red text-white", go: "bg-blue text-white", cross: "bg-yellow text-ink" };
const soft: Record<Tribe, string> = {
  up: "bg-red/20 text-red-soft ring-1 ring-inset ring-red/40",
  go: "bg-blue/25 text-blue-soft ring-1 ring-inset ring-blue/50",
  cross: "bg-yellow/20 text-yellow ring-1 ring-inset ring-yellow/40",
};
const cardTone: Record<CrossEvent["tone"], string> = {
  ink: "bg-paper text-ink",
  red: "bg-red text-white",
  blue: "bg-blue text-white",
  yellow: "bg-yellow text-ink",
  paper: "bg-paper/10 text-paper ring-1 ring-inset ring-paper/20",
};
const tribeLabel = (t: Tribe) => (t === "cross" ? "UP + GO" : t.toUpperCase());

const EASE = [0.22, 1, 0.36, 1] as const;

function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

const noop = () => () => {};

export function Calendar() {
  const reduce = useReducedMotion();
  const section = useSectionState();
  // "hoje" só existe no cliente (a página é pré-renderizada; a data do build não vale)
  const todayIso = useSyncExternalStore(noop, () => toIso(new Date()), () => null);
  const [cursorState, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [selectedState, setSelectedId] = useState<string | null>(null);
  // até o usuário mexer: mês de hoje e o próximo evento selecionado
  const cursor = useMemo(
    () => cursorState ?? (todayIso ? { y: Number(todayIso.slice(0, 4)), m: Number(todayIso.slice(5, 7)) - 1 } : null),
    [cursorState, todayIso],
  );
  const selectedId = selectedState ?? (todayIso ? (nextEvent(todayIso)?.id ?? null) : null);

  const weeks = useMemo(() => (cursor && todayIso ? monthGrid(cursor.y, cursor.m, todayIso) : []), [cursor, todayIso]);
  const inMonth = useMemo(() => (cursor ? eventsInMonth(cursor.y, cursor.m) : []), [cursor]);
  const selected = useMemo(() => (selectedId ? dated.find((e) => e.id === selectedId) ?? undated.find((e) => e.id === selectedId) ?? null : null), [selectedId]);
  const upcoming = useMemo(() => (todayIso ? dated.filter((e) => (e.end ?? e.start) >= todayIso) : dated), [todayIso]);
  const isToday = cursor && todayIso ? todayIso.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`) : true;

  const move = (delta: number) => {
    if (!cursor) return;
    setDir(delta > 0 ? 1 : -1);
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };
  const goToday = () => {
    if (!todayIso) return;
    const [y, m] = todayIso.split("-").map(Number);
    setDir(cursor && (y < cursor.y || (y === cursor.y && m - 1 < cursor.m)) ? -1 : 1);
    setCursor({ y, m: m - 1 });
  };
  const select = (ev: CrossEvent) => {
    setSelectedId(ev.id);
    if (ev.start) {
      const [y, m] = ev.start.split("-").map(Number);
      if (cursor && (y !== cursor.y || m - 1 !== cursor.m)) {
        setDir(y > cursor.y || (y === cursor.y && m - 1 > cursor.m) ? 1 : -1);
        setCursor({ y, m: m - 1 });
      }
    }
  };

  // ← → trocam o mês enquanto a seção está ativa (desktop)
  useEffect(() => {
    if (section && !section.active) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.active, cursor]);

  const monthKey = cursor ? `${cursor.y}-${cursor.m}` : "loading";
  const monthName = cursor ? MONTHS_LONG[cursor.m] : "";

  return (
    <SectionShell id="calendario" bg="ink" align="top" fit="screen" className="min-h-0">
      <Reveal from="scale" className="flex min-h-0 flex-1 flex-col">
        {/* ---------- moldura estilo janela ---------- */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card-lg border border-paper/10 bg-ink-soft/70 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm">
          {/* barra de título */}
          <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-3 py-2 md:px-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5" aria-hidden>
                <i className="size-2.5 rounded-full bg-red" />
                <i className="size-2.5 rounded-full bg-blue" />
                <i className="size-2.5 rounded-full bg-yellow" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">agenda.cross</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-paper/60">
              <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-red" /> UP</span>
              <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-blue" /> GO</span>
              <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-yellow" /> UP + GO</span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
            {/* ---------- calendário ---------- */}
            <div className="flex min-h-0 flex-col lg:border-r lg:border-paper/10">
              {/* toolbar: mês gigante + navegação */}
              <div className="flex items-end justify-between gap-3 px-3 pb-2 pt-3 md:px-5 md:pt-4">
                <div className="flex items-baseline gap-2 overflow-hidden md:gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {cursor && (
                    <motion.h2
                      key={monthKey}
                      initial={reduce ? false : { y: dir * 28, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={reduce ? undefined : { y: dir * -28, opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="font-display text-4xl leading-none text-yellow sm:text-5xl md:text-6xl xl:text-7xl"
                    >
                      {monthName}
                    </motion.h2>
                    )}
                  </AnimatePresence>
                  <span className="font-mono text-xs tracking-widest text-paper/50 md:text-sm">{cursor?.y ?? ""}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Mês anterior"
                    className="grid size-8 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-yellow hover:text-yellow md:size-9"
                  >
                    <Chevron dir={-1} />
                  </button>
                  <button
                    type="button"
                    onClick={goToday}
                    className={cn(
                      "h-8 rounded-pill px-3 font-mono text-[10px] uppercase tracking-widest transition-colors md:h-9 md:px-4",
                      isToday ? "bg-yellow text-ink" : "border border-paper/20 text-paper/80 hover:border-yellow hover:text-yellow",
                    )}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Próximo mês"
                    className="grid size-8 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-yellow hover:text-yellow md:size-9"
                  >
                    <Chevron dir={1} />
                  </button>
                </div>
              </div>

              {/* cabeçalho dos dias */}
              <div className="grid grid-cols-7 border-b border-paper/10 px-1 md:px-2">
                {WEEKDAYS.map((w, i) => (
                  <span
                    key={w}
                    className={cn(
                      "py-1.5 text-center font-mono text-[10px] uppercase tracking-widest md:py-2",
                      i === 5 ? "text-red" : i === 6 ? "text-blue" : "text-paper/45",
                    )}
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* grade do mês */}
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {cursor && (
                  <motion.div
                    key={monthKey}
                    initial={reduce ? false : { x: dir * 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={reduce ? undefined : { x: dir * -40, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="grid h-full min-h-0 px-1 pb-1 md:px-2 md:pb-2"
                    style={{ gridTemplateRows: `repeat(${Math.max(weeks.length, 1)}, minmax(0, 1fr))` }}
                    role="grid"
                    aria-label={cursor ? `${monthName} de ${cursor.y}` : "Calendário"}
                  >
                    {weeks.map((week, wi) => (
                      <div key={week.key} className="relative grid min-h-0 grid-cols-7" role="row">
                        {week.days.map((d) => (
                          <div
                            key={d.iso}
                            role="gridcell"
                            aria-label={d.iso}
                            className={cn(
                              "min-h-0 border-paper/10 px-1 pt-1 md:px-1.5 md:pt-1.5",
                              wi > 0 && "border-t",
                              d.weekday > 0 && "border-l",
                              !d.inMonth && "bg-paper/[0.025]",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-grid size-6 place-items-center rounded-full font-mono text-[11px] md:size-7 md:text-xs",
                                d.today ? "bg-yellow font-bold text-ink" : d.inMonth ? "text-paper/85" : "text-paper/25",
                              )}
                            >
                              {d.day}
                            </span>
                            {/* pontinhos (mobile) */}
                            <span className="mt-0.5 flex h-2 items-center gap-0.5 md:hidden" aria-hidden>
                              {d.dots.slice(0, 3).map((t, i) => (
                                <i key={i} className={cn("size-1.5 rounded-full", dot[t], !d.inMonth && "opacity-30")} />
                              ))}
                            </span>
                          </div>
                        ))}

                        {/* barras (md+) */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0.5 top-8 hidden auto-rows-[1.25rem] grid-cols-7 gap-y-0.5 overflow-hidden md:grid xl:top-9 xl:auto-rows-[1.5rem] xl:gap-y-1">
                          {week.bars.map((b) => (
                            <Bar key={b.key} bar={b} selected={b.event?.id === selectedId} onSelect={select} dimmed={!week.days[b.col].inMonth && b.kind === "weekly"} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* mobile: lista do mês */}
              <div className="border-t border-paper/10 px-3 py-3 lg:hidden">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper/50">Neste mês</p>
                {inMonth.length ? (
                  <ul className="flex flex-col gap-2">
                    {inMonth.map((ev) => (
                      <li key={ev.id} className="flex items-center gap-2 text-sm">
                        <i className={cn("size-2 shrink-0 rounded-full", dot[ev.tribe])} />
                        <span className="font-mono text-[11px] uppercase tracking-widest text-paper/60">{formatRange(ev.start, ev.end)}</span>
                        <span className="font-semibold">{ev.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-paper/60">Nenhum evento grande. Toda sexta tem UP e todo sábado tem GO, 20h.</p>
                )}
              </div>
            </div>

            {/* ---------- barra lateral (desktop) ---------- */}
            <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain p-4 no-scrollbar lg:flex xl:p-5">
              <AnimatePresence mode="wait" initial={false}>
                {selected ? (
                  <motion.article
                    key={selected.id}
                    initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn("grain relative rounded-card p-4 shadow-float", cardTone[selected.tone])}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                      {tribeLabel(selected.tribe)} · {selected.badge}
                    </p>
                    <h3 className="font-display mt-1 text-3xl leading-[0.9]">{selected.name}</h3>
                    <p className="mt-1.5 text-xs font-semibold leading-snug opacity-90">{selected.tagline}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-widest opacity-80">{selected.dateLabel}</p>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed opacity-80">{selected.description}</p>
                    {selected.cta && selected.status !== "paused" && (
                      <PillButton
                        tone={selected.tone === "yellow" || selected.tone === "ink" ? "ink" : "yellow"}
                        size="sm"
                        href={isPlaceholder(selected.cta.href) ? "#faq" : selected.cta.href}
                        className="mt-3"
                      >
                        {selected.cta.label}
                      </PillButton>
                    )}
                  </motion.article>
                ) : null}
              </AnimatePresence>

              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-paper/50">Próximos</p>
                <ul className="flex flex-col">
                  {upcoming.map((ev) => (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => select(ev)}
                        aria-pressed={ev.id === selectedId}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-paper/10",
                          ev.id === selectedId && "bg-paper/10",
                        )}
                      >
                        <i className={cn("size-2 shrink-0 rounded-full", dot[ev.tribe])} />
                        <span className="w-[4.6rem] shrink-0 font-mono text-[10px] uppercase tracking-widest text-paper/60">{formatRange(ev.start, ev.end)}</span>
                        <span className="truncate text-sm font-semibold">{ev.name}</span>
                      </button>
                    </li>
                  ))}
                  {undated.map((ev) => (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => select(ev)}
                        aria-pressed={ev.id === selectedId}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-paper/60 transition-colors hover:bg-paper/10",
                          ev.id === selectedId && "bg-paper/10",
                        )}
                      >
                        <i className={cn("size-2 shrink-0 rounded-full opacity-60", dot[ev.tribe])} />
                        <span className="w-[4.6rem] shrink-0 font-mono text-[10px] uppercase tracking-widest">{ev.status === "paused" ? "pausa" : "a definir"}</span>
                        <span className="truncate text-sm font-semibold">{ev.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-paper/50">Toda semana</p>
                <ul className="flex flex-col gap-1.5">
                  {weekly.map((w) => (
                    <li key={w.tribe} className={cn("flex items-center justify-between rounded-lg px-3 py-2", solid[w.tribe])}>
                      <span className="font-display text-xl">{w.tribe.toUpperCase()}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-yellow">{w.when}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-paper/40">Salão de Cultos da IBB · sem encontro em feriados</p>
              </div>
            </aside>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function Bar({ bar, selected, dimmed, onSelect }: { bar: CalBar; selected: boolean; dimmed: boolean; onSelect: (ev: CrossEvent) => void }) {
  const style = { gridColumn: `${bar.col + 1} / span ${bar.span}`, gridRow: bar.lane + 1 };
  const shape = cn(!bar.startsHere && "rounded-l-none", !bar.endsHere && "rounded-r-none");
  if (bar.kind === "weekly") {
    return (
      <span
        style={style}
        className={cn("mx-0.5 truncate rounded-md px-1.5 font-mono text-[10px] uppercase leading-[1.25rem] tracking-wider xl:leading-[1.5rem]", soft[bar.tribe], dimmed && "opacity-30")}
        title={bar.label}
      >
        {bar.label}
      </span>
    );
  }
  return (
    <button
      type="button"
      style={style}
      onClick={() => bar.event && onSelect(bar.event)}
      aria-pressed={selected}
      className={cn(
        "pointer-events-auto mx-0.5 truncate rounded-md px-2 text-left text-[11px] font-semibold leading-[1.25rem] transition-[filter,box-shadow] hover:brightness-110 xl:leading-[1.5rem]",
        solid[bar.tribe],
        shape,
        selected && "ring-2 ring-paper",
      )}
      title={bar.label}
    >
      {!bar.startsHere && <span aria-hidden>‹ </span>}
      {bar.label}
      {!bar.endsHere && <span aria-hidden> ›</span>}
    </button>
  );
}
