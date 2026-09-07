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
  sizes?: string;
  alt?: string;
}

/**
 * Logo com proporção preservada. Controle o tamanho pela ALTURA (ex.: `h-10`)
 * para que logos de proporções diferentes (UP é larga, GO é quase quadrada)
 * fiquem visualmente equilibradas lado a lado.
 */
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

/**
 * Caixa de altura fixa para alinhar logos em cards/listas: a logo cabe dentro
 * da caixa (object-contain) alinhada à esquerda, sem mudar a altura do card.
 */
export function LogoBox({ name, className, boxClassName, alt, sizes = "200px" }: Props & { boxClassName?: string }) {
  const l = logos[name];
  return (
    <span className={cn("relative block", boxClassName ?? "h-10 w-32")}>
      <Image src={l.src} alt={alt ?? l.alt} fill sizes={sizes} className={cn("object-contain object-left select-none", className)} draggable={false} />
    </span>
  );
}
