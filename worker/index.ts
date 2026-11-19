/** Cloudflare Worker entry point for astroyu.com. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { getPhotosShareUrl, resolveSharedAlbum } from "../app/lib/photos";

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: Fetcher;
  PHOTOS_SHARE_URL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const SECURITY_HEADERS: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

function withSecurityHeaders(response: Response, overrides?: Record<string, string>): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      headers.set(key, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getEdgeCache(): Cache | null {
  if (typeof caches === "undefined") return null;
  const cacheStorage = caches as CacheStorage & { default?: Cache };
  return cacheStorage.default ?? null;
}

async function handlePhotoProxy(
  request: Request,
  assetId: string,
  size: "preview" | "fullsize",
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const edgeCache = getEdgeCache();
  const cacheKey = new Request(
    `https://cache.astroyu.internal/photo/${assetId}?size=${size}`,
    { method: "GET" },
  );

  if (edgeCache) {
    const cached = await edgeCache.match(cacheKey).catch(() => undefined);
    if (cached) return withSecurityHeaders(cached);
  }

  const share = await resolveSharedAlbum(getPhotosShareUrl(env.PHOTOS_SHARE_URL));
  if (!share) return withSecurityHeaders(new Response("Not found", { status: 404 }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  let upstream: Response;
  try {
    upstream = await fetch(
      `${share.origin}/api/assets/${assetId}/thumbnail?size=${size}&key=${encodeURIComponent(share.key)}`,
      { signal: controller.signal },
    );
  } catch {
    return withSecurityHeaders(new Response("Upstream timeout", { status: 504 }));
  } finally {
    clearTimeout(timer);
  }

  if (!upstream.ok) {
    return withSecurityHeaders(new Response("Not found", { status: upstream.status === 404 ? 404 : 502 }));
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return withSecurityHeaders(new Response("Invalid upstream media type", { status: 502 }));
  }

  const headers = new Headers({
    "content-type": contentType,
    "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    ...SECURITY_HEADERS,
  });
  const etag = upstream.headers.get("etag");
  if (etag) headers.set("etag", etag);

  const response = new Response(upstream.body, { status: 200, headers });
  if (edgeCache && request.method === "GET") {
    ctx.waitUntil(edgeCache.put(cacheKey, response.clone()).catch(() => {}));
  }
  return response;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.astroyu.com") {
      url.hostname = "astroyu.com";
      return Response.redirect(url.toString(), 301);
    }

    if (env.PHOTOS_SHARE_URL && typeof process !== "undefined") {
      process.env.PHOTOS_SHARE_URL = env.PHOTOS_SHARE_URL;
    }

    const photoMatch = url.pathname.match(/^\/api\/photos\/([0-9a-f-]{36})$/i);
    if (photoMatch && (request.method === "GET" || request.method === "HEAD")) {
      const size = url.searchParams.get("size") === "fullsize" ? "fullsize" : "preview";
      const res = await handlePhotoProxy(request, photoMatch[1], size, env, ctx);
      return request.method === "HEAD" ? new Response(null, { status: res.status, headers: res.headers }) : res;
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const res = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(res);
    }

    const response = await handler.fetch(request, env, ctx);
    const isHtmlDoc =
      request.method === "GET" &&
      url.pathname === "/" &&
      response.status === 200 &&
      !request.headers.has("rsc") &&
      (response.headers.get("content-type") ?? "").includes("text/html");

    return withSecurityHeaders(
      response,
      isHtmlDoc
        ? { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" }
        : undefined,
    );
  },
};

export default worker;
