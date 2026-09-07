/**
 * Perguntas frequentes — primeiro rascunho para revisão.
 * Cada item: pergunta + resposta (texto simples, pode ter quebras de linha).
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Quem pode participar do CROSS?",
    a: "Todo mundo entre 13 e 29 anos. Dos 13 aos 17 você é UP (adolescentes) e se encontra nas sextas. Dos 18 aos 29 você é GO (jovens) e se encontra nos sábados. Se você está bem na fronteira, fala com um líder que a gente te ajuda a escolher.",
  },
  {
    q: "Preciso ser membro da IBB pra ir?",
    a: "Não. O CROSS é aberto pra qualquer pessoa, de qualquer igreja ou de nenhuma. Chega, se apresenta na recepção e pronto — a gente cuida do resto.",
  },
  {
    q: "Os encontros semanais têm algum custo?",
    a: "Zero. UP (sexta) e GO (sábado) são totalmente gratuitos. Só eventos especiais como acampamentos, VM e a Conferência Flechas têm inscrição paga.",
  },
  {
    q: "Como entro no grupo de WhatsApp?",
    a: "É só clicar no botão da seção WhatsApp aqui do site (tem um grupo do CROSS e grupos separados pra UP e GO). Lá a gente avisa tudo: programação da semana, inscrições e mudanças de última hora.",
  },
  {
    q: "Como funcionam as inscrições e pagamentos dos eventos?",
    a: "As inscrições do VM, dos acampamentos e da Conferência Flechas abrem pelo link divulgado no site e no WhatsApp. O pagamento é por Pix ou cartão no formulário de inscrição, com lotes: quanto antes você garantir, mais barato. Vagas são limitadas e a inscrição só é confirmada após o pagamento.",
  },
  {
    q: "O que devo levar pros acampamentos?",
    a: "Bíblia, caderno, roupa de cama (ou saco de dormir), toalha, itens de higiene, roupa confortável pra esporte, agasalho (a serra é fria!), tênis, garrafinha de água, lanterna e remédios de uso pessoal com a receita. A lista completa vem no e-mail de confirmação.",
  },
  {
    q: "Tem transporte pros eventos?",
    a: "Na maioria dos acampamentos e no VM a gente organiza ônibus saindo da IBB, com custo incluso ou opcional na inscrição. Os detalhes aparecem no formulário de cada evento.",
  },
  {
    q: "Como compro produtos da Cross Store?",
    a: "A Cross Store é só vitrine: você escolhe aqui no site e compra presencialmente com a equipe da loja nos encontros de sexta/sábado e nos eventos. Aceitamos Pix, dinheiro e cartão. Sem entrega, sem frete.",
  },
  {
    q: "Sou pai/mãe. Meu filho de 13 anos pode ir sozinho?",
    a: "Pode sim. Os encontros do UP acontecem dentro da igreja com líderes adultos presentes o tempo todo. Pra acampamentos e viagens, pedimos autorização assinada dos responsáveis na inscrição.",
  },
];
