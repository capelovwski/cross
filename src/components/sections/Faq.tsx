"use client";

import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { Accordion } from "@/components/ui/Accordion";
import { faq } from "@/content/faq";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useState } from "react";

export function Faq() {
  const api = useSectionScroll();
  const [all, setAll] = useState(false);
  return (
    <SectionShell id="faq" bg="white" align="top">
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <Sticker tone="yellow" size="sm" rotate={-4}>
              Perguntas frequentes
            </Sticker>
          </Reveal>
          <Reveal as="h2" delay={0.05} className="font-display mt-3 text-5xl leading-[0.88] sm:text-7xl md:text-8xl xl:text-9xl">
            Dúvidas?
            <br />
            <span className="text-red">A gente</span>
            <br />
            responde
          </Reveal>
          <Reveal delay={0.15} className="mt-4 max-w-md text-sm text-ink/70 md:text-base">
            Não achou o que procurava? Manda no grupo do WhatsApp ou fala com um líder no próximo encontro.
          </Reveal>
          <Reveal delay={0.2} className="mt-5 hidden lg:block">
            <PillButton tone="ink" href="#whatsapp" onClick={() => api?.goTo("whatsapp")}>
              Perguntar no WhatsApp
            </PillButton>
          </Reveal>
        </div>
        <div className="min-h-0 lg:col-span-7">
          {/* lista rolável dentro da seção (o motor de scroll respeita a rolagem interna) */}
          {/* desktop: lista completa rolável dentro da seção */}
          <div className="hidden overflow-y-auto overscroll-contain rounded-card-lg pr-1 no-scrollbar md:block lg:max-h-[calc(100dvh-13rem)]">
            <Accordion items={faq} defaultOpen={0} />
          </div>
          {/* mobile: as 3 primeiras + bottom sheet com todas (cabe na tela, estilo app) */}
          <div className="flex flex-col gap-3 md:hidden">
            <Accordion items={faq.slice(0, 3)} />
            <PillButton tone="ink" size="md" className="self-start" onClick={() => setAll(true)}>
              Ver todas as {faq.length} perguntas
            </PillButton>
          </div>
          <BottomSheet open={all} onClose={() => setAll(false)} title="Dúvidas">
            <Accordion items={faq} defaultOpen={0} />
          </BottomSheet>
        </div>
      </div>
    </SectionShell>
  );
}
