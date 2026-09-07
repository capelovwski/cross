import { SectionLabel } from "@/components/ui/SectionLabel";
import { sections, type SectionId } from "@/content/sections";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Bg = "paper" | "ink" | "blue" | "red" | "yellow" | "white";

const bgs: Record<Bg, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-paper grain-light",
  blue: "bg-blue text-white grain-light",
  red: "bg-red text-white grain-light",
  yellow: "bg-yellow text-ink",
};

interface Props {
  id: SectionId;
  bg?: Bg;
  children: ReactNode;
  className?: string;
  /** conteúdo alinhado ao topo (default) ou centralizado verticalmente */
  align?: "top" | "center";
}

/** Casca padrão de uma seção: fundo, grão, padding e o marcador [NN LABEL] fixo no canto. */
export function SectionShell({ id, bg = "paper", children, className, align = "center" }: Props) {
  const meta = sections.find((s) => s.id === id)!;
  const light = bg === "ink" || bg === "blue" || bg === "red";
  return (
    <div className={cn("grain relative flex min-h-full w-full flex-col px-5 pb-6 pt-20 md:px-10 md:pb-8 md:pt-24 lg:px-14", bgs[bg])}>
      <SectionLabel num={meta.num} label={meta.label} tone={light ? "light" : "dark"} className="relative z-10 mb-4 md:mb-6" />
      <div className={cn("relative z-10 flex w-full flex-1 flex-col", align === "center" && "justify-center", className)}>{children}</div>
    </div>
  );
}
