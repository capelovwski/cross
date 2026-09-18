import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { sections } from "@/content/sections";
import { PillButton } from "@/components/ui/PillButton";
import { Sticker } from "@/components/ui/Sticker";
import { Accordion } from "@/components/ui/Accordion";
import { Marquee } from "@/components/ui/Marquee";
import { CountUp } from "@/components/ui/CountUp";
import { Logo, LogoBox } from "@/components/ui/Logo";
import { CrossMark } from "@/components/ui/CrossMark";
import { Placeholder } from "@/components/ui/Placeholder";
import { Tilt } from "@/components/fx/Tilt";
import { IconAmar, IconServir, IconTransbordar } from "@/components/fx/PgmIcons";
import { GooDemo, SheetDemo } from "./Demos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design System",
  description: "Tokens, componentes e padrões do site do CROSS.",
  robots: { index: false, follow: false },
};

/* ---------------- contraste (WCAG) ---------------- */
const srgb = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => srgb(c / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const INK = "#0b0b0c";
const PAPER = "#f3f0e8";

const colors = [
  { name: "ink", hex: INK, use: "Preto: fundos escuros, texto, bordas de adesivo" },
  { name: "ink-soft", hex: "#1a1a1d", use: "Preto elevado: cards sobre fundo preto" },
  { name: "paper", hex: PAPER, use: "Off-white: fundos claros e texto sobre escuro" },
  { name: "white", hex: "#ffffff", use: "Cards e seção do FAQ" },
  { name: "blue", hex: "#1b4fe0", use: "Âncora do GO" },
  { name: "blue-deep", hex: "#12379e", use: "Hover e vinheta do GO" },
  { name: "blue-soft", hex: "#dbe4fb", use: "Fundos de apoio" },
  { name: "red", hex: "#e8262a", use: "Âncora do UP" },
  { name: "red-deep", hex: "#b5161a", use: "Hover e vinheta do UP" },
  { name: "red-soft", hex: "#fbdcdc", use: "Fundos de apoio" },
  { name: "yellow", hex: "#ffc91f", use: "Destaque e CTA" },
  { name: "yellow-deep", hex: "#e6a800", use: "Hover do CTA" },
  { name: "yellow-soft", hex: "#fff1bf", use: "Avisos e chips" },
];

const sectionBg: Record<string, string> = {
  inicio: "paper",
  lema: "ink",
  "quem-somos": "paper",
  pgm: "yellow",
  up: "red",
  go: "blue",
  eventos: "paper",
  calendario: "ink",
  fotos: "paper",
  faq: "white",
  "faca-parte": "yellow",
};

function Chip({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "paper" }) {
  return (
    <span className={cn("rounded-pill border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest", tone === "ink" ? "border-ink/25 text-ink/70" : "border-paper/30 text-paper/70")}>
      {children}
    </span>
  );
}

function Block({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t-2 border-ink/10 pt-8">
      <h2 className="font-display text-4xl leading-none md:text-5xl">{title}</h2>
      {lead && <p className="mt-2 max-w-3xl text-sm text-ink/70 md:text-base">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-ink/10 py-4 last:border-0 md:flex-row md:items-center md:gap-6">
      <p className="w-44 shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink/55">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const nav = [
    ["cores", "Cores"],
    ["tipografia", "Tipografia"],
    ["forma", "Forma e movimento"],
    ["componentes", "Componentes"],
    ["logos", "Logos"],
    ["padroes", "Padrões"],
    ["voz", "Voz"],
    ["acessibilidade", "Acessibilidade"],
  ];
  return (
    <main className="min-h-dvh bg-paper px-5 py-10 text-ink md:px-10 md:py-14 lg:px-16">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">[ Design System ]</p>
          <h1 className="font-display mt-2 text-6xl leading-[0.85] md:text-8xl">
            CROSS
            <span className="block text-red">Design System</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-ink/70 md:text-base">
            Tokens, componentes e padrões do site. Esta página usa os componentes reais do projeto, então
            ela acompanha o código. A versão escrita está em <code className="font-mono text-xs">DESIGN-SYSTEM.md</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PillButton tone="ink" size="sm" href="/">
            Ver o site
          </PillButton>
          <PillButton tone="outline" size="sm" href="/store">
            Cross Store
          </PillButton>
        </div>
      </header>

      <nav aria-label="Índice" className="mb-12 flex flex-wrap gap-2">
        {nav.map(([id, label]) => (
          <Link key={id} href={`#${id}`} className="rounded-pill border-2 border-ink px-3 py-1 text-xs font-semibold hover:bg-ink hover:text-paper">
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-12">
        {/* ------------------------------ CORES ------------------------------ */}
        <Block
          id="cores"
          title="Cores"
          lead="Paleta fechada: azul, vermelho, amarelo e preto, mais um off-white de apoio. Azul é o GO, vermelho é o UP, amarelo é destaque e CTA. Os números mostram o contraste do texto sobre a cor."
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {colors.map((c) => {
              const onInk = contrast(c.hex, INK);
              const onPaper = contrast(c.hex, PAPER);
              const best = onInk >= onPaper ? { t: "ink", v: onInk } : { t: "paper", v: onPaper };
              return (
                <div key={c.name} className="overflow-hidden rounded-card border-2 border-ink/10">
                  <div className="flex h-24 items-end p-3" style={{ backgroundColor: c.hex, color: best.t === "ink" ? INK : PAPER }}>
                    <span className="font-display text-xl">{c.name}</span>
                  </div>
                  <div className="bg-white p-3">
                    <p className="font-mono text-[11px] uppercase">{c.hex}</p>
                    <p className="mt-1 text-xs leading-snug text-ink/70">{c.use}</p>
                    <p className="mt-2 font-mono text-[10px] text-ink/55">
                      texto {best.t} · {best.v.toFixed(1)}:1 {best.v >= 4.5 ? "AA" : best.v >= 3 ? "AA grande" : "só display"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="mt-8 font-display text-2xl">Ritmo das seções</h3>
          <p className="mb-3 mt-1 text-sm text-ink/70">Cada seção tem um fundo, alternando claro, escuro e cor sólida.</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <span
                key={s.id}
                className={cn(
                  "rounded-card px-3 py-2 font-mono text-[10px] uppercase tracking-widest",
                  sectionBg[s.id] === "ink" && "bg-ink text-paper",
                  sectionBg[s.id] === "paper" && "border border-ink/15 bg-paper text-ink",
                  sectionBg[s.id] === "white" && "border border-ink/15 bg-white text-ink",
                  sectionBg[s.id] === "yellow" && "bg-yellow text-ink",
                  sectionBg[s.id] === "red" && "bg-red text-white",
                  sectionBg[s.id] === "blue" && "bg-blue text-white",
                )}
              >
                {s.num} {s.nav}
              </span>
            ))}
          </div>
        </Block>

        {/* --------------------------- TIPOGRAFIA --------------------------- */}
        <Block
          id="tipografia"
          title="Tipografia"
          lead="Três famílias: Anton para títulos, Helvetica Now para texto corrido e JetBrains Mono para rótulos, datas e números de seção."
        >
          <Row label="Display · Anton">
            <div>
              <p className="font-display text-6xl leading-none md:text-8xl">Amar. Servir.</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink/55">
                sempre em caixa alta · entrelinha 0.85 a 0.9 · tracking +0.01em · títulos de seção, números grandes, lemas
              </p>
            </div>
          </Row>
          <Row label="Corpo · Helvetica Now">
            <div>
              <p className="max-w-2xl text-lg">
                O PGM é a base da IBB. Um grupo pequeno, com liderança, onde você é chamado pelo nome.
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink/55">
                tracking -20 (-0.02em) proporcional ao tamanho · 14 a 20px · fallback Helvetica Neue, Helvetica, Arial
              </p>
            </div>
          </Row>
          <Row label="Mono · JetBrains Mono">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em]">[ 04 PGM · A BASE ]</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink/55">
                10 a 14px · tracking de 0.18 a 0.32em · rótulos, datas, legendas e o versículo
              </p>
            </div>
          </Row>
        </Block>

        {/* ------------------------ FORMA E MOVIMENTO ----------------------- */}
        <Block id="forma" title="Forma e movimento" lead="Cantos arredondados, sombra flutuante e a sombra dura que faz o efeito de adesivo colado.">
          <Row label="Raios">
            <span className="rounded-card bg-white px-4 py-3 text-sm shadow-float">card · 20px</span>
            <span className="rounded-card-lg bg-white px-4 py-3 text-sm shadow-float">card-lg · 28px</span>
            <span className="rounded-pill bg-white px-4 py-3 text-sm shadow-float">pill · 999px</span>
          </Row>
          <Row label="Sombras">
            <span className="rounded-card bg-white px-4 py-3 text-sm shadow-float">float</span>
            <span className="rounded-card border-2 border-ink bg-white px-4 py-3 text-sm shadow-sticker">sticker</span>
            <span className="rounded-card border-2 border-ink/80 bg-white px-4 py-3 text-sm shadow-sticker-soft">sticker-soft</span>
          </Row>
          <Row label="Textura">
            <div className="grain h-20 w-40 rounded-card bg-paper ring-1 ring-ink/10" />
            <div className="grain grain-light h-20 w-40 rounded-card bg-ink" />
            <span className="text-xs text-ink/60">grão sutil, aspecto impresso. No celular sai, para o scroll ficar leve.</span>
          </Row>
          <Row label="Movimento">
            <div className="flex flex-col gap-1 text-xs text-ink/70">
              <span>
                <code className="font-mono">--ease-section</code> cubic-bezier(0.76, 0, 0.24, 1) · troca de seção
              </span>
              <span>entrada dos elementos: 0.7s com ease (0.22, 1, 0.36, 1), sem blur</span>
              <span>molas: pílula líquida (cabeça 520/36, cauda 120/17), arraste do feed 1:1</span>
              <span>tudo respeita prefers-reduced-motion</span>
            </div>
          </Row>
        </Block>

        {/* --------------------------- COMPONENTES -------------------------- */}
        <Block id="componentes" title="Componentes" lead="Peças reais do site. Arquivos em src/components/ui e src/components/fx.">
          <Row label="PillButton · tons">
            <PillButton tone="yellow" size="sm">Amarelo</PillButton>
            <PillButton tone="ink" size="sm">Preto</PillButton>
            <PillButton tone="blue" size="sm">Azul</PillButton>
            <PillButton tone="red" size="sm">Vermelho</PillButton>
            <PillButton tone="outline" size="sm">Contorno</PillButton>
            <span className="rounded-card bg-ink p-2">
              <PillButton tone="outline-light" size="sm">Contorno claro</PillButton>
            </span>
          </Row>
          <Row label="PillButton · tamanhos">
            <PillButton tone="yellow" size="sm">sm</PillButton>
            <PillButton tone="yellow" size="md">md</PillButton>
            <PillButton tone="yellow" size="lg">lg</PillButton>
            <span className="text-xs text-ink/60">sempre com a bolinha antes do texto</span>
          </Row>
          <Row label="Sticker">
            <Sticker tone="yellow" size="sm" rotate={-5}>Adolescentes</Sticker>
            <Sticker tone="red" size="sm" rotate={4}>Já foi</Sticker>
            <Sticker tone="blue" size="sm" rotate={-3}>Inscrições abertas</Sticker>
            <Sticker tone="ink" size="sm" rotate={5}>A base da IBB</Sticker>
            <Sticker tone="white" size="sm" rotate={-4}>Em breve</Sticker>
          </Row>
          <Row label="Rótulo de seção">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70">[ 04 PGM · A BASE ]</p>
            <span className="rounded-card bg-ink px-3 py-2">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-paper/70">[ 05 UP · ADOLESCENTES ]</span>
            </span>
          </Row>
          <Row label="Números">
            <span className="font-display text-5xl">
              <CountUp value={150} suffix="+" />
            </span>
            <span className="text-xs text-ink/60">contam de zero quando entram na tela</span>
          </Row>
          <Row label="Accordion">
            <div className="w-full max-w-xl">
              <Accordion items={[{ q: "O que é um PGM?", a: "É a base da IBB: um grupo pequeno, com liderança, onde a gente se conhece de verdade." }, { q: "Preciso estar num PGM pra servir?", a: "Sim. É no PGM que a gente é discipulado, cuidado e preparado." }]} defaultOpen={0} />
            </div>
          </Row>
          <Row label="Bottom sheet">
            <SheetDemo />
            <span className="text-xs text-ink/60">menu e FAQ completo no celular</span>
          </Row>
          <Row label="Pílula líquida">
            <div className="flex w-full flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <GooDemo />
              </div>
              <div className="flex-1">
                <GooDemo dark />
              </div>
            </div>
          </Row>
          <Row label="Ícones do PGM">
            <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-paper shadow-sticker">
              <IconAmar className="size-9" />
            </span>
            <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-paper shadow-sticker">
              <IconServir className="size-9" />
            </span>
            <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-paper shadow-sticker">
              <IconTransbordar className="size-9" />
            </span>
            <span className="text-xs text-ink/60">amar, servir, transbordar: desenham o traço e seguem num laço sutil</span>
          </Row>
          <Row label="Marquee">
            <div className="w-full rotate-[-1deg] bg-yellow py-1.5 text-ink">
              <Marquee items={["Amar", "Servir", "Transbordar", "Sexta 20h", "Sábado 20h"]} />
            </div>
          </Row>
          <Row label="Tilt e parallax">
            <Tilt max={10} rotate={-1}>
              <div className="grain w-64 rounded-card-lg bg-white p-4 shadow-float">
                <p className="font-mono text-[11px] leading-relaxed">Passe o mouse: o card inclina em 3D.</p>
              </div>
            </Tilt>
          </Row>
          <Row label="Placeholder">
            <Placeholder label="[FOTO DA EQUIPE]" className="h-24 w-48" />
          </Row>
        </Block>

        {/* ------------------------------ LOGOS ----------------------------- */}
        <Block id="logos" title="Logos" lead="O logotipo CROSS é vetorial (CrossMark): sombra e letras são camadas separadas, então sai em qualquer combinação de cores. UP, GO e Cross Store são arquivos em public/img/logos. Controle sempre pela altura, nunca pela largura.">
          <h3 className="font-display text-2xl">CrossMark · combinações</h3>
          <p className="mb-3 mt-1 text-sm text-ink/70">
            O vão entre as letras e a sombra é vazado: quem aparece ali é o fundo da seção. Por isso a sombra
            precisa contrastar com o fundo, nunca ser igual a ele.
          </p>
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { bg: "bg-paper border-2 border-ink/10", letters: "#0b0b0c", shadow: "#e8262a", label: "ink + sombra red" },
              { bg: "bg-ink", letters: "#f3f0e8", shadow: "#ffc91f", label: "paper + sombra yellow" },
              { bg: "bg-red", letters: "#f3f0e8", shadow: "#0b0b0c", label: "paper + sombra ink" },
              { bg: "bg-yellow", letters: "#0b0b0c", shadow: "#f3f0e8", label: "ink + sombra paper" },
              { bg: "bg-blue", letters: "#ffc91f", shadow: "#0b0b0c", label: "yellow + sombra ink" },
              { bg: "bg-white border-2 border-ink/10", letters: "#1b4fe0", shadow: "#0b0b0c", label: "blue + sombra ink" },
              { bg: "bg-ink", letters: "#f3f0e8", shadow: false as const, label: "sem sombra (tamanho pequeno)" },
              { bg: "bg-paper border-2 border-ink/10", letters: "#0b0b0c", shadow: false as const, label: "sem sombra" },
            ].map((v) => (
              <div key={v.label} className={cn("flex h-28 flex-col items-center justify-center gap-2 rounded-card p-4", v.bg)}>
                <CrossMark letters={v.letters} shadow={v.shadow} className="h-9" />
                <span className={cn("font-mono text-[9px] uppercase tracking-widest", v.bg.includes("ink") || v.bg.includes("red") || v.bg.includes("blue") ? "text-paper/70" : "text-ink/60")}>{v.label}</span>
              </div>
            ))}
          </div>
          <h3 className="font-display text-2xl">Tribos e loja</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="flex h-28 items-center justify-center rounded-card border-2 border-ink/10 bg-paper p-4">
              <Logo name="cross-home" sizes="200px" className="h-12 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card bg-ink p-4">
              <Logo name="cross-white" sizes="200px" className="h-7 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card bg-red p-4">
              <Logo name="up-white" sizes="120px" className="h-12 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card bg-blue p-4">
              <Logo name="go-white" sizes="120px" className="h-14 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card border-2 border-ink/10 bg-white p-4">
              <Logo name="up-black" sizes="120px" className="h-12 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card border-2 border-ink/10 bg-white p-4">
              <Logo name="go-black" sizes="120px" className="h-14 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card bg-ink p-4">
              <Logo name="store-white-yellow" sizes="200px" className="h-14 w-auto" />
            </div>
            <div className="flex h-28 items-center justify-center rounded-card border-2 border-ink/10 bg-paper p-4">
              <Logo name="store-black-yellow" sizes="200px" className="h-14 w-auto" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Chip>LogoBox: caixa de altura fixa</Chip>
            <span className="rounded-card bg-ink p-3">
              <LogoBox name="up-white" boxClassName="h-8 w-24" />
            </span>
            <span className="rounded-card bg-ink p-3">
              <LogoBox name="go-white" boxClassName="h-8 w-24" />
            </span>
            <span className="text-xs text-ink/60">mesma caixa: UP e GO ficam equilibrados lado a lado</span>
          </div>
        </Block>

        {/* ----------------------------- PADRÕES ---------------------------- */}
        <Block id="padroes" title="Padrões" lead="A marca é uma só, mas cada tribo tem a sua linguagem.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grain rounded-card-lg bg-red p-5 text-white shadow-float">
              <div className="flex items-center justify-between">
                <LogoBox name="up-white" boxClassName="h-10 w-28" />
                <Sticker tone="yellow" size="sm" rotate={-6}>Sticker bomb</Sticker>
              </div>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                <li>Etiquetas tortas, cards com borda preta e sombra dura</li>
                <li>Cores chapadas alternando amarelo, branco e preto</li>
                <li>Fita amarela cruzando a base, tudo um pouco mais rápido</li>
                <li>Botão amarelo</li>
              </ul>
            </div>
            <div className="rounded-card-lg border border-white/20 bg-blue p-5 text-white shadow-float">
              <div className="flex items-center justify-between">
                <LogoBox name="go-white" boxClassName="h-10 w-28" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-yellow">Editorial</span>
              </div>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                <li>Rótulos em mono, filetes finos, mais respiro</li>
                <li>Listas numeradas no lugar de cards coloridos</li>
                <li>Vídeo de fundo mais escuro e cinematográfico</li>
                <li>Botão de contorno</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Feed por seção", "Uma seção por tela. No desktop cada gesto avança uma seção e a página se constrói. No celular o dedo arrasta e encaixa, estilo Reels."],
              ["App no celular", "Barra de progresso estilo stories no topo, ilha flutuante no rodapé, bottom sheets e instalação na tela inicial."],
              ["Mural de fotos", "Linhas justificadas: cada foto ocupa a largura do próprio formato, então quase nada é cortado."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-card border-2 border-ink/10 bg-white p-4">
                <p className="font-display text-xl">{t}</p>
                <p className="mt-1 text-sm text-ink/70">{d}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* ------------------------------- VOZ ------------------------------ */}
        <Block id="voz" title="Voz" lead="Jovem e direta, sem perder a identidade cristã.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-card border-2 border-ink/10 bg-white p-5">
              <p className="font-display text-2xl text-blue">Sempre</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80">
                <li>PGM, ou Pequeno Grupo Multiplicador</li>
                <li>Lema: {site.lema.join(", ")}</li>
                <li>Frases curtas, segunda pessoa, convite claro</li>
                <li>Textos de exemplo marcados como rascunho até serem aprovados</li>
              </ul>
            </div>
            <div className="rounded-card border-2 border-ink/10 bg-white p-5">
              <p className="font-display text-2xl text-red">Nunca</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80">
                <li>A palavra célula: era o termo antigo</li>
                <li>Grupo de WhatsApp como porta de entrada</li>
                <li>Travessão em qualquer texto do site</li>
                <li>Humor debochado sobre temas sagrados</li>
              </ul>
            </div>
          </div>
        </Block>

        {/* -------------------------- ACESSIBILIDADE ------------------------ */}
        <Block id="acessibilidade" title="Acessibilidade" lead="Regras que valem para qualquer seção nova.">
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              ["Contraste", "Texto pequeno só sobre pares com 4.5:1 ou mais. Sobre vermelho, use peso semibold ou maior."],
              ["Movimento", "prefers-reduced-motion desliga a coreografia, o arraste engatado, o líquido e os ícones animados."],
              ["Teclado", "Setas, Page Up e Down, Espaço, Home e End navegam o feed. Foco visível em amarelo com 3px."],
              ["Leitores de tela", "Rótulos em aria-label nos ícones, aria-current na seção ativa e foco que traz a seção certa."],
              ["Telas pequenas", "Seção maior que a tela rola por dentro antes de trocar. Área segura do notch e da barra home respeitada."],
              ["Toque", "Alvos de no mínimo 44px e sem flash azul no toque."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-card border-2 border-ink/10 bg-white p-4">
                <p className="font-display text-xl">{t}</p>
                <p className="mt-1 text-sm text-ink/70">{d}</p>
              </li>
            ))}
          </ul>
        </Block>

        <footer className="border-t-2 border-ink/10 pt-6 font-mono text-[10px] uppercase tracking-widest text-ink/50">
          CROSS · {site.churchShort} · página interna, fora do índice de busca
        </footer>
      </div>
    </main>
  );
}
