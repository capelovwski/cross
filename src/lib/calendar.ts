import { events, weekly, type CrossEvent, type Tribe } from "@/content/events";

export const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const MONTHS_LONG = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export interface CalDay {
  iso: string; // 2026-10-08
  day: number;
  weekday: number; // 0 = dom
  inMonth: boolean;
  today: boolean;
  /** cores dos pontinhos (mobile): eventos + encontros semanais do dia */
  dots: Tribe[];
}

/** Uma barra dentro de uma semana (grade de 7 colunas). */
export interface CalBar {
  key: string;
  kind: "event" | "weekly";
  tribe: Tribe;
  label: string;
  col: number; // 0..6
  span: number; // 1..7
  lane: number; // linha dentro da semana
  startsHere: boolean;
  endsHere: boolean;
  event?: CrossEvent;
}

export interface CalWeek {
  key: string;
  days: CalDay[];
  bars: CalBar[];
}

export function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Eventos com data (ordenados por início). */
export const dated = events.filter((e): e is CrossEvent & { start: string } => Boolean(e.start)).sort((a, b) => (a.start < b.start ? -1 : 1));
export const undated = events.filter((e) => !e.start);

/** Próximo evento datado a partir de `todayIso` (ou o último, se todos já passaram). */
export function nextEvent(todayIso: string) {
  return dated.find((e) => (e.end ?? e.start) >= todayIso) ?? dated[dated.length - 1] ?? null;
}

/**
 * Grade do mês (semanas de domingo a sábado), com as barras de eventos já
 * distribuídas em "faixas" (lanes) para não se sobreporem, como num app de calendário.
 */
export function monthGrid(year: number, month: number, todayIso: string): CalWeek[] {
  const first = new Date(year, month, 1);
  const gridStart = addDays(first, -first.getDay());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeksCount = Math.ceil((first.getDay() + daysInMonth) / 7);

  const weeks: CalWeek[] = [];
  for (let w = 0; w < weeksCount; w++) {
    const days: CalDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(gridStart, w * 7 + i);
      const iso = toIso(d);
      const dots: Tribe[] = [];
      for (const ev of dated) if (iso >= ev.start && iso <= (ev.end ?? ev.start)) dots.push(ev.tribe);
      for (const wk of weekly) if (wk.weekday === d.getDay()) dots.push(wk.tribe);
      days.push({ iso, day: d.getDate(), weekday: d.getDay(), inMonth: d.getMonth() === month, today: iso === todayIso, dots });
    }
    const weekStart = days[0].iso;
    const weekEnd = days[6].iso;

    // segmentos de eventos que cruzam esta semana
    const items: Omit<CalBar, "lane">[] = [];
    for (const ev of dated) {
      const end = ev.end ?? ev.start;
      if (ev.start > weekEnd || end < weekStart) continue;
      const col = Math.max(0, days.findIndex((d) => d.iso === ev.start));
      const endCol = end > weekEnd ? 6 : days.findIndex((d) => d.iso === end);
      items.push({
        key: `${ev.id}-${weekStart}`,
        kind: "event",
        tribe: ev.tribe,
        label: ev.name,
        col,
        span: endCol - col + 1,
        startsHere: ev.start >= weekStart,
        endsHere: end <= weekEnd,
        event: ev,
      });
    }
    // encontros semanais (recorrentes)
    for (const wk of weekly) {
      items.push({
        key: `${wk.tribe}-${weekStart}`,
        kind: "weekly",
        tribe: wk.tribe,
        label: `${wk.tribe.toUpperCase()} · ${wk.time}`,
        col: wk.weekday,
        span: 1,
        startsHere: true,
        endsHere: true,
      });
    }
    // distribui em faixas: quem começa antes (e é mais longo) fica em cima
    items.sort((a, b) => a.col - b.col || b.span - a.span || (a.kind === "event" ? -1 : 1));
    const laneEnd: number[] = []; // última coluna ocupada em cada faixa
    const bars: CalBar[] = items.map((it) => {
      let lane = laneEnd.findIndex((e) => e < it.col);
      if (lane === -1) lane = laneEnd.length;
      laneEnd[lane] = it.col + it.span - 1;
      return { ...it, lane };
    });
    weeks.push({ key: weekStart, days, bars });
  }
  return weeks;
}

/** "8–11 out" · "6 fev" · "27 dez – 2 jan" */
export function formatRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start + "T12:00:00");
  const e = end ? new Date(end + "T12:00:00") : s;
  const sameMonth = s.getMonth() === e.getMonth();
  if (!end || s.getTime() === e.getTime()) return `${s.getDate()} ${MONTHS[s.getMonth()]}`;
  return sameMonth ? `${s.getDate()}–${e.getDate()} ${MONTHS[s.getMonth()]}` : `${s.getDate()} ${MONTHS[s.getMonth()]} – ${e.getDate()} ${MONTHS[e.getMonth()]}`;
}

/** Eventos datados dentro de um mês (por início ou fim). */
export function eventsInMonth(year: number, month: number) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  return dated.filter((e) => e.start.slice(0, 7) === key || (e.end ?? e.start).slice(0, 7) === key);
}
