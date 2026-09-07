import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <main className="grain flex min-h-dvh flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-paper">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">[ 404 ]</p>
      <h1 className="font-display text-[30vw] leading-[0.8] text-yellow md:text-[12rem]">Ops</h1>
      <p className="max-w-sm text-paper/80">Essa página não existe. Mas o encontro de sexta e sábado existe, e te esperamos lá.</p>
      <PillButton tone="yellow" href="/">
        Voltar pro início
      </PillButton>
      <Link href="/store" className="font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-yellow">
        ou ver a Cross Store →
      </Link>
    </main>
  );
}
