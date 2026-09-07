/**
 * Eventos do CROSS. Para atualizar datas/status basta editar aqui.
 *
 * status:
 *  - "open"   → inscrições abertas (mostra CTA de inscrição)
 *  - "soon"   → data definida, inscrições ainda não abriram
 *  - "tbd"    → aguardando nova data (ex.: edição do ano já aconteceu)
 *  - "paused" → não acontece neste ano, mas continua na lista
 */
export type EventStatus = "open" | "soon" | "tbd" | "paused";
export type Tribe = "cross" | "up" | "go";
export type Tone = "blue" | "red" | "yellow" | "ink" | "paper";

export interface CrossEvent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tribe: Tribe;
  tone: Tone;
  status: EventStatus;
  /** Data ISO (YYYY-MM-DD). Opcional quando status = tbd/paused. */
  start?: string;
  end?: string;
  /** Texto exibido no card (ex.: "Carnaval · 6 a 9 fev 2027"). */
  dateLabel: string;
  /** Rótulo curto de status exibido como sticker. */
  badge: string;
  cta?: { label: string; href: string };
  /** Observação interna, não renderizada. */
  note?: string;
}

export const events: CrossEvent[] = [
  {
    id: "vm",
    name: "VM",
    tagline: "O retiro de Carnaval do CROSS",
    description:
      "Enquanto a cidade vira do avesso, a gente sobe a serra. Quatro dias de louvor, palavra, esporte, muita risada e zero sinal de celular.",
    tribe: "cross",
    tone: "ink",
    status: "soon",
    start: "2027-02-06",
    end: "2027-02-09",
    dateLabel: "Carnaval · 6 a 9 de fev 2027",
    badge: "Em breve",
    cta: { label: "Quero saber mais", href: "[LINK_INSCRICAO_VM]" },
    note: "Datas do Carnaval 2027 (sáb a ter). Confirmar formato exato.",
  },
  {
    id: "acamp-up",
    name: "Acampamento UP",
    tagline: "Só pra adolescentes. Só pra quem aguenta.",
    description:
      "Gincana, fogueira, culto ao ar livre e amizade que dura o ano inteiro. A edição deste ano já rolou — e foi histórica.",
    tribe: "up",
    tone: "red",
    status: "tbd",
    dateLabel: "Nova data em breve",
    badge: "Já foi 🔥",
    note: "Edição 2026 já aconteceu. Trocar status para 'soon' quando definir a nova data.",
  },
  {
    id: "acamp-go",
    name: "Acampamento GO",
    tagline: "Quatro dias pra respirar fundo",
    description:
      "Feriadão de outubro com a galera do GO: ensino, adoração, esporte e conversas que mudam o rumo do ano.",
    tribe: "go",
    tone: "blue",
    status: "open",
    start: "2026-10-08",
    end: "2026-10-11",
    dateLabel: "8 a 11 de out 2026 · qui a dom",
    badge: "Inscrições abertas",
    cta: { label: "Fazer inscrição", href: "[LINK_INSCRICAO_ACAMP_GO]" },
    note: "Briefing: 'fim de semana do dia 11, 4 dias, termina no domingo'. Em 2026 o dia 11/out cai num domingo, então assumimos qui 8 → dom 11. CONFIRMAR.",
  },
  {
    id: "flechas",
    name: "Conferência Flechas",
    tagline: "A conferência de adolescentes e jovens da IBB",
    description:
      "Um fim de semana inteiro de plenárias, workshops e adoração, reunindo UP e GO e convidados de fora. Prepara o coração.",
    tribe: "cross",
    tone: "yellow",
    status: "soon",
    start: "2027-08-27",
    end: "2027-08-29",
    dateLabel: "27 a 29 de ago 2027",
    badge: "Salve a data",
    cta: { label: "Avise-me", href: "[LINK_LISTA_FLECHAS]" },
    note: "Último fim de semana de agosto de 2027.",
  },
  {
    id: "festa-chocolate",
    name: "Festa do Chocolate",
    tagline: "A festa mais doce do ano",
    description:
      "Tradição do CROSS: brincadeiras, música e chocolate à vontade. Esse ano ela fica na geladeira, mas volta com tudo.",
    tribe: "cross",
    tone: "paper",
    status: "paused",
    dateLabel: "Pausada em 2026",
    badge: "Pausada em 2026",
  },
];

/** Encontros semanais fixos (aparecem no calendário). */
export const weekly = [
  { tribe: "up" as const, label: "UP · Adolescentes", when: "Sextas · 20h", place: "Salão de Cultos da IBB" },
  { tribe: "go" as const, label: "GO · Jovens", when: "Sábados · 20h", place: "Salão de Cultos da IBB" },
];
