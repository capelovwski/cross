"use client";

import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { site } from "@/content/site";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { Logo, LogoBox } from "@/components/ui/Logo";
import { Parallax, Tilt } from "@/components/fx/Tilt";

const chips = ["Encontros semanais", "Acampamentos", "Conferências", "Muita comunhão"];

export function About() {
  const api = useSectionScroll();
  return (
    <SectionShell id="o-que-e" bg="ink">
      <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal as="h2" className="font-display text-[13vw] leading-[0.88] text-yellow sm:text-6xl md:text-7xl xl:text-[5.75rem]">
            Um lugar pra
            <br />
            crescer na <span className="text-paper">fé</span>
          </Reveal>
          <Reveal delay={0.15} className="mt-4 max-w-2xl text-sm leading-snug text-paper/85 md:mt-5 md:text-base md:leading-relaxed xl:text-lg">
            {/* PLACEHOLDER: aprovar texto */}
            CROSS é o ministério de adolescentes e jovens da IBB (Igreja Batista do Bacacheri). Aqui, adolescentes{" "}
            <button type="button" onClick={() => api?.goTo("up")} aria-label="Ir para a seção UP" className="inline-block align-[-0.12em] transition-transform hover:scale-110">
              <Logo name="up-white" sizes="80px" className="inline-block h-[0.95em] w-auto" alt="UP" />
            </button>{" "}
            e jovens{" "}
            <button type="button" onClick={() => api?.goTo("go")} aria-label="Ir para a seção GO" className="inline-block align-[-0.2em] transition-transform hover:scale-110">
              <Logo name="go-white" sizes="80px" className="inline-block h-[1.15em] w-auto" alt="GO" />
            </button>{" "}
            encontram um lugar pra crescer na fé, fazer amizades de verdade e viver a Palavra de Deus na prática, através de
            encontros semanais, acampamentos, conferências e muita comunhão. Se você tem entre 13 e 29 anos, esse é o seu lugar.
          </Reveal>
          <Stagger className="mt-5 hidden flex-wrap gap-2 sm:flex" delay={0.3}>
            {chips.map((c) => (
              <StaggerItem key={c}>
                <span className="inline-block rounded-pill border border-paper/30 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-paper/80">
                  {c}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
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
          <Stagger className="grid grid-cols-2 gap-3" delay={0.4}>
            <StaggerItem>
              <Parallax strength={-8}>
              <button
                type="button"
                onClick={() => api?.goTo("up")}
                className="group flex w-full flex-col items-start rounded-card bg-red p-4 text-left text-white transition-transform hover:-rotate-1 hover:scale-[1.02]"
              >
                <LogoBox name="up-white" boxClassName="h-11 w-full" />
                <span className="mt-1 text-sm opacity-90">Adolescentes · 13 a 17</span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-yellow">Sextas 20h →</span>
              </button>
              </Parallax>
            </StaggerItem>
            <StaggerItem>
              <Parallax strength={10}>
              <button
                type="button"
                onClick={() => api?.goTo("go")}
                className="group flex w-full flex-col items-start rounded-card bg-blue p-4 text-left text-white transition-transform hover:rotate-1 hover:scale-[1.02]"
              >
                <LogoBox name="go-white" boxClassName="h-11 w-full" />
                <span className="mt-1 text-sm opacity-90">Jovens · 18 a 29</span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-yellow">Sábados 20h →</span>
              </button>
              </Parallax>
            </StaggerItem>
          </Stagger>
          <div className="hidden md:block">
            <PillButton tone="outline-light" size="sm" href="#quem-somos" onClick={() => api?.goTo("quem-somos")}>
              Conhecer a comunidade
            </PillButton>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
