import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logos oficiais em /public/img/logos (WebP lossless com transparência). */
const logos = {
  "cross-home": { src: "/img/logos/cross-home.webp", w: 1027, h: 375, alt: "CROSS" },
  "cross-black": { src: "/img/logos/cross-black.webp", w: 830, h: 203, alt: "CROSS" },
  "cross-white": { src: "/img/logos/cross-white.webp", w: 830, h: 203, alt: "CROSS" },
  "up-black": { src: "/img/logos/up-black.webp", w: 697, h: 344, alt: "UP" },
  "up-white": { src: "/img/logos/up-white.webp", w: 697, h: 344, alt: "UP" },
  "go-black": { src: "/img/logos/go-black.webp", w: 975, h: 822, alt: "GO" },
  "go-white": { src: "/img/logos/go-white.webp", w: 972, h: 822, alt: "GO" },
  "store-black": { src: "/img/logos/store-black.webp", w: 845, h: 459, alt: "Cross Store" },
  "store-white": { src: "/img/logos/store-white.webp", w: 845, h: 459, alt: "Cross Store" },
  "store-black-yellow": { src: "/img/logos/store-black-yellow.webp", w: 845, h: 459, alt: "Cross Store" },
  "store-white-yellow": { src: "/img/logos/store-white-yellow.webp", w: 845, h: 459, alt: "Cross Store" },
} as const;

export type LogoName = keyof typeof logos;

interface Props {
  name: LogoName;
  className?: string;
  priority?: boolean;
  /** largura em px para o atributo sizes (ajuda o next/image a escolher a versão) */
  sizes?: string;
  alt?: string;
}

export function Logo({ name, className, priority, sizes = "(max-width: 768px) 60vw, 30vw", alt }: Props) {
  const l = logos[name];
  return (
    <Image
      src={l.src}
      alt={alt ?? l.alt}
      width={l.w}
      height={l.h}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto w-auto select-none", className)}
      draggable={false}
    />
  );
}
