import { HERO_FILL, HERO_INNER, HERO_MARK_WIDTH, HERO_RING, HERO_VIEWBOX, MARK_LETTERS, MARK_SHADOW, MARK_VIEWBOX } from "@/lib/crossMarkPaths";
import { cn } from "@/lib/utils";

/**
 * Versão do logotipo para o hero: o mesmo desenho do CrossMark dentro da elipse de adesivo
 * (anel externo colorido, anel preto e miolo claro). As proporções da elipse vêm da arte
 * original; a curva ficou um pouco mais arredondada para as letras novas caberem sem sufocar.
 *
 * Todas as cores são configuráveis, então a peça sai em qualquer combinação da paleta.
 */
const RING = HERO_RING;
const INNER = HERO_INNER;
const FILL = HERO_FILL;
const MARK_W = HERO_MARK_WIDTH;

const scale = MARK_W / MARK_VIEWBOX.width;
const markH = MARK_VIEWBOX.height * scale;
const markX = (HERO_VIEWBOX.width - MARK_W) / 2;
const markY = HERO_VIEWBOX.height / 2 - markH / 2;

type Props = {
  /** anel externo */
  ring?: string;
  /** anel interno */
  inner?: string;
  /** miolo */
  fill?: string;
  /** letras */
  letters?: string;
  /** sombra das letras dentro do miolo; `false` deixa as letras chapadas */
  shadow?: string | false;
  className?: string;
  title?: string;
};

export function CrossHero({
  ring = "#e8262a",
  inner = "#0b0b0c",
  fill = "#f3f0e8",
  letters = "#0b0b0c",
  shadow = false,
  className,
  title,
}: Props) {
  const cx = HERO_VIEWBOX.width / 2;
  const cy = HERO_VIEWBOX.height / 2;
  return (
    <svg
      viewBox={`0 0 ${HERO_VIEWBOX.width} ${HERO_VIEWBOX.height}`}
      className={cn("block h-auto w-full", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <ellipse cx={cx} cy={cy} rx={RING.rx} ry={RING.ry} fill={ring} />
      <ellipse cx={cx} cy={cy} rx={INNER.rx} ry={INNER.ry} fill={inner} />
      <ellipse cx={cx} cy={cy} rx={FILL.rx} ry={FILL.ry} fill={fill} />
      <g transform={`translate(${markX} ${markY}) scale(${scale})`}>
        {shadow && <path d={MARK_SHADOW} fill={shadow} />}
        {MARK_LETTERS.map((d) => (
          <path key={d.slice(0, 12)} d={d} fill={letters} />
        ))}
      </g>
    </svg>
  );
}
