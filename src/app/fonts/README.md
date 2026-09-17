# Helvetica Now (texto corrido)

O corpo do site usa **Helvetica Now** com tracking **-20** (`letter-spacing: -0.02em`,
token `--tracking-body` em `src/app/globals.css`).

A Helvetica Now é da Monotype. O arquivo de desktop (.otf/.ttf) **não pode** ser publicado
no site: é preciso a licença **webfont** e os arquivos `.woff2`.

Enquanto os arquivos não entram, o site usa a Helvetica Now só se estiver instalada no
aparelho de quem visita e, fora isso, **Helvetica Neue** (Mac/iPhone), Helvetica ou Arial.

## Quando tiver os arquivos licenciados

1. Colocar os `.woff2` nesta pasta, por exemplo:
   - `HelveticaNowText-Regular.woff2`
   - `HelveticaNowText-Medium.woff2`
   - `HelveticaNowText-Bold.woff2`
2. Em `src/app/layout.tsx`:

```ts
import localFont from "next/font/local";

const helveticaNow = localFont({
  src: [
    { path: "./fonts/HelveticaNowText-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNowText-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/HelveticaNowText-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-helvetica-now",
  display: "swap",
});
```

3. Adicionar `${helveticaNow.variable}` na `className` do `<html>`.

Nada mais muda: o CSS já procura `--font-helvetica-now` primeiro.
