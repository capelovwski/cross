import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { Marquee } from "@/components/ui/Marquee";
import { StoreGrid } from "@/components/store/StoreGrid";
import { storeNotice } from "@/content/products";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Cross Store",
  description: "Camisetas, moletons e acessórios do CROSS, UP e GO. Vitrine online, compra presencial nos encontros e eventos.",
  openGraph: { title: "Cross Store", description: "Vitrine oficial do CROSS. Compra presencial nos encontros e eventos." },
};

export default function StorePage() {
  return (
    <>
      <Header variant="page" />
      <main className="flex-1">
        {/* abertura */}
        <section className="grain relative overflow-hidden bg-ink px-5 pb-10 pt-28 text-paper md:px-10 md:pb-14 md:pt-36 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">[ Cross Store ]</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className="flex flex-col gap-2">
              <Logo name="cross-white" priority sizes="(max-width: 640px) 70vw, 420px" className="w-[70vw] max-w-[26rem] sm:w-[22rem] md:w-[26rem]" />
              <span className="font-display text-[18vw] leading-[0.85] text-yellow sm:text-8xl md:text-9xl xl:text-[11rem]">Store</span>
            </h1>
            <div className="flex max-w-md flex-col items-start gap-4">
              <Sticker tone="red" rotate={-5} size="lg">
                Só presencial
              </Sticker>
              <p className="text-base text-paper/80 md:text-lg">
                Aqui é vitrine: você olha, escolhe, e garante o seu com a equipe da loja nos encontros de sexta e sábado ou nos eventos. Sem carrinho, sem frete, sem drama.
              </p>
            </div>
          </div>
        </section>
        <div className="rotate-[-1.5deg] bg-yellow py-2 text-ink">
          <Marquee items={["CROSS", "UP", "GO", "Camisetas", "Moletons", "Acessórios", "Compra presencial"]} />
        </div>

        {/* aviso */}
        <section className="bg-paper px-5 pt-12 md:px-10 lg:px-14">
          <div className="flex flex-col gap-4 rounded-card-lg border-2 border-ink bg-white p-5 shadow-sticker md:flex-row md:items-center md:justify-between md:p-6">
            <p className="text-sm font-medium md:text-base">
              <span className="mr-2 inline-block size-2 rounded-full bg-red align-middle" aria-hidden />
              {storeNotice}
            </p>
            <PillButton tone="ink" size="sm" href="/#whatsapp">
              Tirar dúvida no WhatsApp
            </PillButton>
          </div>
        </section>

        {/* produtos */}
        <section className="bg-paper px-5 py-12 md:px-10 md:py-16 lg:px-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-5xl md:text-7xl">Vitrine</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">Preços informativos · sujeitos a alteração</p>
          </div>
          <StoreGrid />
        </section>

        {/* rodapé simples */}
        <footer className="grain bg-ink px-5 py-10 text-paper md:px-10 lg:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" aria-label="CROSS — início">
              <Logo name="cross-white" sizes="120px" className="h-7 w-auto" />
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50">
              © {new Date().getFullYear()} CROSS · {site.churchShort}
            </p>
            <PillButton tone="yellow" size="sm" href="/">
              Voltar pro início
            </PillButton>
          </div>
        </footer>
      </main>
    </>
  );
}
