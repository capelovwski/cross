/** Ordem oficial dos capítulos da home (usada pelo scroll, header e indicador). */
export const sections = [
  { id: "inicio", num: "01", label: "CROSS", nav: "Início" },
  { id: "o-que-e", num: "02", label: "O QUE É", nav: "O que é" },
  { id: "quem-somos", num: "03", label: "QUEM SOMOS", nav: "Quem somos" },
  { id: "up", num: "04", label: "UP · ADOLESCENTES", nav: "UP" },
  { id: "go", num: "05", label: "GO · JOVENS", nav: "GO" },
  { id: "eventos", num: "06", label: "EVENTOS", nav: "Eventos" },
  { id: "calendario", num: "07", label: "CALENDÁRIO", nav: "Calendário" },
  { id: "fotos", num: "08", label: "FOTOS", nav: "Fotos" },
  { id: "faq", num: "09", label: "FAQ", nav: "FAQ" },
  { id: "whatsapp", num: "10", label: "WHATSAPP", nav: "WhatsApp" },
  { id: "contato", num: "11", label: "CONTATO", nav: "Contato" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const navItems: { label: string; id?: SectionId; href?: string }[] = [
  { label: "O que é", id: "o-que-e" },
  { label: "UP", id: "up" },
  { label: "GO", id: "go" },
  { label: "Eventos", id: "eventos" },
  { label: "Fotos", id: "fotos" },
  { label: "FAQ", id: "faq" },
  { label: "Cross Store", href: "/store" },
];
