/**
 * Fallback da galeria: fotos estáticas em /public/photos.
 * Adicione arquivos na pasta e liste aqui. Se o Flickr estiver configurado
 * (ver .env.example) essa lista só é usada quando a integração falhar.
 */
export interface StaticPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const staticPhotos: StaticPhoto[] = [
  { src: "/photos/placeholder-1.svg", alt: "Louvor no encontro do GO", width: 800, height: 1000 },
  { src: "/photos/placeholder-2.svg", alt: "Galera do UP no acampamento", width: 800, height: 600 },
  { src: "/photos/placeholder-3.svg", alt: "Plenária da Conferência Flechas", width: 800, height: 800 },
  { src: "/photos/placeholder-4.svg", alt: "Fogueira no VM", width: 800, height: 600 },
  { src: "/photos/placeholder-5.svg", alt: "Small group na sexta", width: 800, height: 1000 },
  { src: "/photos/placeholder-6.svg", alt: "Festa do Chocolate", width: 800, height: 800 },
  { src: "/photos/placeholder-7.svg", alt: "Equipe de líderes", width: 800, height: 600 },
  { src: "/photos/placeholder-8.svg", alt: "Batismo no acampamento", width: 800, height: 1000 },
];
