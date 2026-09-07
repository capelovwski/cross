"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryPhoto } from "@/lib/flickr";
import { cn } from "@/lib/utils";

/**
 * Posições do mosaico em desktop (6 colunas × 3 linhas, sem buracos).
 * No mobile o grid tem 3 colunas com fluxo denso.
 */
const layout = [
  "col-span-2 row-span-2 md:col-start-1 md:row-start-1",
  "col-span-1 row-span-1 md:col-start-3 md:row-start-1",
  "col-span-1 row-span-1 md:col-span-2 md:col-start-4 md:row-start-1",
  "col-span-1 row-span-2 md:col-start-6 md:row-start-1",
  "col-span-1 row-span-1 md:col-start-3 md:row-start-2",
  "col-span-2 row-span-1 md:col-start-4 md:row-start-2",
  "col-span-2 row-span-1 md:col-span-3 md:col-start-1 md:row-start-3",
  "col-span-1 row-span-1 md:col-span-3 md:col-start-4 md:row-start-3",
];

export function PhotoMosaic({ photos }: { photos: GalleryPhoto[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid flex-1 grid-flow-dense grid-cols-3 auto-rows-[minmax(90px,1fr)] gap-2 md:grid-cols-6 md:grid-rows-3 md:auto-rows-auto md:gap-3">
      {photos.slice(0, 8).map((p, i) => {
        const inner = (
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-card bg-ink-soft"
            whileHover={reduce ? undefined : { scale: 1.03, rotate: i % 2 ? 1 : -1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              loading={i < 2 ? "eager" : "lazy"}
              unoptimized={p.src.endsWith(".svg")}
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-2 font-mono text-[9px] uppercase tracking-widest text-paper opacity-0 transition-opacity group-hover:opacity-100">
              {p.alt}
            </span>
          </motion.div>
        );
        return (
          <li key={p.src} className={cn("group min-h-0", layout[i % layout.length])}>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`Abrir no Flickr: ${p.alt}`}>
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
