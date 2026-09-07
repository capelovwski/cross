# CROSS: site do ministério de adolescentes (UP) e jovens (GO) da IBB

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion.

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
DESIGN.md           sistema de design, wireframes e decisão do scroll
```

## O que ainda é placeholder (procure por `[` … `]`)

| Onde | Chave |
|---|---|
| `src/content/site.ts` | `[LINK_WHATSAPP_CROSS]`, `[LINK_WHATSAPP_UP]`, `[LINK_WHATSAPP_GO]`, Instagram/YouTube, `[LINK_GOOGLE_MAPS_IBB]`, `[EMAIL_CONTATO]`, `[LINK_ALBUM_FLICKR]`, estatísticas do hero |
| `src/content/events.ts` | links de inscrição, nova data do Acampamento UP (`status: "tbd"`), datas exatas |
| `src/content/products.ts` | 4 produtos fictícios com SVGs em `public/store` |
| `src/components/sections/Who.tsx` | `[ANO]` na linha do tempo, `[FOTO DA EQUIPE]` |
| `.env` | `FLICKR_API_KEY`, `FLICKR_ALBUM_ID` ou `FLICKR_ALBUM_URL`, `NEXT_PUBLIC_SITE_URL` |

Enquanto um link for placeholder, o botão correspondente aponta para a seção WhatsApp ou aparece como "em breve".

## Galeria (Flickr)

Copie `.env.example` para `.env.local`:

1. **Com API key** (recomendado): `FLICKR_API_KEY` + `FLICKR_ALBUM_ID` (o número no fim da URL do álbum).
2. **Sem chave**: `FLICKR_ALBUM_URL` funciona apenas se a URL contiver o NSID numérico do usuário (`…/photos/123456789@N05/albums/…`).
3. Sem nada configurado, a galeria usa `src/content/photos.ts` + `public/photos`.

O resultado é cacheado por 1h (`revalidate`).

## Atualizando conteúdo

- **Evento novo / data nova**: edite `src/content/events.ts` (`status`, `start`, `end`, `dateLabel`, `badge`, `cta`). O calendário é derivado automaticamente.
- **FAQ**: `src/content/faq.ts`.
- **Cross Store**: `src/content/products.ts` (imagem em `public/store`).
- **Ordem/nomes das seções**: `src/content/sections.ts`.
