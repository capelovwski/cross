import Link from "next/link";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { PillButton } from "@/components/ui/PillButton";
import { Sticker } from "@/components/ui/Sticker";
import { site } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (isPlaceholder(href)) {
    return (
      <span className="text-paper/50" title={`placeholder: ${href}`}>
        {children} <span className="font-mono text-[10px]">[em breve]</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow">
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <SectionShell id="contato" bg="ink" align="top">
      <div className="flex flex-1 flex-col justify-between gap-6 md:gap-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="font-display text-[18vw] leading-[0.82] text-yellow sm:text-[9rem] md:text-[11rem] xl:text-[13rem]">
              Bora?
            </h2>
            <p className="mt-3 max-w-md text-base text-paper/80 md:text-lg">
              Sexta é UP, sábado é GO. Chega cedo, senta na frente, traz um amigo.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col items-start gap-3">
            <Sticker tone="red" rotate={-5} size="md">
              Te esperamos
            </Sticker>
            <PillButton tone="yellow" size="lg" href="#whatsapp">
              Entrar no grupo
            </PillButton>
          </Reveal>
        </div>

        <footer className="grid grid-cols-2 gap-4 border-t border-paper/15 pt-5 text-sm md:grid-cols-4 md:gap-6 md:pt-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper/50">Onde</p>
            <p className="font-semibold">{site.church}</p>
            <p className="text-paper/70">Salão de Cultos · {site.city}</p>
            <p className="mt-1">
              <ExtLink href={site.links.maps}>Ver no mapa</ExtLink>
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper/50">Redes</p>
            <ul className="flex flex-col gap-1">
              <li><ExtLink href={site.links.instagramCross}>Instagram CROSS</ExtLink></li>
              <li><ExtLink href={site.links.instagramUp}>Instagram UP</ExtLink></li>
              <li><ExtLink href={site.links.instagramGo}>Instagram GO</ExtLink></li>
              <li><ExtLink href={site.links.youtube}>YouTube</ExtLink></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper/50">Contato</p>
            <ul className="flex flex-col gap-1">
              <li><ExtLink href={isPlaceholder(site.links.email) ? site.links.email : `mailto:${site.links.email}`}>E-mail</ExtLink></li>
              <li><ExtLink href={site.links.whatsappCross}>WhatsApp</ExtLink></li>
              <li><ExtLink href={site.links.church}>Site da IBB</ExtLink></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-paper/50">Atalhos</p>
            <ul className="flex flex-col gap-1">
              <li><Link href="/store" className="hover:text-yellow">Cross Store</Link></li>
              <li><a href="#faq" className="hover:text-yellow">FAQ</a></li>
              <li><a href="#eventos" className="hover:text-yellow">Eventos</a></li>
              <li><a href="#calendario" className="hover:text-yellow">Calendário</a></li>
            </ul>
          </div>
        </footer>
        <p className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          <span className="flex items-center gap-3"><Logo name="cross-white" sizes="100px" className="h-5 w-auto opacity-80" /> © {year} · {site.churchShort}</span>
          <span>Feito com ♥ pela galera do CROSS</span>
        </p>
      </div>
    </SectionShell>
  );
}
