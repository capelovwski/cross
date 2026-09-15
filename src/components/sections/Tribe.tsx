"use client";

/**
 * Seção de tribo. Mesma identidade (paleta, fontes, pílulas), duas linguagens:
 *  - UP (13–17): "sticker bomb" — etiquetas tortas, cards como adesivos com sombra dura,
 *    fita amarela rolando, CTA amarelo. Tudo um pouco mais alto e mais rápido.
 *  - GO (18–29): editorial — rótulos em mono, filetes finos, destaques numerados,
 *    tabela de horário, vídeo mais cinematográfico, CTA em contorno. Mais ar, mais calma.
 */
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { Marquee } from "@/components/ui/Marquee";
import { site, type TribeId } from "@/content/site";
import { cn, isPlaceholder } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  tribe: TribeId;
}

export function Tribe({ tribe }: Props) {
  const t = site.tribes[tribe];
  const isUp = tribe === "up";
  const link = isUp ? site.links.whatsappUp : site.links.whatsappGo;
  const placeholder = isPlaceholder(link);
  const href = placeholder ? "#whatsapp" : link;
  const desktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  // vídeo de fundo só em telas md+ e sem reduce-motion (no mobile nem baixa)
  const showVideo = desktop && !reduce;
  const videoRef = useRef<HTMLVideoElement>(null);

  // toca só enquanto a seção está na tela (dois vídeos 1080p decodificando fora da tela pesam no scroll)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [showVideo]);

  const video = isUp
    ? { src: "/video/bg-up.mp4", poster: "/video/bg-up-poster.webp", cls: "opacity-45 grayscale contrast-125", tint: "bg-red/65", vignette: "radial-gradient(ellipse at center, transparent 35%, rgba(181,22,26,0.7) 100%)" }
    : {
        src: "/video/bg-go.mp4",
        poster: "/video/bg-go-poster.webp",
        cls: "opacity-30 grayscale",
        tint: "bg-blue-deep/70",
        // GO: mais cinematográfico, escurece para o preto na base
        vignette: "linear-gradient(180deg, rgba(18,55,158,0.2) 0%, rgba(11,11,12,0.55) 100%), radial-gradient(ellipse at center, transparent 30%, rgba(11,11,12,0.6) 100%)",
      };

  const day = t.day.replace("Toda ", "").replace("Todo ", "");

  return (
    <SectionShell
      id={t.id}
      bg={isUp ? "red" : "blue"}
      backdrop={
        showVideo && (
          <>
            <video ref={videoRef} className={cn("h-full w-full object-cover", video.cls)} src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" />
            <div className={`absolute inset-0 ${video.tint}`} />
            <div className="absolute inset-0" style={{ background: video.vignette }} />
          </>
        )
      }
    >
      {isUp ? (
        /* ============================== UP ============================== */
        <div className="relative grid flex-1 grid-cols-1 items-center gap-4 md:gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7">
            <Reveal className="flex flex-wrap items-center gap-2">
              <Sticker tone="yellow" size="md" rotate={-6}>
                {t.audience}
              </Sticker>
              <Sticker tone="white" size="sm" rotate={5}>
                {t.ages}
              </Sticker>
            </Reveal>
            <Reveal as="h2" delay={0.05} className="mt-3 h-[28vw] max-h-[11rem] sm:h-[10rem] lg:h-[16rem] xl:h-[19rem]">
              <motion.div
                className="h-full"
                animate={reduce ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Logo name="up-white" sizes="(max-width: 640px) 62vw, 420px" className="h-full w-auto drop-shadow-[8px_10px_0_rgba(11,11,12,0.45)]" alt={`${t.name}, ${t.audience} ${t.ages}`} />
              </motion.div>
            </Reveal>
            <Reveal delay={0.15} className="mt-2 font-display text-3xl leading-[0.95] md:mt-3 md:text-5xl xl:text-6xl">
              {t.motto.split(" ").map((w, i) => (
                <span key={w} className={cn("mr-3 inline-block", i === 1 ? "text-yellow" : "text-white", i === 2 && "rotate-[-2deg]")}>
                  {w}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.2} className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white md:mt-4 md:text-lg xl:text-xl">
              {t.pitch}
            </Reveal>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 lg:col-span-5">
            {/* horário como adesivo colado */}
            <Reveal delay={0.1} className="rotate-[-1.5deg] rounded-card-lg border-2 border-ink bg-paper p-4 text-ink shadow-sticker md:p-6">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60">Quando</p>
                  <p className="font-display text-2xl leading-none text-red md:text-4xl">{day}</p>
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

            {/* o que rola: cada card é um adesivo */}
            <Stagger className="grid grid-cols-2 gap-2.5 md:gap-3" delay={0.2}>
              {t.highlights.map((h, i) => {
                const tones = ["bg-yellow text-ink", "bg-white text-ink", "bg-ink text-yellow", "bg-paper text-ink"];
                const rots = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
                return (
                  <StaggerItem key={h.title} className={cn("rounded-card border-2 border-ink p-3 shadow-sticker md:p-4", tones[i % 4], rots[i % 4])}>
                    <p className="font-display text-xl leading-none md:text-2xl">{h.title}</p>
                    <p className="mt-1 hidden text-xs leading-snug opacity-80 sm:block md:text-sm">{h.text}</p>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <Reveal delay={0.35} className="flex flex-wrap items-center gap-3">
              <PillButton tone="yellow" size="md" href={href}>
                Entrar no grupo {t.name}
              </PillButton>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">{placeholder ? "link do grupo em breve" : "abre no WhatsApp"}</span>
            </Reveal>
          </div>

          {/* fita amarela cruzando a base (desktop) */}
          <div className="pointer-events-none absolute -bottom-10 left-1/2 hidden w-[120vw] -translate-x-1/2 rotate-[-2deg] bg-yellow py-1.5 text-ink shadow-float md:block" aria-hidden>
            <Marquee items={["Sexta 20h", "13 a 17 anos", "Salão de Cultos da IBB", "Traz um amigo", "Levanta. Cresce. Sobe."]} separator="★" />
          </div>
        </div>
      ) : (
        /* ============================== GO ============================== */
        <div className="grid flex-1 grid-cols-1 items-center gap-5 md:gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-yellow">
              <span className="h-px w-8 bg-yellow/70" aria-hidden />
              {t.audience} · {t.ages}
            </Reveal>
            <Reveal as="h2" delay={0.05} className="mt-4 h-[24vw] max-h-[9.5rem] sm:h-[9rem] lg:h-[12rem] xl:h-[14rem]">
              <Logo name="go-white" sizes="(max-width: 640px) 55vw, 380px" className="h-full w-auto drop-shadow-[0_24px_40px_rgba(11,11,12,0.45)]" alt={`${t.name}, ${t.audience} ${t.ages}`} />
            </Reveal>
            <Reveal delay={0.15} className="mt-4 font-mono text-xs uppercase tracking-[0.32em] text-white/70 md:mt-5 md:text-sm">
              {t.motto}
            </Reveal>
            <Reveal delay={0.2} className="mt-3 max-w-xl text-base leading-relaxed text-white/90 md:mt-4 md:text-lg xl:max-w-2xl xl:text-xl xl:leading-relaxed">
              {t.pitch}
            </Reveal>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-5">
            {/* horário como tabela com filetes */}
            <Reveal delay={0.1} className="grid grid-cols-3 border-t border-white/25">
              {[
                ["Quando", day],
                ["Horário", t.time],
                ["Onde", t.place],
              ].map(([k, v], i) => (
                <div key={k} className={cn("py-3 pr-3 md:py-4", i > 0 && "border-l border-white/15 pl-3 md:pl-4")}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">{k}</p>
                  <p className={cn("mt-1 leading-none", i < 2 ? "font-display text-2xl md:text-4xl" : "text-sm font-medium leading-snug text-white/90 md:text-base")}>{v}</p>
                </div>
              ))}
            </Reveal>

            {/* destaques numerados: grade compacta no mobile, lista com filetes no desktop */}
            <Stagger className="grid grid-cols-2 gap-x-4 gap-y-3 md:flex md:flex-col md:gap-0" delay={0.2}>
              {t.highlights.map((h, i) => (
                <StaggerItem key={h.title} className="flex items-baseline gap-3 md:border-b md:border-white/15 md:py-2.5 md:last:border-0">
                  <span className="font-mono text-[11px] text-yellow">0{i + 1}</span>
                  <div>
                    <p className="font-display text-xl leading-none md:text-2xl">{h.title}</p>
                    <p className="mt-1 hidden text-xs leading-snug text-white/65 sm:block md:text-sm">{h.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.35} className="flex flex-wrap items-center gap-4">
              <PillButton tone="outline-light" size="md" href={href}>
                Entrar no grupo {t.name}
              </PillButton>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">{placeholder ? "link em breve" : "abre no WhatsApp"}</span>
            </Reveal>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
