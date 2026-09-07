import { cn } from "@/lib/utils";

interface Props {
  num: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Marcador de capítulo no canto: [01 CROSS] */
export function SectionLabel({ num, label, tone = "dark", className }: Props) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] md:text-xs uppercase tracking-[0.18em]",
        tone === "dark" ? "text-ink/70" : "text-paper/70",
        className,
      )}
    >
      <span aria-hidden>[</span>
      <span className="mx-1 font-bold">{num}</span>
      {label}
      <span aria-hidden>]</span>
    </p>
  );
}
