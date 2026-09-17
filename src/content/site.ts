/**
 * Dados gerais do site. Tudo que ainda não está definido está marcado com
 * placeholders entre colchetes: basta trocar o valor aqui.
 */
export const site = {
  name: "CROSS",
  church: "IBB · Igreja Batista do Bacacheri",
  churchShort: "IBB",
  city: "Curitiba, PR",
  address: {
    street: "R. Amazonas de Souza Azevedo, 134",
    district: "Bacacheri",
    city: "Curitiba · PR",
    zip: "82520-620",
  },
  tagline: "Adolescentes e jovens apontando essa geração para Cristo.",
  /** lema do CROSS */
  lema: ["Amar", "Servir", "Transbordar"] as const,
  description:
    "CROSS é a juventude da Igreja Batista do Bacacheri: adolescentes (UP) e jovens (GO) que vivem a fé em PGMs. Amar, servir e transbordar.",
  // URL pública: NEXT_PUBLIC_SITE_URL (se definida) → domínio de produção que a
  // Vercel injeta automaticamente → localhost. Quando o domínio próprio chegar,
  // basta definir NEXT_PUBLIC_SITE_URL no painel da Vercel.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),

  verse: {
    text: "Ninguém o despreze por você ser jovem, mas seja um exemplo para os fiéis na palavra, no procedimento, no amor, na fé e na pureza.",
    ref: "1 Timóteo 4.12",
  },

  // ---- Links (trocar quando tiver) ----
  links: {
    pgmUp: "[LINK_PGM_UP]",
    pgmGo: "[LINK_PGM_GO]",
    instagramIbb: "https://www.instagram.com/ibbcuritiba/",
    instagramUp: "https://www.instagram.com/_crossup/",
    instagramGo: "https://www.instagram.com/_crossgo/",
    youtube: "[LINK_YOUTUBE]",
    church: "[LINK_SITE_IBB]",
    maps: "https://share.google/0hyA05tV2mAOygMcU",
    email: "[EMAIL_CONTATO]",
    flickr: "https://www.flickr.com/photos/ibbfotografia/albums",
  },

  /** Flickr da IBB (feed público, sem chave de API) */
  flickr: { nsid: "60884541@N02", user: "ibbfotografia" },

  /** álbum da última celebração de cada tribo: trocar id/data/capa a cada culto */
  albums: {
    up: {
      id: "72177720335613278",
      title: "Celebração UP",
      date: "04/09/2026",
      url: "https://www.flickr.com/photos/ibbfotografia/albums/72177720335613278",
      cover: "https://live.staticflickr.com/65535/55526696973_63d23bf9c1_h.jpg",
    },
    go: {
      id: "72177720335625159",
      title: "Celebração GO",
      date: "12/09/2026",
      url: "https://www.flickr.com/photos/ibbfotografia/albums/72177720335625159",
      cover: "https://live.staticflickr.com/65535/55526732499_4521e9e375_h.jpg",
    },
  },

  /** PGM: Pequeno Grupo Multiplicador (RASCUNHO: revisar textos) */
  pgm: {
    short: "PGM",
    name: "Pequeno Grupo Multiplicador",
    pitch:
      "O PGM é a base da IBB, e o CROSS vive isso também. Um grupo pequeno, com liderança, onde você é chamado pelo nome, cuida e é cuidado, e a fé sai do culto e entra na semana.",
    rule: "Quer servir? Começa num PGM.",
    ruleDetail:
      "É no PGM que a gente é discipulado, cuidado e preparado. Por isso, pra servir em qualquer área do CROSS, você precisa fazer parte de um.",
    steps: [
      { verb: "Amar", text: "No PGM a gente se conhece de verdade: Palavra, oração e cuidado uns com os outros." },
      { verb: "Servir", text: "No PGM você entende, na prática, o que é ser igreja. E aí servir deixa de ser tarefa: é cuidar da sua igreja local." },
      { verb: "Transbordar", text: "Quando o PGM cresce, ele se multiplica: um grupo vira dois, novos líderes surgem e mais gente é alcançada." },
    ],
  },

  /** o que cada verbo do lema significa (RASCUNHO: revisar) */
  lemaCaptions: [
    "A Deus em primeiro lugar, e às pessoas do nosso lado.",
    "Igreja não é plateia. Cada um tem um lugar pra servir.",
    "O que Deus faz em nós não cabe só em nós: alcança outros.",
  ],

  // ---- Estatísticas do hero (placeholders: ajustar) ----
  stats: [
    { value: 150, suffix: "+", label: "adolescentes e jovens" },
    { value: 2, suffix: "", label: "tribos: UP e GO" },
    { value: 10, suffix: "+", label: "anos de ministério" },
  ],

  tribes: {
    up: {
      id: "up",
      name: "UP",
      audience: "Adolescentes",
      ages: "13 a 17 anos",
      ageRange: [13, 17] as const,
      day: "Toda sexta-feira",
      time: "20h",
      place: "Salão de Cultos da IBB",
      color: "red",
      pitch:
        "Se você tem entre 13 e 17 anos, o UP é o seu lugar. Toda sexta a gente se reúne pra louvar, ouvir a Palavra num papo direto e curtir a galera. E durante a semana, a vida continua no seu PGM.",
      highlights: [
        { title: "Louvor", text: "Banda de adolescentes tocando pra adolescentes." },
        { title: "Palavra", text: "Mensagem curta, direta e que faz sentido pra sua semana." },
        { title: "PGM", text: "Seu grupo pequeno: amizade, Palavra e cuidado de perto." },
        { title: "Rolês", text: "Gincanas, noite do jogo, acampamento UP e muito mais." },
      ],
    },
    go: {
      id: "go",
      name: "GO",
      audience: "Jovens",
      ages: "18 a 29 anos",
      ageRange: [18, 29] as const,
      day: "Todo sábado",
      time: "20h",
      place: "Salão de Cultos da IBB",
      color: "blue",
      pitch:
        "Dos 18 aos 29, a vida acelera: faculdade, trabalho, decisões. O GO é uma comunidade pra viver essa fase com propósito, com gente que caminha junto no PGM e uma fé que sai do banco e vai pra rua.",
      highlights: [
        { title: "Adoração", text: "Um tempo de louvor pra recalibrar a semana." },
        { title: "Ensino", text: "Estudos bíblicos profundos, com espaço pra pergunta difícil." },
        { title: "PGM", text: "PGMs de jovens: onde a fé vira vida compartilhada." },
        { title: "Missão", text: "Ação social, viagens missionárias e serviço na igreja." },
      ],
    },
  },
} as const;

export type TribeId = keyof typeof site.tribes;
