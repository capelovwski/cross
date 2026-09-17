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

/* ------------------------------------------------------------------ */
/* Mural: últimas celebrações de UP e GO                                */
/* ------------------------------------------------------------------ */

export interface MuralPhoto extends GalleryPhoto {
  id: string;
  /** largura / altura real da foto */
  ratio: number;
  score: number;
  tribe: TribeId;
}

interface Analysis {
  ratio: number;
  score: number;
  hash: string;
}

/**
 * Analisa a miniatura (320px) de uma foto: formato real, nota e assinatura para achar duplicadas.
 * Nota = nitidez (variância do laplaciano) + presença de pele (pessoas visíveis) + exposição + contraste.
 */
async function analyze(thumbUrl: string): Promise<Analysis | null> {
  try {
    const sharp = (await import("sharp")).default;
    const res = await fetch(thumbUrl, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    const ratio = meta.width && meta.height ? meta.width / meta.height : 1.5;
    const { data, info } = await sharp(buf).resize(160, 160, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const n = info.width * info.height;
    const L = new Float32Array(n);
    let sumL = 0;
    let sumL2 = 0;
    let skin = 0;
    for (let i = 0; i < n; i++) {
      const r = data[i * 3];
      const g = data[i * 3 + 1];
      const b = data[i * 3 + 2];
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      L[i] = y / 255;
      sumL += L[i];
      sumL2 += L[i] * L[i];
      if (y > 60 && cb >= 77 && cb <= 127 && cr >= 137 && cr <= 173) skin++;
    }
    const mean = sumL / n;
    const std = Math.sqrt(Math.max(0, sumL2 / n - mean * mean));
    let lap = 0;
    let lap2 = 0;
    let cnt = 0;
    const w = info.width;
    for (let yy = 1; yy < info.height - 1; yy++) {
      for (let x = 1; x < w - 1; x++) {
        const i = yy * w + x;
        const v = L[i - w] + L[i + w] + L[i - 1] + L[i + 1] - 4 * L[i];
        lap += v;
        lap2 += v * v;
        cnt++;
      }
    }
    const sharpness = (lap2 / cnt - (lap / cnt) ** 2) * 1000;
    const exposure = 1 - Math.min(1, Math.abs(mean - 0.45) / 0.3);
    const score = 0.35 * Math.min(1, sharpness / 6) + 0.3 * Math.min(1, skin / n / 0.12) + 0.2 * exposure + 0.15 * Math.min(1, std / 0.25);
    // assinatura 8×8 (average hash) para achar fotos quase iguais
    const tiny = await sharp(buf).resize(8, 8, { fit: "fill" }).grayscale().raw().toBuffer();
    const avg = tiny.reduce((a, v) => a + v, 0) / tiny.length;
    const hash = Array.from(tiny, (v) => (v > avg ? "1" : "0")).join("");
    return { ratio, score, hash };
  } catch {
    return null;
  }
}

const hamming = (a: string, b: string) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
};

async function albumPhotos(tribe: TribeId, max: number): Promise<MuralPhoto[]> {
  const album = site.albums[tribe];
  const label = `${album.title} · ${album.date}`;
  const url = `https://www.flickr.com/services/feeds/photoset.gne?set=${album.id}&nsid=${site.flickr.nsid}&lang=pt-br&format=json&nojsoncallback=1`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return [];
  const json = JSON.parse((await res.text()).replace(/\\'/g, "'"));
  const items: { link: string; media: { m: string } }[] = json.items ?? [];

  const analyzed = await Promise.all(
    items.map(async (it) => {
      const id = it.link.match(/\/photos\/[^/]+\/(\d+)/)?.[1] ?? it.media.m;
      const a = await analyze(it.media.m.replace(/_m\.(jpg|png)$/, "_n.$1"));
      return {
        id,
        src: it.media.m.replace(/_m\.(jpg|png)$/, "_b.$1"),
        alt: label,
        width: 1024,
        height: Math.round(1024 / (a?.ratio ?? 1.5)),
        href: album.url,
        tribe,
        ratio: a?.ratio ?? 1.5,
        score: a?.score ?? 0,
        hash: a?.hash ?? "",
      };
    }),
  );

  // 1) escolha manual, se os IDs estiverem neste álbum
  const picks = (album.pick ?? []).map((id) => analyzed.find((p) => p.id === id)).filter((p): p is (typeof analyzed)[number] => Boolean(p));
  if (picks.length >= 2) return picks.slice(0, max);

  // 2) automática: melhores notas, sem quase-duplicadas, nota mínima (garante pelo menos 2)
  const chosen: typeof analyzed = [];
  for (const p of [...analyzed].sort((a, b) => b.score - a.score)) {
    if (chosen.length >= max) break;
    if (p.hash && chosen.some((c) => c.hash && hamming(c.hash, p.hash) <= 10)) continue;
    if (p.score < 0.6 && chosen.length >= 2) continue;
    chosen.push(p);
  }
  return chosen;
}

/** Distribui as fotos em linhas cuja soma dos formatos fica perto de `target` (linhas justificadas). */
function toRows(photos: MuralPhoto[], rows: number, target: number, maxPerRow: number): MuralPhoto[][] {
  const out: MuralPhoto[][] = [];
  let cur: MuralPhoto[] = [];
  let sum = 0;
  for (const p of photos) {
    if (out.length === rows) break;
    cur.push(p);
    sum += p.ratio;
    if (sum >= target || cur.length === maxPerRow) {
      out.push(cur);
      cur = [];
      sum = 0;
    }
  }
  // última linha incompleta só entra se não ficar esticada demais
  if (out.length < rows && cur.length && sum >= target * 0.6) out.push(cur);
  return out;
}

/**
 * Mural das últimas celebrações: fotos com pessoas visíveis, intercalando GO e UP,
 * já distribuídas em linhas para desktop (2 linhas largas) e celular (3 linhas curtas).
 */
export async function getMuralPhotos(): Promise<{ desktop: MuralPhoto[][]; mobile: MuralPhoto[][]; source: "flickr" | "static" }> {
  try {
    const [go, up] = await Promise.all([albumPhotos("go", 10), albumPhotos("up", 10)]);
    const mixed: MuralPhoto[] = [];
    for (let i = 0; i < Math.max(go.length, up.length); i++) {
      if (go[i]) mixed.push(go[i]);
      if (up[i]) mixed.push(up[i]);
    }
    if (mixed.length >= 3) {
      return {
        desktop: toRows(mixed, 2, 5.2, 6),
        mobile: toRows(mixed, 3, 2.0, 3),
        source: "flickr",
      };
    }
  } catch (err) {
    console.warn("[flickr] falha ao montar o mural, usando fotos estáticas:", err);
  }
  const fallback: MuralPhoto[] = staticPhotos.map((p, i) => ({ ...p, id: p.src, ratio: p.width / p.height, score: 0, tribe: i % 2 ? "up" : "go" }));
  return { desktop: toRows(fallback, 2, 5.2, 6), mobile: toRows(fallback, 3, 2.0, 3), source: "static" };
}
