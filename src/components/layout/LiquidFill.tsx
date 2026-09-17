"use client";

/**
 * Fundo líquido do header.
 * A cada troca de `index`, duas ondas atravessam a barra: primeiro a cor de destaque (`wave`),
 * logo atrás a cor final (`color`). A borda da onda é uma senoide que ondula enquanto sobe
 * (descendo a página) ou desce (subindo a página). Com reduce-motion a cor só troca.
 */
import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LIQUID_HEX = {
  ink: "#0b0b0c",
  paper: "#f3f0e8",
  yellow: "#ffc91f",
  red: "#e8262a",
  blue: "#1b4fe0",
} as const;
type Hex = keyof typeof LIQUID_HEX;

const W = 1000;
const H = 260; // viewBox: a onda ocupa 2,6× a altura da barra
const EDGE = 22; // distância da borda da onda até o limite do viewBox
const AMP = 12;
const DURATION = 0.85;
const EASE = [0.65, 0, 0.35, 1] as const;

/** Caminho com borda senoidal. dir 1: preenche abaixo da borda (sobe). dir -1: acima (desce). */
function wavePath(phase: number, dir: 1 | -1) {
  const n = 24;
  const edgeY = dir === 1 ? EDGE : H - EDGE;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    const y = edgeY + Math.sin((i / n) * Math.PI * 4 + phase) * AMP;
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return dir === 1 ? `M0 ${H} ${pts.join(" ")} L${W} ${H} Z` : `M0 0 ${pts.join(" ")} L${W} 0 Z`;
}

function Layer({ color, dir, delay, onDone }: { color: string; dir: 1 | -1; delay: number; onDone?: () => void }) {
  // posições em % da altura do próprio svg (2,6× a barra): da borda fora de um lado até fora do outro
  const from = dir === 1 ? "38%" : "-38%";
  const to = dir === 1 ? "-22%" : "22%";
  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute left-0 w-full"
      style={{ height: "260%", top: dir === 1 ? 0 : "auto", bottom: dir === 1 ? "auto" : 0 }}
      initial={{ y: from }}
      animate={{ y: to }}
      transition={{ duration: DURATION, delay, ease: EASE }}
      onAnimationComplete={onDone}
      aria-hidden
    >
      <motion.path
        fill={color}
        initial={{ d: wavePath(0, dir) }}
        animate={{ d: [wavePath(0, dir), wavePath(Math.PI, dir), wavePath(Math.PI * 2, dir)] }}
        transition={{ duration: DURATION, delay, ease: "linear" }}
      />
    </motion.svg>
  );
}

interface WaveRun {
  id: number;
  color: Hex;
  wave: Hex;
  dir: 1 | -1;
}

interface Props {
  /** índice da seção ativa: mudou → onda */
  index: number;
  color: Hex;
  wave: Hex;
  className?: string;
}

export function LiquidFill({ index, color, wave, className }: Props) {
  const reduce = useReducedMotion();
  const [base, setBase] = useState<Hex>(color);
  const [runs, setRuns] = useState<WaveRun[]>([]);
  const [prevIndex, setPrevIndex] = useState(index);

  // ajuste de estado durante a renderização quando o índice muda (padrão recomendado pelo React)
  if (index !== prevIndex) {
    setPrevIndex(index);
    if (reduce) {
      setBase(color);
    } else {
      const id = (runs.at(-1)?.id ?? 0) + 1;
      setRuns([...runs.slice(-2), { id, color, wave, dir: index > prevIndex ? 1 : -1 }]);
    }
  }

  const finish = (run: WaveRun) => {
    setBase(run.color);
    setRuns((rs) => rs.filter((r) => r.id > run.id));
  };

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ backgroundColor: LIQUID_HEX[base] }} aria-hidden>
      {runs.map((r) => (
        <Fragment key={r.id}>
          <Layer color={LIQUID_HEX[r.wave]} dir={r.dir} delay={0} />
          <Layer color={LIQUID_HEX[r.color]} dir={r.dir} delay={0.14} onDone={() => finish(r)} />
        </Fragment>
      ))}
    </div>
  );
}
