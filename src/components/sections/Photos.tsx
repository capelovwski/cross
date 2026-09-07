import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { Sticker } from "@/components/ui/Sticker";
import { PillButton } from "@/components/ui/PillButton";
import { PhotoMosaic } from "@/components/photos/PhotoMosaic";
import { getGalleryPhotos } from "@/lib/flickr";
import { site } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

export async function Photos() {
  const { photos, source } = await getGalleryPhotos();
  const albumOk = !isPlaceholder(site.links.flickrAlbum);

  return (
    <SectionShell id="fotos" bg="paper" align="top">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-4">
          <Reveal as="h2" className="font-display text-5xl leading-[0.9] sm:text-6xl md:text-7xl">
            Mural
          </Reveal>
          <Sticker tone={source === "flickr" ? "blue" : "white"} size="sm" rotate={5}>
            {source === "flickr" ? "via Flickr" : "[fotos placeholder]"}
          </Sticker>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden font-mono text-[11px] uppercase tracking-widest text-ink/60 md:block">Marca a gente: @cross.ibb</p>
          <PillButton tone="ink" size="sm" href={albumOk ? site.links.flickrAlbum : "#contato"}>
            {albumOk ? "Ver álbum completo" : "Álbum em breve"}
          </PillButton>
        </div>
      </div>
      <PhotoMosaic photos={photos} />
    </SectionShell>
  );
}
