"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { FINE_POINTER, useMediaQuery } from "@/lib/useMediaQuery";
import { SectionShell } from "./SectionShell";
import { PillButton } from "@/components/ui/PillButton";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/site";
import { useSectionScroll } from "@/components/scroll/ScrollContext";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Hero() {
  const api = useSectionScroll();
  const reduce = useReducedMotion();
  const fine = useMediaQuery(FINE_POINTER) && !reduce;

  // posição do mouse normalizada (-1..1) com mola → inclina a logo e desloca a fita
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);
  const logoX = useTransform(sx, [-1, 1], [-18, 18]);
  const logoY = useTransform(sy, [-1, 1], [-12, 12]);
  const tapeX = useTransform(sx, [-1, 1], [26, -26]);
  const tapeY = useTransform(sy, [-1, 1], [14, -14]);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, mx, my]);

  return (
    <SectionShell id="inicio" bg="paper">
      <div className="relative flex flex-1 flex-col justify-center">
        {/* fita vermelha atrás do nome */}
        <motion.div
          initial={reduce ? false : { opacity: 0, rotate: -8, scaleX: 0.6 }}
          animate={{ opacity: 1, rotate: -3, scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-[24%] z-0 w-[130vw] bg-red py-1.5 text-yellow shadow-float sm:top-[34%] md:top-[38%] md:py-3"
          style={{ x: fine ? tapeX : 0, y: fine ? tapeY : 0, marginLeft: "-65vw" }}
          aria-hidden
        >
          <Marquee items={["ADOLESCENTES", "JOVENS", "IBB", "UP 13–17", "GO 18–29", "SEXTA 20H", "SÁBADO 20H"]} />
        </motion.div>

        {/* nome */}
        <div className="relative z-10 flex flex-col items-center text-center" style={{ perspective: 1200 }}>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={cn("m-0 w-[82vw] max-w-[860px] sm:w-[70vw] lg:w-[58vw]", !fine && !reduce && "animate-float")}
            style={fine ? { rotateX, rotateY, x: logoX, y: logoY, transformStyle: "preserve-3d" } : undefined}
          >
            <Logo name="cross-home" priority sizes="(max-width: 640px) 82vw, (max-width: 1024px) 70vw, 860px" className="w-full drop-shadow-[0_18px_30px_rgba(11,11,12,0.25)]" alt="CROSS — adolescentes e jovens da IBB" />
          </motion.h1>
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
