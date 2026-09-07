"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sticker } from "@/components/ui/Sticker";
import type { Product } from "@/content/products";
import { brl, cn } from "@/lib/utils";

const brandTone: Record<Product["brand"], "ink" | "red" | "blue"> = { cross: "ink", up: "red", go: "blue" };

export function ProductCard({ p, i }: { p: Product; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-card-lg bg-white shadow-float">
        <span className="absolute left-3 top-3 z-10">
          <Sticker tone={brandTone[p.brand]} size="sm" rotate={i % 2 ? 4 : -5}>
            {p.brand.toUpperCase()}
          </Sticker>
        </span>
        {p.soldOut && (
          <span className="absolute right-3 top-3 z-10">
            <Sticker tone="white" size="sm" rotate={3}>
              Esgotado
            </Sticker>
          </span>
        )}
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.04]", p.soldOut && "opacity-60")}
            unoptimized={p.image.endsWith(".svg")}
          />
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">{p.category}</p>
          <h3 className="font-display text-2xl leading-none">{p.name}</h3>
        </div>
        <p className="font-display text-2xl text-red">{brl(p.price)}</p>
      </div>
      <p className="mt-1 text-sm text-ink/70">{p.description}</p>
      {(p.sizes || p.colors) && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink/50">
          {p.sizes && <>Tam. {p.sizes.join(" · ")}</>}
          {p.sizes && p.colors && " · "}
          {p.colors && p.colors.join(" · ")}
        </p>
      )}
      <p className="mt-3 inline-flex items-center gap-2 self-start rounded-pill bg-yellow-soft px-3 py-1 text-xs font-semibold text-ink">
        <span className="size-1.5 rounded-full bg-red" aria-hidden />
        Compra presencial nos encontros e eventos
      </p>
    </motion.article>
  );
}
