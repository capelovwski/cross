import Link from "next/link";
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { LogoBox } from "@/components/ui/Logo";
import { CrossMark } from "@/components/ui/CrossMark";
import { site } from "@/content/site";
import { cn, isPlaceholder } from "@/lib/utils";

/**
 * 11 · Faça parte + rodapé, numa tela só.
 * O convite é entrar num PGM da sua tribo (UP com cara de adesivo, GO editorial),
 * mais um card de "primeira vez" com o endereço. Abaixo, o rodapé como card preto.
 */
function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (isPlaceholder(href)) {
    return (
      <span className="text-paper/45" title={`placeholder: ${href}`}>
        {children} <span className="font-mono text-[9px]">[em breve]</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow">
      {children}
    </a>
  );
}

function PgmButton({ href, tone, label }: { href: string; tone: "yellow" | "outline-light"; label: string }) {
  const ph = isPlaceholder(href);
  return (
    <PillButton tone={tone} size="sm" href={ph ? undefined : href} className={cn("shrink-0", ph && "opacity-60")} ariaLabel={ph ? `${label}: link em breve` : undefined}>
      Quero um PGM
    </PillButton>
  );
}

export function FacaParte() {
  const year = new Date().getFullYear();
  const { up, go } = site.tribes;
  const a = site.address;

  return (
    <SectionShell id="faca-parte" bg="yellow" align="top">
      <div className="flex flex-1 flex-col justify-between gap-4 md:gap-5">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Reveal as="h2" className="font-display text-[12vw] leading-[0.85] sm:text-6xl md:text-7xl">
              Seu lugar
              <br />é num PGM
            </Reveal>
            <Reveal delay={0.1} className="flex max-w-sm flex-col gap-2">
              <span className="hidden self-start sm:block">
                <Sticker tone="ink" size="sm" rotate={4}>
                  Faça parte
                </Sticker>
              </span>
              <p className="hidden text-sm font-medium leading-snug text-ink/80 sm:block md:text-base">
                Escolhe a sua tribo e a gente te conecta com um PGM. É ali que você ama, serve e transborda.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-4 grid grid-cols-1 gap-2.5 md:mt-5 md:grid-cols-3 md:gap-4" delay={0.15}>
            {/* UP: adesivo */}
            <StaggerItem>
              <div className="flex items-center justify-between gap-3 rounded-card-lg border-2 border-ink bg-red p-3 text-white shadow-sticker md:h-full md:flex-col md:items-start md:p-4" style={{ rotate: "-1.5deg" }}>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-75">PGM do</p>
                  <LogoBox name="up-white" boxClassName="h-7 w-24 md:h-10 md:w-32" />
                  <p className="mt-1 hidden text-sm opacity-90 md:block">{up.audience} · {up.ages}</p>
                </div>
                <PgmButton href={site.links.pgmUp} tone="yellow" label="PGM do UP" />
              </div>
            </StaggerItem>
            {/* GO: editorial */}
            <StaggerItem>
              <div className="flex items-center justify-between gap-3 rounded-card-lg border border-white/20 bg-blue p-3 text-white shadow-float md:h-full md:flex-col md:items-start md:p-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">PGM do</p>
                  <LogoBox name="go-white" boxClassName="h-7 w-24 md:h-10 md:w-32" />
                  <p className="mt-1 hidden text-sm opacity-90 md:block">{go.audience} · {go.ages}</p>
                </div>
                <PgmButton href={site.links.pgmGo} tone="outline-light" label="PGM do GO" />
              </div>
            </StaggerItem>
            {/* primeira vez */}
            <StaggerItem>
              <div className="flex items-center justify-between gap-3 rounded-card-lg bg-ink p-3 text-paper shadow-float md:h-full md:flex-col md:items-start md:p-4" style={{ rotate: "-1deg" }}>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-paper/60">Primeira vez?</p>
                  <p className="font-display text-xl leading-tight md:text-2xl">Sexta UP · Sábado GO · 20h</p>
                  <p className="mt-1 hidden text-sm text-paper/75 md:block">Salão de Cultos da IBB. Chega e fala com a recepção.</p>
                </div>
                <PillButton tone="yellow" size="sm" href={site.links.maps} className="shrink-0">
                  Como chegar
                </PillButton>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        {/* rodapé */}
        <Reveal delay={0.25} from="up" className="grain rounded-card-lg bg-ink p-4 text-paper shadow-float md:p-5">
          <footer className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs md:grid-cols-4 md:gap-6 md:text-sm">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Onde</p>
              <p className="font-semibold leading-snug">{site.church}</p>
              <address className="not-italic leading-snug text-paper/70">
                {a.street}
                <br />
                {a.district} · {a.city} · {a.zip}
              </address>
              <p className="mt-0.5">
                <ExtLink href={site.links.maps}>Ver no mapa ↗</ExtLink>
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Instagram</p>
              <ul className="flex flex-col gap-0.5">
                <li><ExtLink href={site.links.instagramUp}>@_crossup</ExtLink></li>
                <li><ExtLink href={site.links.instagramGo}>@_crossgo</ExtLink></li>
                <li><ExtLink href={site.links.instagramIbb}>@ibbcuritiba</ExtLink></li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Contato</p>
              <ul className="flex flex-col gap-0.5">
                <li><ExtLink href={isPlaceholder(site.links.email) ? site.links.email : `mailto:${site.links.email}`}>E-mail</ExtLink></li>
                <li><ExtLink href={site.links.church}>Site da IBB</ExtLink></li>
                <li className="hidden md:block"><ExtLink href={site.links.youtube}>YouTube</ExtLink></li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Atalhos</p>
              <ul className="flex flex-col gap-0.5">
                <li><Link href="/store" className="hover:text-yellow">Cross Store</Link></li>
                <li><a href="#pgm" className="hover:text-yellow">PGM</a></li>
                <li><a href="#eventos" className="hover:text-yellow">Eventos</a></li>
              </ul>
            </div>
          </footer>
          <p className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 pt-3 font-mono text-[10px] uppercase tracking-widest text-paper/40">
            <span className="flex items-center gap-3">
              <CrossMark letters="#f3f0e8" shadow="#e8262a" className="h-5 opacity-90" /> © {year} · {site.churchShort}
            </span>
            <span className="hidden sm:inline">{site.lema.join(" · ")}</span>
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
