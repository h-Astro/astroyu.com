/** Cloudflare Worker entry point for astroyu.com. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { getPhotosShareUrl, resolveSharedAlbum } from "../app/lib/photos";

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

let cachedShare: { url: string; origin: string; key: string; expiresAt: number } | null = null;

async function getShareTarget(shareUrl: string): Promise<{ origin: string; key: string } | null> {
  const now = Date.now();
  if (cachedShare && cachedShare.url === shareUrl && cachedShare.expiresAt > now) {
    return { origin: cachedShare.origin, key: cachedShare.key };
  }
  const resolved = await resolveSharedAlbum(shareUrl);
  if (!resolved) return null;
  cachedShare = { url: shareUrl, origin: resolved.origin, key: resolved.key, expiresAt: now + 10 * 60 * 1000 };
  return { origin: resolved.origin, key: resolved.key };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

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
    if (photoMatch && request.method === "GET") {
      const share = await getShareTarget(getPhotosShareUrl(env.PHOTOS_SHARE_URL));
      if (!share) return new Response("Not found", { status: 404 });

      const size = url.searchParams.get("size") === "fullsize" ? "fullsize" : "preview";
      const upstream = await fetch(
        `${share.origin}/api/assets/${photoMatch[1]}/thumbnail?size=${size}&key=${encodeURIComponent(share.key)}`,
      );
      if (!upstream.ok) return new Response("Not found", { status: upstream.status });

      const headers = new Headers();
      headers.set("content-type", upstream.headers.get("content-type") ?? "image/webp");
      headers.set("cache-control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
      return new Response(upstream.body, { status: 200, headers });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
