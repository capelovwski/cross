# CROSS: site do ministério de adolescentes (UP) e jovens (GO) da IBB

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion.

**Navegação**: a home é um feed engatado por seção (1 gesto = 1 tela) no desktop e no celular. No desktop, a cada scroll a seção que chega "se constrói" (elementos entram em coreografia, estilo Apple) e a que sai se desmonta. No celular (< 768px) é o feed estilo Reels: 1 swipe = 1 tela, com barra de stories no topo e a "ilha" de navegação no rodapé. Detalhes em `DESIGN.md`, seção 4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```

## Estrutura

```
src/
  app/              layout (fontes + metadata/OG), page (home), store/, opengraph-image
  components/
    scroll/         FullPageScroll (scroll por seção), SectionNav (bolinhas), ScrollContext
    layout/         Header (nav + menu mobile)
    sections/       uma pasta por capítulo da home (Hero, About, Who, Tribe, Events, …)
    ui/             PillButton, Sticker, SectionLabel, Reveal, CountUp, Accordion, Marquee
    store/          ProductCard, StoreGrid
    photos/         PhotoMosaic
  content/          ← EDITE AQUI: site.ts (links, textos, tribos), events.ts, faq.ts, products.ts, photos.ts, sections.ts
  lib/              flickr.ts (integração), calendar.ts, utils.ts
public/photos       fotos estáticas (fallback da galeria)
public/store        imagens dos produtos
DESIGN.md           direção de arte, wireframes e decisão do scroll
DESIGN-SYSTEM.md    tokens, componentes e padrões (versão viva em /design-system)
```

## O que ainda é placeholder (procure por `[` … `]`)

| Onde | Chave |
|---|---|
| `src/content/site.ts` | `[LINK_PGM_UP]`, `[LINK_PGM_GO]` (formulário ou contato para entrar num PGM), `[LINK_YOUTUBE]`, `[LINK_SITE_IBB]`, `[EMAIL_CONTATO]`, textos do PGM e do lema (rascunho), estatísticas do hero |
| `src/content/events.ts` | links de inscrição, nova data do Acampamento UP (`status: "tbd"`), datas exatas |
| `src/content/products.ts` | 4 produtos fictícios com SVGs em `public/store` |
| `src/components/sections/Who.tsx` | `[ANO]` na linha do tempo, `[FOTO DA EQUIPE]` |
| `.env` | `NEXT_PUBLIC_SITE_URL` (quando houver domínio próprio) |
| `src/app/fonts/` | arquivos `.woff2` licenciados da Helvetica Now (ver README da pasta) |

Enquanto um link for placeholder, o botão correspondente aponta para a seção Faça parte ou aparece apagado como "em breve".

## Galeria (Flickr)

A seção Fotos mostra a **última celebração de UP e GO**, direto dos álbuns do Flickr da IBB
(`ibbfotografia`), pelo feed público: não precisa de chave de API.

A cada culto novo, troque em `src/content/site.ts` → `albums.up` / `albums.go`:
`id` (número no fim da URL do álbum), `date`, `url` e `cover` (a imagem do código de embed).

**Quais fotos aparecem**
- Sem `pick`, o site escolhe sozinho: analisa as miniaturas e prefere fotos nítidas, bem expostas e com
  pessoas visíveis, e descarta as quase iguais. Fotos de palco muito escuras tendem a ficar de fora.
- Para escolher a dedo, preencha `pick` com os IDs das fotos (o número na URL da foto no Flickr), na ordem.
  Se os IDs não existirem no álbum atual, volta para a escolha automática.

O mural usa linhas justificadas: cada foto ocupa a largura do próprio formato, então quase nada é cortado.
O site se atualiza sozinho a cada hora. Se o Flickr falhar, usa as fotos estáticas.

## Atualizando conteúdo

- **Evento novo / data nova**: edite `src/content/events.ts` (`status`, `start`, `end`, `dateLabel`, `badge`, `cta`). A seção Calendário (app de calendário: grade do mês, barras de eventos, chips UP/GO semanais, próximos) é derivada automaticamente; os encontros semanais vêm de `weekly` (`weekday`, `time`).
- **FAQ**: `src/content/faq.ts`.
- **Cross Store**: `src/content/products.ts` (imagem em `public/store`).
- **Ordem/nomes das seções**: `src/content/sections.ts`.

## Mobile: app shell

No celular o site se comporta como um app:

- **Feed vertical** (estilo Reels): cada seção ocupa a tela; o dedo arrasta o conteúdo e, ao soltar, ele encaixa na próxima seção (ou volta, se o gesto foi curto). Implementado em `FullPageScroll` (`DRAG_FOLLOW`, `SWIPE_PX`, `SWIPE_VELOCITY`).
- **Barra de stories** no topo (`StoriesBar`) mostrando o progresso entre as 10 seções.
- **Tab bar** no rodapé (`TabBar`): Início, UP, GO, Eventos e Mais (abre um bottom sheet com todas as seções e a Cross Store).
- **Bottom sheets** (`BottomSheet`): menu e FAQ completo, com arraste para fechar.
- **Instalável** (PWA): `src/app/manifest.ts` + ícones em `public/icons`. No iPhone: Compartilhar → Adicionar à Tela de Início; abre sem a barra do navegador.
- Sem flash azul no toque, sem "puxar para atualizar", respeita a área segura do notch e da barra home.
