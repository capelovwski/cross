import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { CountUp } from "@/components/ui/CountUp";
import { Placeholder } from "@/components/ui/Placeholder";

const values = [
  { k: "Jesus no centro", v: "Tudo começa e termina Nele." },
  { k: "Palavra na prática", v: "Não só ouvir: viver." },
  { k: "Amizade de verdade", v: "Sem máscara, sem panelinha." },
  { k: "Servir", v: "Igreja não é plateia, é time." },
];

const timeline = [
  { y: "[ANO]", t: "Nasce o ministério de jovens da IBB" }, // PLACEHOLDER
  { y: "[ANO]", t: "Primeiro acampamento" }, // PLACEHOLDER
  { y: "[ANO]", t: "UP e GO viram tribos do CROSS" }, // PLACEHOLDER
  { y: "2027", t: "Conferência Flechas" },
];

export function Who() {
  return (
    <SectionShell id="quem-somos" bg="paper">
      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-6 md:grid-rows-[1fr_1fr_auto] md:gap-4">
        {/* texto principal */}
        <Reveal className="col-span-2 flex flex-col justify-between rounded-card-lg bg-ink p-5 text-paper shadow-float md:col-span-3 md:row-span-2 md:p-7">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-4xl leading-[0.9] sm:text-5xl xl:text-6xl">
              Duas tribos,
              <br />
              <span className="text-yellow">um propósito</span>
            </h2>
            <span className="hidden sm:block">
              <Sticker tone="yellow" size="sm" rotate={6}>
                Quem somos
              </Sticker>
            </span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/85 md:text-base xl:text-lg">
            {/* PLACEHOLDER: aprovar texto */}
            Somos uma comunidade de adolescentes e jovens apaixonados por Jesus, liderados por uma equipe de líderes dedicados a
            caminhar ao lado de cada um. O CROSS reúne duas tribos, UP e GO, debaixo do mesmo propósito: apontar essa geração
            para Cristo.
          </p>
        </Reveal>

        {/* foto da equipe */}
        <Reveal delay={0.1} className="col-span-1 md:col-span-2 md:row-span-2">
          <Placeholder label="[FOTO DA EQUIPE]" className="h-full min-h-28 w-full bg-blue text-paper/70 shadow-float md:min-h-0" />
        </Reveal>

        {/* número grande */}
        <Reveal delay={0.15} className="col-span-1 flex flex-col justify-between rounded-card bg-yellow p-4 shadow-float md:row-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/70">tribos</span>
          <span className="font-display text-6xl leading-none md:text-8xl">
            <CountUp value={2} />
          </span>
          <span className="text-xs font-semibold md:text-sm">UP 13–17 · GO 18–29</span>
        </Reveal>

        {/* valores */}
        <Stagger className="col-span-2 grid grid-cols-2 gap-2 rounded-card bg-red p-4 text-white shadow-float md:order-last md:col-span-3 md:grid-cols-4">
          {values.map((v) => (
            <StaggerItem key={v.k} className="flex flex-col">
              <span className="font-display text-lg leading-none md:text-xl">{v.k}</span>
              <span className="mt-1 text-[11px] leading-tight opacity-85 md:text-xs">{v.v}</span>
            </StaggerItem>
          ))}
        </Stagger>

        {/* linha do tempo */}
        <Reveal delay={0.2} className="col-span-2 flex items-center gap-4 overflow-x-auto no-scrollbar rounded-card border-2 border-ink/10 bg-white p-4 shadow-float md:col-span-3">
          {timeline.map((t, i) => (
            <div key={i} className="flex shrink-0 items-baseline gap-2">
              <span className="font-display text-xl text-red">{t.y}</span>
              <span className="max-w-[9rem] text-[11px] leading-tight text-ink/75">{t.t}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}
