"use client";

/**
 * 02 · Nosso lema: Amar. Servir. Transbordar.
 * Três verbos grandes, cada um com uma linha curta de significado, e o versículo-base.
 * A ponte para a seção seguinte é o PGM: é lá que o lema vira prática.
 */
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { site } from "@/content/site";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { Tilt } from "@/components/fx/Tilt";
import { cn } from "@/lib/utils";

const wordColor = ["text-yellow", "text-paper", "text-red"];

export function Lema() {
  const api = useSectionScroll();
  return (
    <SectionShell id="lema" bg="ink">
      <div className="grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 md:mb-5">
            Tudo o que a gente vive cabe em três verbos
          </Reveal>
          <Stagger className="flex flex-col gap-3 md:gap-4">
            {site.lema.map((verb, i) => (
              <StaggerItem key={verb} className="flex items-start gap-3 md:gap-5">
                <span className="mt-1 font-mono text-[11px] text-paper/45 md:mt-3 md:text-xs">0{i + 1}</span>
                <div>
                  <p className={cn("font-display text-[14vw] leading-[0.85] sm:text-7xl xl:text-[6.25rem]", wordColor[i])}>{verb}.</p>
                  <p className="mt-1 max-w-md text-sm leading-snug text-paper/70 md:mt-1.5 md:text-base">{site.lemaCaptions[i]}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
          <Reveal delay={0.2} className="relative">
            <span className="absolute -top-4 left-6 z-10">
              <Sticker tone="yellow" size="sm" rotate={-5}>
                Versículo-base
              </Sticker>
            </span>
            <Tilt max={7} rotate={-1}>
              <blockquote className="grain rounded-card-lg bg-paper p-4 text-ink shadow-float md:p-7">
                <p className="font-mono text-[11px] leading-relaxed md:text-sm">“{site.verse.text}”</p>
                <footer className="mt-3 font-display text-2xl tracking-wide text-red">{site.verse.ref}</footer>
              </blockquote>
            </Tilt>
          </Reveal>
          <Reveal delay={0.35} className="flex flex-col gap-3 md:rounded-card-lg md:border md:border-paper/15 md:p-5">
            <p className="hidden text-sm leading-relaxed text-paper/75 md:block">
              E onde isso acontece na prática? No <strong className="font-semibold text-paper">PGM</strong>, o pequeno grupo que é a base do CROSS.
            </p>
            <PillButton tone="yellow" size="md" className="self-start" href="#pgm" onClick={() => api?.goTo("pgm")}>
              Entender o PGM
            </PillButton>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
