import type { MetadataRoute } from "next";

/** Web App Manifest: permite "Adicionar à tela inicial" com cara de app (sem barra do navegador). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CROSS · Adolescentes e Jovens da IBB",
    short_name: "CROSS",
    description: "Ministério de adolescentes (UP) e jovens (GO) da Igreja Batista do Bacacheri.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    lang: "pt-BR",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
