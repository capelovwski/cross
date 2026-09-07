import { cn } from "@/lib/utils";

/** Bloco usado onde ainda não há imagem real. */
export function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "grain flex items-end rounded-card bg-ink-soft p-4 text-paper/60 font-mono text-[10px] uppercase tracking-widest",
        className,
      )}
    >
      {label}
    </div>
  );
}
