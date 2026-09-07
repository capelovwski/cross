import { cn } from "@/lib/utils";

interface Props {
  items: string[];
  className?: string;
  separator?: string;
  /** quantas vezes a lista se repete em cada metade do trilho (cobre telas largas) */
  repeat?: number;
}

/**
 * Faixa de texto rolando infinitamente (estilo fita adesiva).
 * O trilho é composto por duas metades idênticas; a animação desloca -50%
 * e reinicia: como as metades são iguais, a emenda é invisível.
 */
export function Marquee({ items, className, separator = "✦", repeat = 3 }: Props) {
  const row = items.flatMap((t) => [t, separator]);
  const half = Array.from({ length: repeat }, () => row).flat();
  const track = [...half, ...half];
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div className="marquee-track inline-flex w-max gap-6 pr-6">
        {track.map((t, i) => (
          <span key={i} className="font-display text-xl md:text-2xl">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
