/**
 * Integração com o Flickr.
 *
 * 1) Com FLICKR_API_KEY + FLICKR_ALBUM_ID → usa a API (flickr.photosets.getPhotos).
 * 2) Sem chave, mas com FLICKR_ALBUM_URL contendo o NSID (ex.: 12345678@N05) →
 *    usa o feed público do álbum (sem autenticação).
 * 3) Caso contrário → retorna null e a galeria usa as fotos estáticas.
 */
import { staticPhotos, type StaticPhoto } from "@/content/photos";
import { site, type TribeId } from "@/content/site";

export interface GalleryPhoto extends StaticPhoto {
  href?: string;
  /** tribo do álbum de origem (vira uma etiqueta na foto) */
  tribe?: TribeId;
}

const REVALIDATE = 3600;

function parseAlbumUrl(url?: string) {
  if (!url || /^\[.*\]$/.test(url)) return null;
  const m = url.match(/flickr\.com\/photos\/([^/]+)\/(?:albums|sets)\/(\d+)/);
  if (!m) return null;
  return { user: m[1], albumId: m[2] };
}

interface ApiPhoto {
  id: string;
  title: string;
  url_c?: string;
  url_l?: string;
  url_m?: string;
  width_c?: number;
  height_c?: number;
  width_l?: number;
  height_l?: number;
  width_m?: number;
  height_m?: number;
}

async function viaApi(apiKey: string, albumId: string, userId?: string): Promise<GalleryPhoto[] | null> {
  const params = new URLSearchParams({
    method: "flickr.photosets.getPhotos",
    api_key: apiKey,
    photoset_id: albumId,
    extras: "url_c,url_l,url_m",
    per_page: "40",
    format: "json",
    nojsoncallback: "1",
  });
  if (userId) params.set("user_id", userId);
  const res = await fetch(`https://api.flickr.com/services/rest/?${params}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.stat !== "ok") return null;
  const photos: ApiPhoto[] = json.photoset?.photo ?? [];
  const out: GalleryPhoto[] = [];
  for (const p of photos) {
    const src = p.url_c ?? p.url_l ?? p.url_m;
    if (!src) continue;
    out.push({
      src,
      alt: p.title || "Foto do CROSS",
      width: p.width_c ?? p.width_l ?? p.width_m ?? 800,
      height: p.height_c ?? p.height_l ?? p.height_m ?? 600,
      href: `https://www.flickr.com/photos/${userId ?? ""}/${p.id}`,
    });
  }
  return out;
}

async function viaFeed(nsid: string, albumId: string): Promise<GalleryPhoto[] | null> {
  const url = `https://www.flickr.com/services/feeds/photoset.gne?set=${albumId}&nsid=${nsid}&lang=pt-br&format=json&nojsoncallback=1`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return null;
  const text = await res.text();
  // O feed escapa aspas simples como \' (JSON inválido): corrige antes do parse.
  const json = JSON.parse(text.replace(/\\'/g, "'"));
  const items: { title: string; link: string; media: { m: string } }[] = json.items ?? [];
  return items.map((it) => ({
    src: it.media.m.replace(/_m\.(jpg|png)$/, "_c.$1"),
    alt: it.title || "Foto do CROSS",
    width: 800,
    height: 600,
    href: it.link,
  }));
}

export async function getGalleryPhotos(): Promise<{ photos: GalleryPhoto[]; source: "flickr" | "static" }> {
  const apiKey = process.env.FLICKR_API_KEY;
  const albumId = process.env.FLICKR_ALBUM_ID;
  const parsed = parseAlbumUrl(process.env.FLICKR_ALBUM_URL);

  try {
    if (apiKey && (albumId || parsed?.albumId)) {
      const photos = await viaApi(apiKey, albumId ?? parsed!.albumId, parsed?.user);
      if (photos && photos.length) return { photos, source: "flickr" };
    }
    if (parsed && /@N\d\d$/.test(parsed.user)) {
      const photos = await viaFeed(parsed.user, parsed.albumId);
      if (photos && photos.length) return { photos, source: "flickr" };
    }
  } catch (err) {
    console.warn("[flickr] falha ao carregar álbum, usando fallback estático:", err);
  }
  return { photos: staticPhotos, source: "static" };
}

/**
 * Fotos da última celebração de UP e GO (álbuns em `site.albums`), intercaladas.
 * Usa o feed público do Flickr (sem chave). Se algum álbum falhar, usa as capas;
 * se tudo falhar, as fotos estáticas.
 */
export async function getTribeAlbumPhotos(perAlbum = 4): Promise<{ photos: GalleryPhoto[]; source: "flickr" | "static" }> {
  const tribes: TribeId[] = ["up", "go"];
  try {
    const lists = await Promise.all(
      tribes.map(async (t) => {
        const album = site.albums[t];
        const label = `${album.title} · ${album.date}`;
        const photos = (await viaFeed(site.flickr.nsid, album.id).catch(() => null)) ?? [];
        const picked = photos.length
          ? photos.slice(0, perAlbum).map((p) => ({ ...p, alt: label, href: album.url, tribe: t }))
          : [{ src: album.cover, alt: label, width: 1600, height: 1200, href: album.url, tribe: t }];
        return picked;
      }),
    );
    const mixed: GalleryPhoto[] = [];
    for (let i = 0; i < Math.max(...lists.map((l) => l.length)); i++) for (const l of lists) if (l[i]) mixed.push(l[i]);
    if (mixed.length) return { photos: mixed, source: "flickr" };
  } catch (err) {
    console.warn("[flickr] falha ao carregar álbuns das tribos, usando fallback estático:", err);
  }
  return { photos: staticPhotos, source: "static" };
}
