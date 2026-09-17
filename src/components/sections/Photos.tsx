import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PhotoMosaic } from "@/components/photos/PhotoMosaic";
import { getTribeAlbumPhotos } from "@/lib/flickr";
import { site } from "@/content/site";

/** 09 · Fotos: a última celebração de cada tribo, direto dos álbuns do Flickr da IBB. */
export async function Photos() {
  const { photos, source } = await getTribeAlbumPhotos(4);
  const { up, go } = site.albums;

  return (
    <SectionShell id="fotos" bg="paper" align="top">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-4">
          <Reveal as="h2" className="font-display text-5xl leading-[0.9] sm:text-6xl md:text-7xl">
            Mural
          </Reveal>
          <Sticker tone={source === "flickr" ? "ink" : "white"} size="sm" rotate={5}>
            {source === "flickr" ? "Últimas celebrações" : "[fotos placeholder]"}
          </Sticker>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={up.url}
            target="_blank"
            rel="noopener noreferrer"
            className="-rotate-2 rounded-pill border-2 border-ink bg-red px-3 py-1.5 text-xs font-semibold text-white shadow-sticker transition-transform hover:-rotate-3 md:text-sm"
          >
            Álbum UP · {up.date.slice(0, 5)} ↗
          </a>
          <a
            href={go.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-blue bg-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-deep md:text-sm"
          >
            Álbum GO · {go.date.slice(0, 5)} ↗
          </a>
        </div>
      </div>
      <PhotoMosaic photos={photos} />
    </SectionShell>
  );
}
