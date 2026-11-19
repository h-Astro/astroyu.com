export type PhotoItem = {
  id: string;
  src: string;
  alt: string;
  meta: string;
  title?: string;
};

type SharedLinkMeta = {
  origin: string;
  key: string;
  albumId: string;
  shareUrl: string;
};

const DEFAULT_SHARE_URL = "https://immich.astroyu.com/s/landing";

function formatPhotoDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : "";
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 2000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function getPhotosShareUrl(envShareUrl?: string): string {
  const raw = envShareUrl ?? (typeof process !== "undefined" ? process.env.PHOTOS_SHARE_URL : undefined);
  return raw && raw.trim() ? raw.trim() : DEFAULT_SHARE_URL;
}

export async function resolveSharedAlbum(shareUrl: string): Promise<SharedLinkMeta | null> {
  let parsed: URL;
  try {
    parsed = new URL(shareUrl);
  } catch {
    return null;
  }

  const slugMatch = parsed.pathname.match(/^\/s\/([^/]+)\/?$/);
  const keyMatch = parsed.pathname.match(/^\/share\/([^/]+)\/?$/);
  let endpoint: string | null = null;
  if (slugMatch) {
    endpoint = `${parsed.origin}/api/shared-links/me?slug=${encodeURIComponent(slugMatch[1])}`;
  } else if (keyMatch) {
    endpoint = `${parsed.origin}/api/shared-links/me?key=${encodeURIComponent(keyMatch[1])}`;
  }
  if (!endpoint) return null;

  const data = await fetchJsonWithTimeout<{ key?: string; album?: { id?: string } }>(endpoint);
  if (!data?.key || !data.album?.id) return null;

  return {
    origin: parsed.origin,
    key: data.key,
    albumId: data.album.id,
    shareUrl,
  };
}

export async function getRecentPhotos(shareUrl: string, limit = 3): Promise<PhotoItem[]> {
  const meta = await resolveSharedAlbum(shareUrl);
  if (!meta) return [];

  const buckets = await fetchJsonWithTimeout<Array<{ timeBucket: string }>>(
    `${meta.origin}/api/timeline/buckets?albumId=${encodeURIComponent(meta.albumId)}&key=${encodeURIComponent(meta.key)}`,
  );
  if (!Array.isArray(buckets) || buckets.length === 0) return [];

  const items: PhotoItem[] = [];
  for (const bucket of buckets) {
    if (items.length >= limit) break;
    const data = await fetchJsonWithTimeout<{
      id?: string[];
      isImage?: boolean[];
      isTrashed?: boolean[];
      fileCreatedAt?: string[];
    }>(
      `${meta.origin}/api/timeline/bucket?albumId=${encodeURIComponent(meta.albumId)}&timeBucket=${encodeURIComponent(bucket.timeBucket)}&key=${encodeURIComponent(meta.key)}`,
    );
    if (!data?.id) continue;

    for (let i = 0; i < data.id.length && items.length < limit; i++) {
      const id = data.id[i];
      if (!id || data.isImage?.[i] === false || data.isTrashed?.[i] === true) continue;
      const dateText = formatPhotoDate(data.fileCreatedAt?.[i]);
      items.push({
        id,
        src: `/api/photos/${id}`,
        alt: dateText ? `与航的近影 · ${dateText}` : "与航的近影",
        meta: dateText || bucket.timeBucket.replace(/-/g, "."),
      });
    }
  }

  return items;
}
