# CROSS · Sistema de design e wireframes

Documento de referência gerado na fase 1 do projeto. Serve como "direção de arte"
para o site do CROSS (ministério de adolescentes e jovens da IBB) e registra o que
foi extraído do site de referência, o que foi decidido para a nossa marca e o
wireframe de cada seção.

> Referência analisada: eleveconference.com.br (Framer). Foi usada só como inspiração
> de estilo/UX. Nenhum texto, logo, foto ou ativo foi copiado.

---

## 1. O que foi extraído da referência

Análise feita direto no DOM/CSS computado da página (não em screenshots), em 07/09/2026.

### Cores (medidas)
| Papel | Valor na referência | Uso observado |
|---|---|---|
| Fundo claro | `#F4F4F4` | fundo geral da página |
| Cards claros | `#FFFFFF` | cards, FAQ |
| Preto | `#0E0E0E` | texto, bloco "Instagram", bolhas de chat |
| Laranja/amarelo | `#FFA526` / `#FDA11D` | botão pílula CTA, hero |
| Vermelho | `#FF2F30` | títulos gigantes (`h2`) |
| Rosa | `#FF2073` | seção "Sobre" inteira em cor sólida |
| Azul | `#006397` | card de CTA |
| Verde | `#069B00` | card "Pronto para correr?" |
| Texto secundário | `rgba(14,14,14,.6)` | legendas das estatísticas |

Padrão: **blocos de cor sólida forte alternando com fundo claro**, texto escuro 100% ou 60%.

### Tipografia (medida)
| Função | Fonte | Tamanho / peso |
|---|---|---|
| Títulos gigantes | "Lemon Black" (condensada pesada) | 126–202px, peso 900, `letter-spacing` +1%, `line-height` 0.9 |
| Logo | "Erica One" | 40px |
| Versículo / labels `[01 …]` | "Intel One Mono" | 28px / 12px, mono |
| Corpo | Inter | 17px regular; estatísticas 40px semibold |

### Componentes (medidos)
- **Botão pílula**: `border-radius 32px`, `padding 16px 24px`, fundo laranja, **bolinha de 8px** antes do texto.
- **Cards**: `border-radius 16px`; bolhas de conversa `25px`; sticker "Liderança" `40px`.
- **Stickers**: rotação de **13–15°** ("Liderança", "Família ELV") e **±2–5°** (bolhas, "RUNNERS!").
- **FAQ**: card branco `radius 16px`, `padding 28px 40px`, linha "pergunta + ícone", expande.
- **Label de capítulo**: `[01 CORRA A CORRIDA]` em mono, canto superior esquerdo de cada bloco.
- **Bento**: grid assimétrico mesclando foto, número grande (`3,500+`), cards de cor sólida e cards menores.
- **Texturas**: fita rasgada/tecido no hero (imagem), grão sutil; sombras praticamente ausentes (cards "flat" sobre fundo claro).

### Scroll (observado)
O DOM da referência **não** usa `scroll-snap` nem biblioteca de full-page (`scrollSnapType: none`, altura total 9.946px com blocos de 306 a 1.625px). A sensação de "engate" vem das animações de entrada do Framer. Mesmo assim, o requisito do briefing (1 gesto = 1 seção) foi implementado de verdade (ver seção 4).

---

## 2. Decisões para o CROSS

### Paleta oficial (tokens em `src/app/globals.css`)
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#0B0B0C` | preto: fundos escuros, texto, stickers |
| `ink-soft` | `#1A1A1D` | cards sobre fundo preto |
| `paper` | `#F3F0E8` | off-white "papel": fundos claros, texto sobre escuro |
| `blue` / `blue-deep` | `#1B4FE0` / `#12379E` | **âncora GO** |
| `red` / `red-deep` | `#E8262A` / `#B5161A` | **âncora UP** |
| `yellow` / `yellow-deep` | `#FFC91F` / `#E6A800` | **destaque / CTA** (pílulas, títulos sobre preto) |
| `*-soft` | `#DBE4FB` `#FBDCDC` `#FFF1BF` | fundos de apoio (avisos, chips) |

Regra de ritmo da home: `paper → ink → paper → red (UP) → blue (GO) → paper → ink → paper → white → yellow → ink`.

Por tribo: **UP** = vermelho + amarelo; **GO** = azul + amarelo; **CROSS** = preto + papel + as três cores.

Contraste (WCAG AA): texto `ink` sobre `yellow` 12.6:1; `white` sobre `blue` 6.7:1; `white` sobre `red` 4.6:1 (usar peso ≥ semibold para texto pequeno sobre vermelho); `yellow` sobre `ink` 12.4:1.

### Tipografia
- **Display**: Anton (Google Fonts): condensada, pesada, sempre em caixa alta, `line-height 0.9`. Utilitário `font-display`.
- **Corpo**: Helvetica Now, tracking -20 (`-0.02em`). Até os arquivos webfont licenciados entrarem, cai para Helvetica Neue / Helvetica / Arial. (Antes: Inter.)
- **Mono**: JetBrains Mono: labels `[01 CROSS]`, datas, versículo.

### Componentes (em `src/components/ui`)
| Componente | Descrição |
|---|---|
| `PillButton` | pílula com bolinha antes do texto; tons `yellow/ink/paper/blue/red/outline`; hover escala 1.04 |
| `Sticker` | etiqueta rotacionada (2–8°) com borda preta e sombra deslocada `4px 5px 0` (adesivo) |
| `SectionLabel` | `[NN LABEL]` em mono, fixo no canto da seção |
| `Reveal` / `Stagger` | desktop: coreografia comandada pela seção ativa (monta ao chegar, desmonta ao sair; `from="up|down|left|right|scale"`); mobile/store: fade + slide + blur ao entrar na viewport (desligado com reduce-motion) |
| `CountUp` | número contando de 0 até o valor ao entrar em tela |
| `Accordion` | FAQ com "+" que gira e vira "×", animação de altura |
| `Marquee` | fita de texto rolando (hero e store) |
| `.grain` | grão SVG (feTurbulence) em `mix-blend-mode: multiply`, opacidade 7% |
| `.torn-bottom` | clip-path de papel rasgado (disponível) |

Raios: cards 20px (`rounded-card`), cards grandes 28px (`rounded-card-lg`), pílulas 999px.
Sombra flutuante: `0 18px 40px -18px rgb(11 11 12 / .35)`.

---

## 3. Wireframes por seção (home, 100dvh cada)

```
01 CROSS (paper)                          02 O QUE É (ink)
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ CROSS●   nav        [● CTA]  │          │ [02 O QUE É]                 │
│ [01 CROSS]                   │          │ UM LUGAR PRA      ┌────────┐ │
│      ╱ fita vermelha marquee │          │ CRESCER NA FÉ     │versíc. │ │
│  UP  ██ CROSS ██  GO         │          │ (amarelo, Anton)  │(papel) │ │
│   tagline 1 frase            │          │ parágrafo c/      └────────┘ │
│   [● Fazer parte][● Eventos] │          │ stickers UP/GO    ┌UP─┐┌GO─┐ │
│ ─────────────────────────────│          │ chips             └───┘└───┘ │
│ 150+  2  10+       IBB·CWB   │          │                   [● comun.] │
└──────────────────────────────┘          └──────────────────────────────┘

03 QUEM SOMOS (paper · bento)             04 UP (red)  /  05 GO (blue)
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ ┌────────────┐┌──────┐┌────┐ │          │ [sticker faixa etária]  ┌──┐ │
│ │DUAS TRIBOS,││ foto ││ 2  │ │          │ UP (amarelo,   │quando/hora/│
│ │UM PROPÓSITO││equipe││trib│ │          │  gigante)      │onde (papel)│
│ │texto       │└──────┘└────┘ │          │ motto          ├────┬────┤ │
│ └────────────┘┌─────────────┐│          │ pitch          │louv│palv│ │
│ ┌────────────┐│ 4 valores   ││          │                │smgr│rolê│ │
│ │ timeline → ││ (vermelho)  ││          │           [● Entrar no grupo]│
│ └────────────┘└─────────────┘│          └──────────────────────────────┘
└──────────────────────────────┘

06 EVENTOS (paper)                        07 CALENDÁRIO (ink · "app de calendário")
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ O QUE VEM POR AÍ     subtít. │          │●●● agenda.cross     ●UP●GO●  │
│ ┌────┐┌────┐┌────┐┌────┐┌───┐│          │ OUTUBRO 2026  [‹][Hoje][›]│▓▓│
│ │ VM ││ACMP││ACMP││CONF││FST││          │ dom seg ter qua qui SEX SÁB│Acamp GO
│ │ink ││ UP ││ GO ││FLEX││CHO││          │ ┌──┬──┬──┬──┬──┬──┬──┐  │[● inscr]
│ │    ││red ││blue││yel ││pau││          │ │  │  │  │  │▓▓▓▓▓▓▓▓│  │PRÓXIMOS
│ │[●] ││    ││[●] ││[●] ││sad││          │ │  │  │  │  │  │UP│GO│  │ ● 8–11 out
│ └────┘└────┘└────┘└────┘└───┘│          │ ├──┼──┼──┼──┼──┼──┼──┤  │ ● 6–9 fev
│ (mobile: carrossel horizontal)│          │ │▓ │  │  │  │  │UP│GO│  │TODA SEMANA
└──────────────────────────────┘          └──────────────────────────────┘
                                          (mobile: grade com pontinhos + lista do mês)

08 FOTOS (paper · mosaico 6×3)            09 FAQ (white)
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ MURAL [via Flickr]  [● álbum]│          │ [sticker]      ┌────────── +┐│
│ ┌────────┐┌───┐┌──────┐┌───┐ │          │ DÚVIDAS?       │ pergunta   ││
│ │        ││   ││      ││   │ │          │ A GENTE        ├──────────  ││
│ │        │├───┤├──────┤│   │ │          │ RESPONDE       │ pergunta  +││
│ └────────┘└───┘└──────┘└───┘ │          │ texto          │ pergunta  +││
│ ┌─────────────┐┌────────────┐│          │ [● WhatsApp]   │ (rola)     ││
│ └─────────────┘└────────────┘│          │                └────────────┘│
└──────────────────────────────┘          └──────────────────────────────┘

11 FAÇA PARTE + RODAPÉ (yellow; convite para entrar num PGM de UP ou GO + card "primeira vez"; o rodapé é um card preto na mesma tela)
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ CHAMA          [Comunidade]  │          │ BORA?            [Te esperam]│
│ NO ZAP         texto         │          │ frase            [● grupo]   │
│ ┌CROSS────┐┌UP──────┐┌GO───┐ │          │ ─────────────────────────────│
│ │ desc    ││ desc   ││desc │ │          │ Onde   Redes   Contato Atalh.│
│ │[● grupo]││[● grp] ││[● g]│ │          │ IBB    IG ×3   e-mail  Store │
│ │[LINK_…] ││[LINK_…]││[LI…]│ │          │ mapa   YouTube zap     FAQ   │
│ └─────────┘└────────┘└─────┘ │          │ © 2026 CROSS · IBB           │
└──────────────────────────────┘          └──────────────────────────────┘

/store (página separada, scroll normal)
┌──────────────────────────────┐
│ header sólido                │
│ CROSS STORE  [Só presencial] │
│ ╱ fita amarela marquee       │
│ [aviso compra presencial]    │
│ [Tudo][CROSS][UP][GO]        │
│ ┌────┐┌────┐┌────┐┌────┐     │
│ │img ││img ││img ││img │     │
│ │nome  R$ ││…               │
│ │● presencial nos encontros│ │
│ └────┘└────┘└────┘└────┘     │
└──────────────────────────────┘
```

---

## 4. Scroll por seção: decisão técnica

> **Atualização (15/09/2026)**: o scroll engatado (1 gesto = 1 seção) vale para **mobile e desktop**. No mobile é o feed estilo Reels (trilho acompanha o dedo). No desktop, a cada troca a seção que chega **"se constrói"**: os elementos entram em coreografia (subida + blur + escala, escalonados, ~160 ms depois do trilho começar a andar) e a que sai se desmonta rápido, para se montar de novo na próxima visita; o conteúdo da seção inativa fica deslocado 9vh e menor (0.92), chegando ~180 ms depois do trilho (paralaxe de profundidade). A sensação é a de página que vai se montando a cada scroll, como nos sites da Apple. Implementação: `FullPageScroll` fornece `SectionStateContext` (`active`, `build`) a cada seção; `Reveal`/`Stagger`/Hero animam por `animate={active ? "show" : "hidden"}` em vez de `whileInView`. A rolagem livre nativa fica só para `prefers-reduced-motion`.

**Escolha: implementação própria** (`src/components/scroll/FullPageScroll.tsx`), sem biblioteca.

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| Custom (`wheel`/`touch` + `translateY`) | controle total do índice, 1 gesto = 1 seção garantido, ~250 linhas, sem dependência, funciona com Server Components | precisa tratar inércia de trackpad e rolagem interna | **escolhida** |
| fullpage.js / react-fullpage | pronto, muitos recursos | licença GPLv3/paga para uso comercial, DOM manipulado fora do React, pesado | descartada |
| Swiper vertical + mousewheel | estável, touch excelente | seções viram "slides" (limita layout responsivo), `mousewheel` ainda pode pular 2 slides em flick forte, +40 kB | descartada |
| CSS `scroll-snap` puro | zero JS | não garante 1 gesto = 1 seção (flick forte pula várias), sem cooldown | usada só como fallback (reduce-motion) |

Como funciona:
- Container `100dvh`, `overflow: hidden`; trilho com `translate3d` e `transition 650ms cubic-bezier(.76,0,.24,1)` no desktop (460 ms com ease-out no mobile). Um gesto novo no meio da transição só muda o alvo: a transição CSS continua de onde está, sem solavanco.
- **Roda/trackpad**: dispara só quando o evento é "novo" (gap > 150 ms) ou o delta **não está decaindo** (inércia decai monotonicamente) e fora do cooldown de 420 ms (120 ms no mobile, só para evitar disparo duplo do mesmo gesto). Testado: um flick de trackpad com 14 eventos decrescentes = 1 seção; ticks de mouse a cada 500 a 700 ms = 1 seção cada, sem perdas; roda girando sem parar avança uma seção a cada ~420 ms.
- **Sem blur nem blend modes** durante a transição (filtros animados e `mix-blend-mode` eram a maior fonte de engasgo); o grão sai no mobile; vídeos de fundo pausam fora da tela.
- Transformações da coreografia não contam como rolagem interna: o wrapper da seção clipa o excesso transitório e sobras menores que 8% da altura são ignoradas.
- **Touch**: 1 swipe vertical (> 50 px) = 1 seção; swipes horizontais (carrossel de eventos, timeline) são deixados para o browser.
- **Teclado**: ↑ ↓ PageUp PageDown Space Home End. Tab em elemento de outra seção traz a seção (foco nunca fica invisível).
- **Hash / âncoras**: `#up` no load e `hashchange` funcionam; o hash é atualizado a cada troca.
- **Seções mais altas que a tela** (mobile, janela baixa): rolagem interna acontece primeiro; só no limite o próximo gesto troca de seção.
- **`prefers-reduced-motion: reduce`**: vira documento comum com `scroll-snap-type: y proximity`, sem hijack; animações de entrada desligadas.
- Indicador lateral (`SectionNav`) com bolinhas clicáveis e rótulo no hover (oculto em telas < md).

---

## 5. Narrativa (set/2026)

A home deixou de falar em grupos de WhatsApp. O eixo agora é o **PGM (Pequeno Grupo Multiplicador)**,
a base do ministério, e o lema do CROSS: **Amar, Servir, Transbordar**.

| # | Seção | Papel |
|---|---|---|
| 01 | Início | logo, lema, tagline, "Fazer parte" |
| 02 | Nosso lema | os três verbos + versículo; ponte para o PGM |
| 03 | Quem somos | a juventude como um todo; UP e GO; diagrama CROSS → tribos → PGMs |
| 04 | PGM | o que é; "quer servir? começa num PGM"; o lema vivido no PGM (multiplicação animada) |
| 05–06 | UP / GO | linguagens próprias; lema do CROSS no estilo de cada tribo; CTA "Quero um PGM"; fotos do último culto |
| 07–10 | Eventos, Calendário, Fotos, FAQ | fotos = últimos álbuns de UP e GO; FAQ com perguntas de PGM |
| 11 | Faça parte + rodapé | PGM do UP, PGM do GO, primeira vez (endereço/mapa); Instagram UP, GO e IBB |

Os lemas antigos de cada tribo foram removidos. A trilha ambiente foi arquivada
(`src/components/_archived/ambient-audio`, tag `arquivo/musica-ambiente`).

### Header (set/2026)

Barra sólida flutuante de **alto contraste**: a cor muda por seção (`headerThemes` em `src/content/sections.ts`),
sempre a que mais contrasta com o fundo da seção (preta nas seções claras e amarelas, clara nas escuras e no GO,
amarela no UP). A cada troca, uma **onda líquida** atravessa a barra (`LiquidFill`): primeiro a cor de destaque,
depois a cor final; sobe quando a página desce e desce quando a página sobe. O texto troca de cor de uma vez
quando a onda cruza o meio da barra. Com reduce-motion a cor só troca.
