/**
 * Dados gerais do site. Tudo que ainda não está definido está marcado com
 * placeholders entre colchetes: basta trocar o valor aqui.
 */
export const site = {
  name: "CROSS",
  church: "IBB · Igreja Batista do Bacacheri",
  churchShort: "IBB",
  city: "Curitiba, PR",
  tagline: "Adolescentes e jovens apontando essa geração para Cristo.",
  description:
    "CROSS é o ministério de adolescentes (UP) e jovens (GO) da Igreja Batista do Bacacheri. Encontros semanais, acampamentos, conferências e comunhão de verdade.",
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
    whatsappCross: "[LINK_WHATSAPP_CROSS]",
    whatsappUp: "[LINK_WHATSAPP_UP]",
    whatsappGo: "[LINK_WHATSAPP_GO]",
    instagramCross: "[LINK_INSTAGRAM_CROSS]",
    instagramUp: "[LINK_INSTAGRAM_UP]",
    instagramGo: "[LINK_INSTAGRAM_GO]",
    youtube: "[LINK_YOUTUBE]",
    church: "[LINK_SITE_IBB]",
    maps: "[LINK_GOOGLE_MAPS_IBB]",
    email: "[EMAIL_CONTATO]",
    flickrAlbum: "[LINK_ALBUM_FLICKR]",
  },

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
      motto: "Levanta. Cresce. Sobe.",
      pitch:
        "Se você tem entre 13 e 17 anos, o UP é o seu lugar. Toda sexta a gente se reúne pra louvar, ouvir a Palavra num papo direto e curtir a galera, sem enrolação e sem filtro.",
      highlights: [
        { title: "Louvor", text: "Banda de adolescentes tocando pra adolescentes." },
        { title: "Palavra", text: "Mensagem curta, direta e que faz sentido pra sua semana." },
        { title: "Small groups", text: "Rodas pequenas pra conversar de verdade e orar uns pelos outros." },
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
      motto: "Vai. Vive. Serve.",
      pitch:
        "Dos 18 aos 29, a vida acelera: faculdade, trabalho, decisões. O GO é uma comunidade pra viver essa fase com propósito, com gente que caminha junto e uma fé que sai do banco e vai pra rua.",
      highlights: [
        { title: "Adoração", text: "Um tempo de louvor pra recalibrar a semana." },
        { title: "Ensino", text: "Estudos bíblicos profundos, com espaço pra pergunta difícil." },
        { title: "Comunidade", text: "Células, mentorias e amizades que atravessam a década." },
        { title: "Missão", text: "Ação social, viagens missionárias e serviço na igreja." },
      ],
    },
  },
} as const;

export type TribeId = keyof typeof site.tribes;
