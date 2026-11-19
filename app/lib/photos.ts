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

const MUNICIPALITIES = new Set(["北京市", "上海市", "天津市", "重庆市", "北京", "上海", "天津", "重庆"]);
const EN_CITY_FALLBACK: Record<string, string> = {
  Beijing: "北京",
  Chaowai: "北京",
  Baizhifang: "北京",
  Shanghai: "上海",
  Jinshan: "上海",
  Luolong: "洛阳",
  Luoyang: "洛阳",
};

const assetCityCache = new Map<string, string>();
const coordCityCache = new Map<string, string>();

function formatPhotoDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : "";
}

function cleanZhPlace(name: string): string {
  return name.trim().replace(/(?:特别行政区|自治州|地区|市)$/, "");
}

function extractZhCity(geo: {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    municipality?: string;
  };
}): string {
  const addr = geo.address;
  const candidates = [
    addr?.municipality,
    addr?.city,
    addr?.state,
    ...(geo.display_name ? geo.display_name.split(",").map((s) => s.trim()) : []),
    addr?.town,
    addr?.county,
  ].filter((v): v is string => Boolean(v && /[\u4e00-\u9fff]/.test(v)));

  for (const c of candidates) {
    if (MUNICIPALITIES.has(c)) return cleanZhPlace(c);
  }
  for (const c of candidates) {
    if (c.endsWith("市") || c.endsWith("自治州") || c.endsWith("特别行政区")) {
      return cleanZhPlace(c);
    }
  }
  return candidates[0] ? cleanZhPlace(candidates[0]) : "";
}

async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs = 2000,
  extraHeaders?: Record<string, string>,
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json", ...extraHeaders },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveZhCityForAsset(
  origin: string,
  key: string,
  assetId: string,
  fallbackCity?: string | null,
): Promise<string> {
  const cachedAsset = assetCityCache.get(assetId);
  if (cachedAsset !== undefined) return cachedAsset;

  const asset = await fetchJsonWithTimeout<{
    exifInfo?: { latitude?: number | null; longitude?: number | null; city?: string | null };
  }>(`${origin}/api/assets/${assetId}?key=${encodeURIComponent(key)}`, 1500);

  const lat = asset?.exifInfo?.latitude;
  const lon = asset?.exifInfo?.longitude;
  if (typeof lat === "number" && typeof lon === "number" && Number.isFinite(lat) && Number.isFinite(lon)) {
    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cachedCoord = coordCityCache.get(coordKey);
    if (cachedCoord) {
      assetCityCache.set(assetId, cachedCoord);
      return cachedCoord;
    }

    const geo = await fetchJsonWithTimeout<{
      display_name?: string;
      address?: { city?: string; town?: string; county?: string; state?: string; municipality?: string };
    }>(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}&zoom=10&accept-language=zh-CN`,
      1600,
      { "user-agent": "astroyu.com/1.0 (https://astroyu.com)" },
    );
    const zhCity = geo ? extractZhCity(geo) : "";
    if (zhCity) {
      coordCityCache.set(coordKey, zhCity);
      assetCityCache.set(assetId, zhCity);
      return zhCity;
    }
  }

  const rawCity = asset?.exifInfo?.city?.trim() || fallbackCity?.trim() || "";
  const mapped = (rawCity && EN_CITY_FALLBACK[rawCity]) || rawCity;
  if (mapped) assetCityCache.set(assetId, mapped);
  return mapped;
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

  const rawItems: Array<{ id: string; dateText: string; fallbackCity: string | null }> = [];
  for (const bucket of buckets) {
    if (rawItems.length >= limit) break;
    const data = await fetchJsonWithTimeout<{
      id?: string[];
      isImage?: boolean[];
      isTrashed?: boolean[];
      fileCreatedAt?: string[];
      city?: (string | null)[];
    }>(
      `${meta.origin}/api/timeline/bucket?albumId=${encodeURIComponent(meta.albumId)}&timeBucket=${encodeURIComponent(bucket.timeBucket)}&key=${encodeURIComponent(meta.key)}`,
    );
    if (!data?.id) continue;

    for (let i = 0; i < data.id.length && rawItems.length < limit; i++) {
      const id = data.id[i];
      if (!id || data.isImage?.[i] === false || data.isTrashed?.[i] === true) continue;
      const dateText = formatPhotoDate(data.fileCreatedAt?.[i]) || bucket.timeBucket.replace(/-/g, ".");
      rawItems.push({
        id,
        dateText,
        fallbackCity: data.city?.[i] ?? null,
      });
    }
  }

  return Promise.all(
    rawItems.map(async (item) => {
      const city = await resolveZhCityForAsset(meta.origin, meta.key, item.id, item.fallbackCity);
      const label = city ? `${city} · ${item.dateText}` : item.dateText;
      return {
        id: item.id,
        src: `/api/photos/${item.id}`,
        alt: label ? `与航的近影 · ${label}` : "与航的近影",
        meta: label,
      };
    }),
  );
}
