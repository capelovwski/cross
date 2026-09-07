export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function isPlaceholder(value?: string) {
  return !value || /^\[.*\]$/.test(value.trim());
}

/** Formata preço em BRL. */
export function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}
