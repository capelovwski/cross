import { SectionShell } from "./SectionShell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { site } from "@/content/site";
import { cn, isPlaceholder } from "@/lib/utils";

const groups = [
  { id: "cross", name: "CROSS", desc: "Avisos gerais, eventos e tudo que envolve as duas tribos.", link: site.links.whatsappCross, cls: "bg-ink text-paper", dot: "yellow" as const },
  { id: "up", name: "UP", desc: "Adolescentes 13–17. Programação de sexta e rolês.", link: site.links.whatsappUp, cls: "bg-red text-white", dot: "yellow" as const },
  { id: "go", name: "GO", desc: "Jovens 18–29. Programação de sábado, células e missões.", link: site.links.whatsappGo, cls: "bg-blue text-white", dot: "yellow" as const },
];

export function WhatsApp() {
  return (
    <SectionShell id="whatsapp" bg="yellow">
      <div className="flex flex-1 flex-col justify-center gap-4 md:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" className="font-display text-[15vw] leading-[0.85] sm:text-8xl md:text-9xl">
            Chama
            <br />
            no zap
          </Reveal>
          <Reveal delay={0.1} className="flex max-w-sm flex-col gap-3">
            <span className="hidden self-start sm:block">
              <Sticker tone="ink" size="md" rotate={4}>
                Comunidade
              </Sticker>
            </span>
            <p className="text-sm font-medium leading-snug text-ink/80 md:leading-relaxed md:text-base">
              É lá que a programação da semana sai primeiro, que a inscrição abre e que a galera combina carona. Entra no grupo da sua tribo — e no do CROSS.
            </p>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-4" delay={0.15}>
          {groups.map((g, i) => {
            const ph = isPlaceholder(g.link);
            return (
              <StaggerItem key={g.id}>
                <div
                  className={cn("grain flex h-full flex-col justify-between rounded-card-lg p-4 shadow-float md:p-6", g.cls)}
                  style={{ rotate: `${[-1, 0.8, -0.6][i]}deg` }}
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Grupo</p>
                    <p className="font-display text-4xl leading-none md:text-6xl">{g.name}</p>
                    <p className="mt-1 text-xs opacity-90 md:mt-2 md:text-sm">{g.desc}</p>
                  </div>
                  <div className="mt-3 flex flex-col gap-1.5 md:mt-4 md:gap-2">
                    {ph ? (
                      <>
                        <PillButton tone="yellow" size="sm" className="self-start opacity-60" ariaLabel={`Grupo ${g.name} — link em breve`}>
                          Entrar no grupo
                        </PillButton>
                        <code className="hidden font-mono text-[10px] opacity-60 sm:block">{g.link}</code>
                      </>
                    ) : (
                      <PillButton tone="yellow" size="sm" href={g.link} className="self-start">
                        Entrar no grupo
                      </PillButton>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </SectionShell>
  );
}
