/**
 * Cross Store: vitrine (sem checkout). Produtos fictícios para validar o layout.
 * `image` pode ser um caminho em /public ou uma URL externa.
 */
export type Brand = "cross" | "up" | "go";

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: "Camiseta" | "Moletom" | "Acessório";
  price: number; // em reais, apenas informativo
  description: string;
  image: string;
  sizes?: string[];
  colors?: string[];
  soldOut?: boolean;
}

export const products: Product[] = [
  {
    id: "tee-cross-classic",
    name: "Camiseta CROSS Classic",
    brand: "cross",
    category: "Camiseta",
    price: 59,
    description: "Preta, 100% algodão, estampa CROSS em amarelo no peito e versículo nas costas.",
    image: "/store/tee-cross.svg",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Preto", "Off-white"],
  },
  {
    id: "hoodie-go",
    name: "Moletom GO",
    brand: "go",
    category: "Moletom",
    price: 149,
    description: "Moletom canguru azul com o lettering GO bordado. Pra sábado e pra vida.",
    image: "/store/hoodie-go.svg",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Azul"],
  },
  {
    id: "cap-up",
    name: "Boné UP",
    brand: "up",
    category: "Acessório",
    price: 49,
    description: "Boné vermelho, aba curva, patch UP em amarelo. Tamanho único, ajustável.",
    image: "/store/cap-up.svg",
    colors: ["Vermelho"],
  },
  {
    id: "bottle-cross",
    name: "Garrafa CROSS",
    brand: "cross",
    category: "Acessório",
    price: 35,
    description: "Garrafa 750 ml amarela com logo CROSS. Indispensável no acampamento.",
    image: "/store/bottle-cross.svg",
    colors: ["Amarelo"],
  },
];

export const storeNotice =
  "Compra presencial: nos encontros de sexta (UP) e sábado (GO) e nos eventos do CROSS. Aceitamos Pix, dinheiro e cartão.";
