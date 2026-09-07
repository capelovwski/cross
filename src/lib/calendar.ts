import { events, type CrossEvent } from "@/content/events";

export interface CalendarMonth {
  key: string; // 2026-10
  label: string; // out 2026
  short: string; // OUT
  year: number;
  items: CrossEvent[];
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Meses a partir de `from` (12 meses), com os eventos datados agrupados. */
export function buildCalendar(from = new Date(), span = 12): { months: CalendarMonth[]; undated: CrossEvent[] } {
  const months: CalendarMonth[] = [];
  const start = new Date(from.getFullYear(), from.getMonth(), 1);
  for (let i = 0; i < span; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, short: MONTHS[d.getMonth()].toUpperCase(), year: d.getFullYear(), items: [] });
  }
  const undated: CrossEvent[] = [];
  for (const ev of events) {
    if (!ev.start) {
      undated.push(ev);
      continue;
    }
    const key = ev.start.slice(0, 7);
    const m = months.find((x) => x.key === key);
    if (m) m.items.push(ev);
    else undated.push(ev);
  }
  months.forEach((m) => m.items.sort((a, b) => (a.start! < b.start! ? -1 : 1)));
  return { months, undated };
}

export function formatRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start + "T12:00:00");
  const e = end ? new Date(end + "T12:00:00") : s;
  const sameMonth = s.getMonth() === e.getMonth();
  if (!end || s.getTime() === e.getTime()) return `${s.getDate()} ${MONTHS[s.getMonth()]}`;
  return sameMonth ? `${s.getDate()}–${e.getDate()} ${MONTHS[s.getMonth()]}` : `${s.getDate()} ${MONTHS[s.getMonth()]} – ${e.getDate()} ${MONTHS[e.getMonth()]}`;
}
