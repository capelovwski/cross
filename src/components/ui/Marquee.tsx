import { cn } from "@/lib/utils";

interface Props {
  items: string[];
  className?: string;
  separator?: string;
}

/** Faixa de texto rolando (estilo fita adesiva). */
export function Marquee({ items, className, separator = "✦" }: Props) {
  const row = items.flatMap((t) => [t, separator]);
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div className="marquee-track inline-flex w-max gap-6 pr-6">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="font-display text-xl md:text-2xl">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
