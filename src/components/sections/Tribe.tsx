"use client";

import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { site, type TribeId } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface Props {
  tribe: TribeId;
}

export function Tribe({ tribe }: Props) {
  const t = site.tribes[tribe];
  const isUp = tribe === "up";
  const link = isUp ? site.links.whatsappUp : site.links.whatsappGo;
  const placeholder = isPlaceholder(link);

  return (
    <SectionShell id={t.id} bg={isUp ? "red" : "blue"}>
      <div className="grid flex-1 grid-cols-1 items-center gap-4 md:gap-6 lg:grid-cols-12 lg:gap-10">
        {/* nome gigante */}
        <div className="relative lg:col-span-6">
          <Reveal>
            <Sticker tone="yellow" size="md" rotate={isUp ? -5 : 4}>
              {t.audience} · {t.ages}
            </Sticker>
          </Reveal>
          <Reveal as="h2" delay={0.05} className="mt-4 h-[28vw] max-h-[11rem] sm:h-[10rem] lg:h-[13rem] xl:h-[14rem]">
            <Logo name={isUp ? "up-white" : "go-white"} sizes="(max-width: 640px) 62vw, 420px" className="h-full w-auto drop-shadow-[6px_8px_0_rgba(11,11,12,0.35)]" alt={`${t.name} — ${t.audience} ${t.ages}`} />
          </Reveal>
          <Reveal delay={0.15} className="mt-1 font-display text-2xl tracking-wide text-white/90 md:mt-2 md:text-4xl">
            {t.motto}
          </Reveal>
          <Reveal delay={0.2} className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:mt-4 md:text-lg">
            {t.pitch}
          </Reveal>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 lg:col-span-6">
          {/* card de horário */}
          <Reveal delay={0.1} className="grain rounded-card-lg bg-paper p-4 text-ink shadow-float md:p-7">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60">Quando</p>
                <p className="font-display text-2xl leading-none md:text-4xl">{t.day.replace("Toda ", "").replace("Todo ", "")}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60">Horário</p>
                <p className="font-display text-2xl leading-none md:text-4xl">{t.time}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60">Onde</p>
                <p className="text-sm font-semibold leading-tight md:text-base">{t.place}</p>
              </div>
            </div>
          </Reveal>

          {/* o que rola */}
          <Stagger className="grid grid-cols-2 gap-2 md:gap-3" delay={0.2}>
            {t.highlights.map((h, i) => (
              <StaggerItem
                key={h.title}
                className={`rounded-card p-3 md:p-4 ${i % 2 === 0 ? "bg-ink/25" : "bg-white/15"} backdrop-blur-[2px]`}
              >
                <p className="font-display text-xl text-yellow md:text-2xl">{h.title}</p>
                <p className="mt-1 hidden text-xs leading-snug text-white/85 sm:block md:text-sm">{h.text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.35} className="flex flex-wrap items-center gap-3">
            {placeholder ? (
              <PillButton tone="ink" size="md" href="#whatsapp">
                Entrar no grupo {t.name}
              </PillButton>
            ) : (
              <PillButton tone="ink" size="md" href={link}>
                Entrar no grupo {t.name}
              </PillButton>
            )}
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/70">
              {placeholder ? "link do grupo em breve" : "abre no WhatsApp"}
            </span>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
