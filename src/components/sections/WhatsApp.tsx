import Link from "next/link";
import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { LogoBox, Logo, type LogoName } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { cn, isPlaceholder } from "@/lib/utils";

/**
 * Última tela: "Chama no zap" (grupos) + rodapé (endereço, redes, contato, atalhos),
 * tudo numa seção só. Os cards de grupo seguem a linguagem de cada tribo:
 * CROSS preto, UP adesivo torto com sombra dura, GO reto com filete fino.
 */
const groups: { id: string; name: string; logo: LogoName; desc: string; link: string; cls: string; rotate: number }[] = [
  { id: "cross", name: "CROSS", logo: "cross-white", desc: "Avisos gerais e tudo que envolve as duas tribos.", link: site.links.whatsappCross, cls: "bg-ink text-paper", rotate: -1 },
  { id: "up", name: "UP", logo: "up-white", desc: "Adolescentes 13 a 17. Programação de sexta e rolês.", link: site.links.whatsappUp, cls: "bg-red text-white border-2 border-ink shadow-sticker", rotate: -1.5 },
  { id: "go", name: "GO", logo: "go-white", desc: "Jovens 18 a 29. Sábado, células e missões.", link: site.links.whatsappGo, cls: "bg-blue text-white border border-white/20", rotate: 0 },
];

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

export function WhatsApp() {
  const year = new Date().getFullYear();
  return (
    <SectionShell id="whatsapp" bg="yellow" align="top">
      <div className="flex flex-1 flex-col justify-between gap-4 md:gap-5">
        {/* ---- grupos ---- */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Reveal as="h2" className="font-display text-[11vw] leading-[0.85] sm:text-6xl md:text-7xl">
              Chama
              <br />
              no zap
            </Reveal>
            <Reveal delay={0.1} className="flex max-w-sm flex-col gap-2">
              <span className="hidden self-start sm:block">
                <Sticker tone="ink" size="sm" rotate={4}>
                  Comunidade
                </Sticker>
              </span>
              <p className="hidden text-sm font-medium leading-snug text-ink/80 sm:block md:text-base">
                É lá que a programação da semana sai primeiro e a inscrição abre. Entra no grupo da sua tribo e no do CROSS.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-4 grid grid-cols-1 gap-2.5 md:mt-5 md:grid-cols-3 md:gap-4" delay={0.15}>
            {groups.map((g) => {
              const ph = isPlaceholder(g.link);
              return (
                <StaggerItem key={g.id}>
                  <div
                    className={cn("grain flex items-center justify-between gap-3 rounded-card-lg p-2.5 shadow-float md:flex-col md:items-start md:p-4", g.cls)}
                    style={{ rotate: `${g.rotate}deg` }}
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Grupo</p>
                      <p aria-label={g.name}>
                        <LogoBox name={g.logo} boxClassName="h-7 w-28 md:h-10 md:w-40" />
                      </p>
                      <p className="mt-1 hidden text-xs leading-snug opacity-90 md:block md:text-sm">{g.desc}</p>
                    </div>
                    <PillButton tone="yellow" size="sm" href={ph ? undefined : g.link} className={cn("shrink-0 md:mt-3", ph && "opacity-60")} ariaLabel={ph ? `Grupo ${g.name}: link em breve` : undefined}>
                      Entrar
                    </PillButton>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        {/* ---- rodapé (card preto dentro da tela amarela) ---- */}
        <Reveal delay={0.25} from="up" className="grain rounded-card-lg bg-ink p-4 text-paper shadow-float md:p-5">
          <footer className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:grid-cols-4 md:gap-6 md:text-sm">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Onde</p>
              <p className="font-semibold leading-snug">{site.church}</p>
              <p className="text-paper/70">Salão de Cultos · {site.city}</p>
              <p className="mt-0.5">
                <ExtLink href={site.links.maps}>Ver no mapa</ExtLink>
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Redes</p>
              <ul className="flex flex-col gap-0.5">
                <li><ExtLink href={site.links.instagramCross}>Instagram CROSS</ExtLink></li>
                <li><ExtLink href={site.links.instagramUp}>Instagram UP</ExtLink></li>
                <li><ExtLink href={site.links.instagramGo}>Instagram GO</ExtLink></li>
                <li className="hidden md:block"><ExtLink href={site.links.youtube}>YouTube</ExtLink></li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Contato</p>
              <ul className="flex flex-col gap-0.5">
                <li><ExtLink href={isPlaceholder(site.links.email) ? site.links.email : `mailto:${site.links.email}`}>E-mail</ExtLink></li>
                <li><ExtLink href={site.links.whatsappCross}>WhatsApp</ExtLink></li>
                <li className="hidden md:block"><ExtLink href={site.links.church}>Site da IBB</ExtLink></li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">Atalhos</p>
              <ul className="flex flex-col gap-0.5">
                <li><Link href="/store" className="hover:text-yellow">Cross Store</Link></li>
                <li><a href="#eventos" className="hover:text-yellow">Eventos</a></li>
                <li><a href="#faq" className="hover:text-yellow">FAQ</a></li>
              </ul>
            </div>
          </footer>
          <p className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 pt-3 font-mono text-[10px] uppercase tracking-widest text-paper/40">
            <span className="flex items-center gap-3">
              <Logo name="cross-white" sizes="100px" className="h-4 w-auto opacity-80" /> © {year} · {site.churchShort}
            </span>
            <span className="hidden sm:inline">Feito com ♥ pela galera do CROSS</span>
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
