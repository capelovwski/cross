# CROSS · Design System

Guia de tokens, componentes e padrões do site do CROSS, a juventude da IBB.

Existe também uma **versão viva em `/design-system`**, que renderiza os componentes reais do projeto.
Quando o código muda, aquela página muda junto. Este documento explica as decisões e as regras.

- Direção de arte, referência e wireframes: [DESIGN.md](DESIGN.md)
- Como rodar, estrutura de pastas e placeholders: [README.md](README.md)

---

## 1. Onde cada coisa mora

| O quê | Arquivo |
|---|---|
| Tokens (cores, fontes, raios, sombras, movimento) | `src/app/globals.css` |
| Conteúdo (textos, links, eventos, FAQ, produtos) | `src/content/*` |
| Ordem e rótulo das seções | `src/content/sections.ts` |
| Peças de interface | `src/components/ui/*` |
| Efeitos e animações | `src/components/fx/*` |
| Estrutura de seção, header e menus | `src/components/sections/SectionShell.tsx`, `src/components/layout/*` |
| Motor de scroll | `src/components/scroll/*` |
| Página viva do design system | `src/app/design-system/*` |

Regra geral: **texto não mora em componente**. Tudo que a liderança pode querer trocar fica em `src/content`.

---

## 2. Cores

Paleta fechada: azul, vermelho, amarelo e preto, mais um off-white de apoio.

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#0B0B0C` | preto: fundos escuros, texto, borda dos adesivos |
| `ink-soft` | `#1A1A1D` | preto elevado: cards sobre fundo preto |
| `paper` | `#F3F0E8` | off-white: fundos claros e texto sobre escuro |
| `white` | `#FFFFFF` | cards e a seção do FAQ |
| `blue` / `blue-deep` / `blue-soft` | `#1B4FE0` / `#12379E` / `#DBE4FB` | âncora do **GO** |
| `red` / `red-deep` / `red-soft` | `#E8262A` / `#B5161A` / `#FBDCDC` | âncora do **UP** |
| `yellow` / `yellow-deep` / `yellow-soft` | `#FFC91F` / `#E6A800` / `#FFF1BF` | destaque e CTA |

**Contraste medido** (texto sobre a cor): ink sobre yellow 12,6:1; yellow sobre ink 12,4:1; paper sobre ink 16,9:1;
white sobre blue 6,7:1; white sobre red 4,6:1. Sobre vermelho, use peso semibold ou maior em texto pequeno.

**Ritmo das seções**: 01 papel, 02 preto, 03 papel, 04 amarelo, 05 vermelho (UP), 06 azul (GO), 07 papel,
08 preto, 09 papel, 10 branco, 11 amarelo. Nunca dois fundos iguais seguidos.

---

## 3. Tipografia

| Papel | Família | Regras |
|---|---|---|
| Display | **Anton** | sempre caixa alta, entrelinha 0.85 a 0.9, tracking +0.01em. Títulos, números grandes, lemas |
| Corpo | **Helvetica Now** | tracking **-20** (`-0.02em`), proporcional ao tamanho. 14 a 20px |
| Rótulos | **JetBrains Mono** | 10 a 14px, caixa alta, tracking 0.18 a 0.32em. `[ 04 PGM · A BASE ]`, datas, legendas |

A Helvetica Now é licenciada pela Monotype. Enquanto os `.woff2` com licença webfont não entram no projeto
(ver `src/app/fonts/README.md`), o site usa Helvetica Neue, Helvetica ou Arial. O token `--tracking-body`
vale para todo texto corrido, e as fontes mono e display ficam de fora dele.

---

## 4. Forma, sombra e movimento

- **Raios**: `card` 20px, `card-lg` 28px, `pill` 999px.
- **Sombras**: `float` (flutuante, para cards) e `sticker` (dura, deslocada, para o efeito de adesivo colado).
- **Grão**: utilitário `.grain` dá aspecto impresso. No celular ele sai, para o scroll ficar leve.
- **Rotações**: adesivos entre 1 e 8 graus. UP usa rotação com frequência, GO quase nunca.
- **Logotipo**: o 3D (sombra atrás das letras) é fixo. O vão entre as duas é vazado e mostra o fundo, que é o que forma o contorno. No header e na ilha a logo é monocromática (letras e sombra na mesma cor); no hero, letras ink com sombra red.
- **Easing**: troca de seção com `--ease-section` cubic-bezier(0.76, 0, 0.24, 1); entradas com (0.22, 1, 0.36, 1).
- **Sem blur animado**: filtros animados travavam o scroll. Use opacidade, deslocamento e escala.

---

## 5. Componentes

| Componente | Para quê | Notas |
|---|---|---|
| `PillButton` | ações | tons yellow, ink, paper, blue, red, outline, outline-light; tamanhos sm, md, lg. Sempre com a bolinha antes do texto |
| `Sticker` | palavra-chave em destaque | etiqueta rotacionada com borda preta e sombra dura |
| `SectionLabel` | marcador de capítulo | `[ NN NOME ]` em mono, no canto de cada seção |
| `Accordion` | FAQ | o "+" gira e vira "×" |
| `BottomSheet` | menu e FAQ no celular | sobe do rodapé, fecha arrastando |
| `GooIndicator` | pílula da seção ativa | cabeça rápida, cauda atrasada e ponte fina, fundidas por filtro gooey |
| `CrossMark` | logotipo CROSS (vetorial) | a sombra atrás das letras faz parte do desenho e **nunca sai**; `letters` e `shadow` aceitam qualquer cor. Monocromático = as duas na mesma cor (header e ilha). Em cor: hero com letras ink e sombra red. `plate` põe uma chapa da cor do fundo atrás da logo (acompanhando o contorno dela) para esconder o que passa por trás, como a fita do hero |
| `Logo` / `LogoBox` | logos de UP, GO e Cross Store | controle pela **altura**; `LogoBox` alinha logos de formatos diferentes |
| `Marquee` | fita rolando | loop sem emenda |
| `CountUp` | estatísticas | conta de zero ao entrar na tela |
| `Reveal` / `Stagger` | entrada dos elementos | no desktop a seção "se constrói" ao virar ativa |
| `Tilt` / `Parallax` | profundidade com o mouse | só em ponteiro fino |
| `PgmIcons` | ícones do PGM | amar, servir, transbordar, animados |
| `PhotoMural` | mural de fotos | linhas justificadas pelo formato real das fotos |
| `SectionShell` | casca de seção | fundo, grão, padding, rótulo. `fit="screen"` trava a altura (calendário) |
| `PageIntro` | tela de carregamento | fundo cinza escuro; a logo pula, as camadas vermelha, amarela e azul escorregam para trás dela e tudo sobe |
| `Placeholder` | espaço de imagem | usado onde falta foto real |

---

## 6. Padrões

**As duas tribos.** Mesma marca, linguagens diferentes:

| | UP (13 a 17) | GO (18 a 29) |
|---|---|---|
| Estilo | sticker bomb | editorial |
| Cor | vermelho com amarelo | azul com off-white |
| Cards | borda preta, sombra dura, tortos | filete fino, retos |
| Listas | cards coloridos | lista numerada com filetes |
| Botão | amarelo | contorno |
| Ritmo | mais rápido e alto | mais respiro e calma |

**Navegação.** A home é um feed: uma seção por tela. No desktop cada gesto avança uma seção e a seção que
chega se constrói. No celular o dedo arrasta e encaixa, com barra de stories no topo e ilha no rodapé.
Em telas baixas, a seção rola por dentro antes de trocar.

**Header.** Transparente. A seção ativa é marcada pela pílula líquida, amarela sobre seções escuras e preta
sobre claras.

**Mural.** Linhas justificadas: cada foto ocupa a largura do próprio formato. A escolha das fotos é
automática (nitidez, pessoas visíveis, exposição, sem quase-duplicadas) e pode ser manual pelo campo `pick`.

---

## 7. Voz

**Sempre**: PGM (Pequeno Grupo Multiplicador); o lema Amar, Servir, Transbordar; frases curtas; convite claro;
textos de exemplo marcados como rascunho até a liderança aprovar.

**Nunca**: a palavra "célula" (termo antigo); grupo de WhatsApp como porta de entrada; travessão em qualquer
texto do site; humor debochado sobre temas sagrados.

---

## 8. Acessibilidade

- Texto pequeno só sobre pares com 4.5:1 ou mais.
- `prefers-reduced-motion` desliga coreografia, arraste engatado, líquido e ícones animados.
- Teclado: setas, Page Up e Down, Espaço, Home e End. Foco visível em amarelo com 3px.
- `aria-label` nos ícones, `aria-current` na seção ativa, foco que traz a seção certa.
- Alvos de toque com no mínimo 44px; área segura do notch e da barra home respeitada.

---

## 9. Como criar uma seção nova

1. Adicione o id, número e rótulo em `src/content/sections.ts` (e em `darkSections` se o fundo for escuro).
2. Crie `src/components/sections/NomeDaSecao.tsx` usando `SectionShell` com o `bg` que mantém o ritmo de cores.
3. Monte o conteúdo com `Reveal`, `Stagger`, `PillButton` e `Sticker`; textos novos vão para `src/content`.
4. Inclua a seção em `src/app/page.tsx`, na ordem.
5. Confira em 1280×720, 390×844 e 360×740: nada pode passar da tela sem rolagem interna.
6. Revise contraste, foco por teclado e o comportamento com movimento reduzido.
