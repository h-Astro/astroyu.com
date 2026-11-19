"use client";

import { useCallback, useState } from "react";
import LightboxDialog from "./LightboxDialog";
import type { PhotoItem } from "./lib/photos";

export default function PhotosStrip({ photos }: { photos: PhotoItem[] }) {
  const [active, setActive] = useState<PhotoItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const handleClose = useCallback(() => setActive(null), []);

  const durationSec = Math.max(40, photos.length * 12);
  const track = [...photos, ...photos];
  const hasFocus = focusedIndex !== null;

  return (
    <>
      <div
        className="photos-marquee w-full overflow-hidden pt-8"
        onPointerLeave={() => setFocusedIndex(null)}
      >
        <ul
          className="photos-grid flex w-max list-none items-start gap-5 p-0 pr-5 sm:gap-6 sm:pr-6"
          style={{
            animation: `photos-marquee ${durationSec}s linear infinite`,
            animationPlayState: hasFocus || active ? "paused" : undefined,
          }}
        >
          {track.map((photo, index) => {
            const isClone = index >= photos.length;
            const isFocused = focusedIndex === index;
            const isDimmed = hasFocus && !isFocused;
            return (
              <li
                className={`relative w-[78vw] shrink-0 transition-[opacity,filter] duration-300 ease-out sm:w-[46vw] lg:w-[36vw] lg:max-w-[540px] ${
                  isDimmed ? "opacity-45 blur-[2px]" : "opacity-100 blur-0"
                }`}
                key={`${photo.id}-${index}`}
                aria-hidden={isClone || undefined}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
                onPointerDown={() => setFocusedIndex(index)}
                onPointerUp={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
                onPointerCancel={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
              >
                <span
                  aria-hidden={!isFocused}
                  className={`pointer-events-none absolute -top-7 left-0 font-mono text-[13px] leading-none font-medium tracking-[0.01em] text-[var(--ink)] transition-opacity duration-200 ${
                    isFocused ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {photo.meta}
                </span>
                <button
                  className="group block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
                  type="button"
                  tabIndex={isClone ? -1 : undefined}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
                  onClick={() => {
                    setFocusedIndex(null);
                    setActive(photo);
                  }}
                  aria-label={`放大查看 ${photo.title ?? photo.meta}`}
                  aria-haspopup="dialog"
                >
                  <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-[var(--line)] bg-[var(--soft)]">
                    <img
                      className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                      src={photo.src}
                      alt={isClone ? "" : photo.alt}
                      width={800}
                      height={500}
                      decoding="async"
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <LightboxDialog
        open={active !== null}
        label={active?.title ?? "近影预览"}
        closeLabel="关闭照片"
        onClose={handleClose}
        className="max-h-[90svh] max-w-[min(92vw,860px)] overflow-visible border-0 bg-[var(--paper)] p-3 shadow-[0_30px_100px_#0005] backdrop:bg-[#151923cc] backdrop:backdrop-blur-[10px]"
      >
        {active && (
          <figure className="m-0">
            <img
              className="max-h-[calc(90svh-86px)] w-auto rounded-[2px] object-contain"
              src={`${active.src}?size=fullsize`}
              alt={active.alt}
              width={800}
              height={500}
            />
            <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm text-[var(--ink)]">
              {active.title && <span className="font-medium">{active.title}</span>}
              <span className="font-mono text-xs text-[var(--muted)]">{active.meta}</span>
            </figcaption>
          </figure>
        )}
      </LightboxDialog>
    </>
  );
}
