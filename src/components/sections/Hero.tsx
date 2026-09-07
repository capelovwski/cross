"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionShell } from "./SectionShell";
import { PillButton } from "@/components/ui/PillButton";
import { Sticker } from "@/components/ui/Sticker";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/site";
import { useSectionScroll } from "@/components/scroll/ScrollContext";

export function Hero() {
  const api = useSectionScroll();
  const reduce = useReducedMotion();

  return (
    <SectionShell id="inicio" bg="paper">
      <div className="relative flex flex-1 flex-col justify-center">
        {/* fita vermelha atrás do nome */}
        <motion.div
          initial={reduce ? false : { opacity: 0, rotate: -8, scaleX: 0.6 }}
          animate={{ opacity: 1, rotate: -3, scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-[24%] z-0 w-[130vw] -translate-x-1/2 bg-red py-1.5 text-yellow shadow-float sm:top-[34%] md:top-[38%] md:py-3"
          aria-hidden
        >
          <Marquee items={["ADOLESCENTES", "JOVENS", "IBB", "UP 13–17", "GO 18–29", "SEXTA 20H", "SÁBADO 20H"]} />
        </motion.div>

        {/* nome */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[26vw] leading-[0.85] text-ink md:text-[19vw] lg:text-[16rem] xl:text-[18rem]"
          >
            CROSS
          </motion.h1>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 14 }}
              className="pointer-events-auto absolute -left-1 top-[8%] md:left-[6%] md:top-[4%]"
            >
              <Sticker tone="red" rotate={-8} size="lg">
                UP
              </Sticker>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 260, damping: 14 }}
              className="pointer-events-auto absolute -right-1 bottom-[8%] md:right-[6%] md:bottom-[4%]"
            >
              <Sticker tone="blue" rotate={6} size="lg">
                GO
              </Sticker>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="relative z-10 mx-auto mt-6 flex max-w-2xl flex-col items-center gap-5 text-center md:mt-8"
        >
          <p className="text-balance text-lg font-medium leading-snug text-ink/80 md:text-2xl">{site.tagline}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PillButton tone="yellow" size="lg" href="#whatsapp" onClick={() => api?.goTo("whatsapp")}>
              Fazer parte
            </PillButton>
            <PillButton tone="outline" size="lg" href="#eventos" onClick={() => api?.goTo("eventos")}>
              Ver eventos
            </PillButton>
          </div>
        </motion.div>
      </div>

      {/* estatísticas */}
      <div className="relative z-10 mt-6 flex flex-col gap-4 border-t-2 border-ink/10 pt-5 md:mt-4 md:flex-row md:items-end md:justify-between">
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
          {site.stats.map((s) => (
            <div key={s.label} className="min-w-[7rem]">
              <dt className="order-2 text-xs text-ink/60 md:text-sm">{s.label}</dt>
              <dd className="text-3xl font-semibold leading-none tracking-tight md:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 md:text-right">
          {site.church} · {site.city}
          <br />
          role pra descobrir ↓
        </p>
      </div>
    </SectionShell>
  );
}
