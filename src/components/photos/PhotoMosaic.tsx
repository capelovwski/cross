"use client";

/**
 * Mural em linhas justificadas (como no Flickr): em cada linha as fotos dividem a largura na
 * proporção do próprio formato (retrato estreito, paisagem larga) e todas têm a mesma altura.
 * A altura da linha vem da soma dos formatos (aspect-ratio), então as fotos não são cortadas;
 * só quando a tela é baixa um limite de altura entra, e o recorte que sobra puxa para o terço de
 * cima da foto, onde normalmente estão os rostos.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { MuralPhoto } from "@/lib/flickr";
import { cn } from "@/lib/utils";

function Tile({ p, eager, sizes }: { p: MuralPhoto; eager: boolean; sizes: string }) {
  const reduce = useReducedMotion();
  const inner = (
    <motion.div
      className="relative h-full w-full"
      whileHover={reduce ? undefined : { scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: "50% 30%" }}
        loading={eager ? "eager" : "lazy"}
        unoptimized={p.src.endsWith(".svg")}
      />
    </motion.div>
  );
  return (
    <div className="group relative min-w-0 overflow-hidden rounded-card bg-ink-soft" style={{ flexGrow: p.ratio, flexBasis: 0 }}>
      {p.href ? (
        <a href={p.href} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`Abrir álbum no Flickr: ${p.alt}`}>
          {inner}
        </a>
      ) : (
        inner
      )}
      <span
        className={cn(
          "pointer-events-none absolute left-2 top-2 rounded-pill px-2 py-0.5 font-display text-xs tracking-widest text-white",
          p.tribe === "up" ? "-rotate-3 border-2 border-ink bg-red" : "bg-blue",
        )}
      >
        {p.tribe.toUpperCase()}
      </span>
    </div>
  );
}

export function PhotoMural({ desktop, mobile }: { desktop: MuralPhoto[][]; mobile: MuralPhoto[][] }) {
  return (
    <>
      <div className="hidden flex-1 flex-col justify-center gap-3 md:flex">
        {desktop.map((row, r) => (
          <div
            key={r}
            className="flex max-h-[calc((100dvh-16rem)/2)] min-h-[170px] w-full gap-3"
            style={{ aspectRatio: row.reduce((a, p) => a + p.ratio, 0) }}
          >
            {row.map((p, i) => (
              <Tile key={p.id} p={p} eager={r === 0 && i < 3} sizes="(max-width: 1280px) 40vw, 560px" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 md:hidden">
        {mobile.map((row, r) => (
          <div
            key={r}
            className="flex max-h-[calc((100dvh-20rem)/3)] min-h-[130px] w-full gap-2"
            style={{ aspectRatio: row.reduce((a, p) => a + p.ratio, 0) }}
          >
            {row.map((p, i) => (
              <Tile key={p.id} p={p} eager={r === 0 && i < 2} sizes="70vw" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
