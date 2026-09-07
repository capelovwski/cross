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
O DOM da referência **não** usa `scroll-snap` nem biblioteca de full-page (`scrollSnapType: none`, altura total 9.946px com blocos de 306 a 1.625px). A sensação de "engate" vem das animações de entrada do Framer. Mesmo assim, o requisito do briefing (1 gesto = 1 seção) foi implementado de verdade — ver seção 4.

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
- **Display**: Anton (Google Fonts) — condensada, pesada, sempre em caixa alta, `line-height 0.9`. Utilitário `font-display`.
- **Corpo**: Inter.
- **Mono**: JetBrains Mono — labels `[01 CROSS]`, datas, versículo.

### Componentes (em `src/components/ui`)
| Componente | Descrição |
|---|---|
| `PillButton` | pílula com bolinha antes do texto; tons `yellow/ink/paper/blue/red/outline`; hover escala 1.04 |
| `Sticker` | etiqueta rotacionada (2–8°) com borda preta e sombra deslocada `4px 5px 0` (adesivo) |
| `SectionLabel` | `[NN LABEL]` em mono, fixo no canto da seção |
| `Reveal` / `Stagger` | fade + slide + blur ao entrar na viewport (desligado com reduce-motion) |
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

06 EVENTOS (paper)                        07 CALENDÁRIO (ink)
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ O QUE VEM POR AÍ     subtít. │          │ AGENDA               ●UP●GO● │
│ ┌────┐┌────┐┌────┐┌────┐┌───┐│          │ [set][OUT][nov]…[FEV]…[AGO]  │
│ │ VM ││ACMP││ACMP││CONF││FST││          │ ┌UP sex 20h┐ OUT ● Acamp GO  │
│ │ink ││ UP ││ GO ││FLEX││CHO││          │ └──────────┘ FEV ● VM        │
│ │    ││red ││blue││yel ││pau││          │ ┌GO sáb 20h┐ AGO ● Flechas   │
│ │[●] ││    ││[●] ││[●] ││sad││          │ └──────────┘  ?  Acamp UP    │
│ └────┘└────┘└────┘└────┘└───┘│          │                  Chocolate   │
│ (mobile: carrossel horizontal)│          └──────────────────────────────┘
└──────────────────────────────┘

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

10 WHATSAPP (yellow)                      11 CONTATO / RODAPÉ (ink)
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

## 4. Scroll por seção — decisão técnica

**Escolha: implementação própria** (`src/components/scroll/FullPageScroll.tsx`), sem biblioteca.

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| Custom (`wheel`/`touch` + `translateY`) | controle total do índice, 1 gesto = 1 seção garantido, ~250 linhas, sem dependência, funciona com Server Components | precisa tratar inércia de trackpad e rolagem interna | **escolhida** |
| fullpage.js / react-fullpage | pronto, muitos recursos | licença GPLv3/paga para uso comercial, DOM manipulado fora do React, pesado | descartada |
| Swiper vertical + mousewheel | estável, touch excelente | seções viram "slides" (limita layout responsivo), `mousewheel` ainda pode pular 2 slides em flick forte, +40 kB | descartada |
| CSS `scroll-snap` puro | zero JS | não garante 1 gesto = 1 seção (flick forte pula várias), sem cooldown | usada só como fallback (reduce-motion) |

Como funciona:
- Container `100dvh`, `overflow: hidden`; trilho com `translate3d` e `transition 750ms cubic-bezier(.76,0,.24,1)`.
- **Roda/trackpad**: dispara só quando o evento é "novo" (gap > 150 ms) ou o delta **não está decaindo** (inércia decai monotonicamente) e fora do cooldown de 850 ms. Testado: um flick de trackpad com 14 eventos decrescentes = 1 seção; 6 ticks de mouse em 240 ms = 1 seção; 3 ticks espaçados = 3 seções.
- **Touch**: 1 swipe vertical (> 50 px) = 1 seção; swipes horizontais (carrossel de eventos, timeline) são deixados para o browser.
- **Teclado**: ↑ ↓ PageUp PageDown Space Home End. Tab em elemento de outra seção traz a seção (foco nunca fica invisível).
- **Hash / âncoras**: `#up` no load e `hashchange` funcionam; o hash é atualizado a cada troca.
- **Seções mais altas que a tela** (mobile, janela baixa): rolagem interna acontece primeiro; só no limite o próximo gesto troca de seção.
- **`prefers-reduced-motion: reduce`**: vira documento comum com `scroll-snap-type: y proximity`, sem hijack; animações de entrada desligadas.
- Indicador lateral (`SectionNav`) com bolinhas clicáveis e rótulo no hover (oculto em telas < md).
