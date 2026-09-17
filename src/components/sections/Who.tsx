"use client";

/**
 * 03 · Quem somos: a juventude como um todo.
 * O CROSS é um só; dentro dele existem duas tribos (UP e GO), e as duas
 * funcionam do mesmo jeito: com PGMs. O diagrama à direita mostra essa estrutura.
 * As logos ficam numa linha própria (fora do parágrafo) para não quebrar a entrelinha.
 */
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { LogoBox } from "@/components/ui/Logo";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const timeline = [
  { y: "[ANO]", t: "Nasce o ministério de jovens da IBB" }, // PLACEHOLDER
  { y: "[ANO]", t: "Primeiro acampamento" }, // PLACEHOLDER
  { y: "[ANO]", t: "UP e GO viram tribos do CROSS" }, // PLACEHOLDER
  { y: "2027", t: "Conferência Flechas" },
];

export function Who() {
  const api = useSectionScroll();
  const { up, go } = site.tribes;

  return (
    <SectionShell id="quem-somos" bg="paper">
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-[1fr_auto] md:gap-4">
        {/* texto principal */}
        <Reveal className="flex flex-col justify-between gap-3 rounded-card-lg bg-ink p-4 text-paper shadow-float md:col-span-3 md:gap-4 md:p-7">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-4xl leading-[0.9] sm:text-5xl xl:text-6xl">
                Uma juventude,
                <br />
                <span className="text-yellow">duas tribos</span>
              </h2>
              <span className="hidden sm:block">
                <Sticker tone="yellow" size="sm" rotate={6}>
                  Quem somos
                </Sticker>
              </span>
            </div>
            {/* RASCUNHO: aprovar texto */}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/85 md:text-base xl:text-lg xl:leading-relaxed">
              O CROSS é a juventude da IBB: adolescentes e jovens de 13 a 29 anos, liderados por uma equipe que caminha junto de
              cada um. Dentro dele existem duas tribos, cada uma com a linguagem da sua fase.
            </p>
          </div>
          {/* tribos: linha própria, logos em caixas de altura fixa */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {([up, go] as const).map((t) => {
              const isUp = t.id === "up";
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => api?.goTo(t.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-card p-3 text-left transition-transform md:p-4",
                    isUp ? "-rotate-1 border-2 border-paper bg-red shadow-[3px_4px_0_0_#f3f0e8] hover:-rotate-2" : "border border-paper/20 bg-blue hover:scale-[1.02]",
                  )}
                >
                  <LogoBox name={isUp ? "up-white" : "go-white"} boxClassName="h-8 w-full md:h-10" />
                  <span className="text-xs text-white/90 md:text-sm">
                    {t.audience} · {t.ages}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* estrutura: CROSS → UP / GO → PGMs */}
        <Reveal delay={0.1} className="flex flex-col justify-between gap-3 rounded-card-lg border-2 border-ink/10 bg-white p-4 shadow-float md:col-span-3 md:gap-4 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">Como a gente se organiza</p>
          <div className="flex flex-col items-center">
            <LogoBox name="cross-black" boxClassName="h-7 w-28 md:h-9 md:w-36" className="object-center" />
            <span className="h-4 w-px bg-ink/25 md:h-5" aria-hidden />
            <div className="relative grid w-full max-w-sm grid-cols-2">
              <span className="absolute left-1/4 right-1/4 top-0 h-px bg-ink/25" aria-hidden />
              {([up, go] as const).map((t) => {
                const isUp = t.id === "up";
                return (
                  <div key={t.id} className="flex flex-col items-center">
                    <span className="h-4 w-px bg-ink/25 md:h-5" aria-hidden />
                    <span
                      className={cn(
                        "grid h-11 w-24 place-items-center rounded-card md:h-14 md:w-28",
                        isUp ? "-rotate-2 border-2 border-ink bg-red shadow-sticker" : "bg-blue",
                      )}
                    >
                      <LogoBox name={isUp ? "up-white" : "go-white"} boxClassName="h-6 w-14 md:h-8 md:w-16" className="object-center" />
                    </span>
                    <span className="h-4 w-px bg-ink/25 md:h-5" aria-hidden />
                    <Stagger className="flex gap-1.5" delay={0.3}>
                      {[0, 1, 2, 3].map((d) => (
                        <StaggerItem key={d}>
                          <span className={cn("block size-4 rounded-full md:size-5", isUp ? "border-2 border-ink bg-yellow" : "border-2 border-blue bg-white")} />
                        </StaggerItem>
                      ))}
                    </Stagger>
                    <span className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/60">PGMs</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="max-w-xs text-sm leading-snug text-ink/75 md:text-base">
              UP e GO funcionam do mesmo jeito: com <strong className="font-semibold text-ink">PGMs</strong>, os Pequenos Grupos Multiplicadores.
            </p>
            <button type="button" onClick={() => api?.goTo("pgm")} className="font-mono text-[11px] uppercase tracking-widest text-red hover:underline">
              Entender o PGM →
            </button>
          </div>
        </Reveal>

        {/* linha do tempo */}
        <Reveal delay={0.2} className="hidden items-center gap-6 overflow-x-auto no-scrollbar rounded-card border-2 border-ink/10 bg-white px-5 py-3 shadow-float md:col-span-6 md:flex">
          {timeline.map((t, i) => (
            <div key={i} className="flex shrink-0 items-baseline gap-2">
              <span className="font-display text-xl text-red">{t.y}</span>
              <span className="max-w-[12rem] text-xs leading-tight text-ink/75">{t.t}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}
