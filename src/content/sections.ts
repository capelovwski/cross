/** Ordem oficial dos capítulos da home (usada pelo scroll, header e indicador). */
export const sections = [
  { id: "inicio", num: "01", label: "CROSS", nav: "Início" },
  { id: "lema", num: "02", label: "NOSSO LEMA", nav: "Lema" },
  { id: "quem-somos", num: "03", label: "QUEM SOMOS", nav: "Quem somos" },
  { id: "pgm", num: "04", label: "PGM · A BASE", nav: "PGM" },
  { id: "up", num: "05", label: "UP · ADOLESCENTES", nav: "UP" },
  { id: "go", num: "06", label: "GO · JOVENS", nav: "GO" },
  { id: "eventos", num: "07", label: "EVENTOS", nav: "Eventos" },
  { id: "calendario", num: "08", label: "CALENDÁRIO", nav: "Calendário" },
  { id: "fotos", num: "09", label: "FOTOS", nav: "Fotos" },
  { id: "faq", num: "10", label: "FAQ", nav: "FAQ" },
  { id: "faca-parte", num: "11", label: "FAÇA PARTE · CONTATO", nav: "Faça parte" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** seções com fundo escuro (header e indicador lateral trocam para versão clara) */
export const darkSections: readonly SectionId[] = ["lema", "up", "go", "calendario"];

/**
 * Header de alto contraste: cor sólida da barra em cada seção (sempre a que mais contrasta
 * com o fundo da seção) e a cor da onda líquida que atravessa a barra na troca.
 */
export type HeaderBg = "ink" | "paper" | "yellow";
export type HeaderWave = "red" | "blue" | "yellow";
export const headerThemes: Record<SectionId, { bg: HeaderBg; wave: HeaderWave }> = {
  inicio: { bg: "ink", wave: "red" },
  lema: { bg: "paper", wave: "yellow" },
  "quem-somos": { bg: "ink", wave: "blue" },
  pgm: { bg: "ink", wave: "yellow" },
  up: { bg: "yellow", wave: "red" },
  go: { bg: "paper", wave: "blue" },
  eventos: { bg: "ink", wave: "red" },
  calendario: { bg: "paper", wave: "yellow" },
  fotos: { bg: "ink", wave: "blue" },
  faq: { bg: "ink", wave: "red" },
  "faca-parte": { bg: "ink", wave: "yellow" },
};

export const navItems: { label: string; id?: SectionId; href?: string }[] = [
  { label: "Quem somos", id: "quem-somos" },
  { label: "PGM", id: "pgm" },
  { label: "UP", id: "up" },
  { label: "GO", id: "go" },
  { label: "Eventos", id: "eventos" },
  { label: "Fotos", id: "fotos" },
  { label: "FAQ", id: "faq" },
  { label: "Cross Store", href: "/store" },
];
