"use client";

/**
 * 04 · PGM: a base do CROSS.
 * Esquerda: o que é + a regra ("pra servir, precisa estar num PGM").
 * Direita: o lema vivido no PGM (Amar → Servir → Transbordar), com a multiplicação animada no último passo.
 */
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { Multiply } from "@/components/fx/Multiply";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { site } from "@/content/site";

export function Pgm() {
  const api = useSectionScroll();
  const { pgm } = site;

  return (
    <SectionShell id="pgm" bg="yellow">
      <div className="grid flex-1 grid-cols-1 items-center gap-5 md:gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Sticker tone="ink" size="sm" rotate={-4}>
              A base do CROSS
            </Sticker>
          </Reveal>
          <Reveal as="h2" delay={0.05} className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="font-display text-[26vw] leading-[0.8] sm:text-[9rem] xl:text-[11rem]">{pgm.short}</span>
            <span className="mb-1 font-display text-2xl leading-[0.95] sm:text-3xl md:mb-3 xl:text-4xl">
              Pequeno Grupo
              <br />
              Multiplicador
            </span>
          </Reveal>
          <Reveal delay={0.15} className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80 md:mt-4 md:text-lg">
            {pgm.pitch}
          </Reveal>
          <Reveal delay={0.25} className="mt-4 rotate-[-1deg] rounded-card-lg border-2 border-ink bg-ink p-4 text-paper shadow-sticker md:mt-5 md:p-5">
            <p className="font-display text-2xl leading-none text-yellow md:text-3xl">{pgm.rule}</p>
            <p className="mt-2 hidden text-sm leading-snug text-paper/80 sm:block">{pgm.ruleDetail}</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-6 lg:gap-5">
          <Reveal className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">No PGM, o lema vira prática</Reveal>
          <Stagger className="relative flex flex-col" delay={0.15}>
            <span className="absolute bottom-8 left-6 top-8 w-0.5 bg-ink/15" aria-hidden />
            {pgm.steps.map((s, i) => {
              const last = i === pgm.steps.length - 1;
              return (
                <StaggerItem key={s.verb} className="relative flex items-center gap-4 py-2 md:py-3">
                  {last ? (
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-red">
                      <Multiply className="size-10" dotClassName="size-4 -ml-2 -mt-2 border-2 border-ink bg-yellow" />
                    </span>
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper font-mono text-sm font-bold">
                      0{i + 1}
                    </span>
                  )}
                  <div>
                    <p className="font-display text-3xl leading-none md:text-4xl">{s.verb}</p>
                    <p className="mt-1 max-w-md text-xs leading-snug text-ink/75 md:text-base">{s.text}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal delay={0.4} className="flex flex-wrap items-center gap-3">
            <PillButton tone="ink" size="md" href="#faca-parte" onClick={() => api?.goTo("faca-parte")}>
              Quero entrar num PGM
            </PillButton>
            <button type="button" onClick={() => api?.goTo("faq")} className="font-mono text-[11px] uppercase tracking-widest text-ink/70 hover:text-ink">
              Dúvidas sobre PGM →
            </button>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
