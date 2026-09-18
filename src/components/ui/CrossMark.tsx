import { MARK_LETTERS, MARK_SHADOW, MARK_VIEWBOX } from "@/lib/crossMarkPaths";
import { cn } from "@/lib/utils";

/**
 * Logotipo CROSS (vetorial).
 *
 * O desenho tem duas camadas: a sombra atrás (uma silhueta só) e as letras na frente.
 * Como são caminhos separados, a logo pode sair em qualquer combinação de cores da paleta.
 * O vão entre as letras e a sombra é vazado: quem aparece ali é o fundo da seção, e é isso
 * que cria o contorno. Por isso a sombra deve contrastar com o fundo, nunca ser igual a ele.
 *
 * Controle o tamanho pela ALTURA: passe `h-*` no className (a largura acompanha sozinha).
 */
type Props = {
  /** cor das letras (qualquer cor CSS; por padrão herda a cor do texto) */
  letters?: string;
  /** cor da sombra; `false` esconde a sombra (bom em tamanhos pequenos) */
  shadow?: string | false;
  className?: string;
  /** texto para leitores de tela; sem ele a logo é tratada como decoração */
  title?: string;
};

export function CrossMark({ letters = "currentColor", shadow = false, className, title }: Props) {
  return (
    <svg
      viewBox={`0 0 ${MARK_VIEWBOX.width} ${MARK_VIEWBOX.height}`}
      className={cn("block w-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {shadow && <path d={MARK_SHADOW} fill={shadow} />}
      {MARK_LETTERS.map((d) => (
        <path key={d.slice(0, 12)} d={d} fill={letters} />
      ))}
    </svg>
  );
}
