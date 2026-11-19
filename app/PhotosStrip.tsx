"use client";

import { useEffect, useRef, useState } from "react";
import type { PhotoItem } from "./lib/photos";

export default function PhotosStrip({ photos }: { photos: PhotoItem[] }) {
  const [active, setActive] = useState<PhotoItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [active]);

  return (
    <>
      <ul className="photos-grid grid w-full list-none grid-cols-1 gap-x-6 gap-y-8 p-0 sm:grid-cols-3">
        {photos.map((photo) => (
          <li className="min-w-0" key={photo.id}>
            <button
              className="group block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
              type="button"
              onClick={() => setActive(photo)}
              aria-label={`放大查看 ${photo.title ?? photo.meta}`}
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-[var(--line)] bg-[var(--soft)]">
                <img
                  className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  decoding="async"
                />
              </span>
              {photo.title && (
                <span className="mt-3.5 block text-[clamp(15px,1.2vw,17px)] leading-[1.45] font-medium tracking-[-0.015em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                  {photo.title}
                </span>
              )}
              <span className={`${photo.title ? "mt-1" : "mt-3"} block font-mono text-[12px] leading-[1.5] text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]`}>
                {photo.meta}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="max-h-[90svh] max-w-[min(92vw,860px)] overflow-visible border-0 bg-[var(--paper)] p-3 shadow-[0_30px_100px_#0005] backdrop:bg-[#151923cc] backdrop:backdrop-blur-[10px]"
        aria-label={active?.title ?? "近影预览"}
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}
      >
        <button
          className="absolute top-3 right-3 grid size-[40px] cursor-pointer place-items-center rounded-full border border-[#22293620] bg-[#ffffffe8] text-[#222936]"
          type="button"
          aria-label="关闭照片"
          onClick={() => setActive(null)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        {active && (
          <figure className="m-0">
            <img
              className="max-h-[calc(90svh-86px)] w-auto rounded-[2px] object-contain"
              src={`${active.src}?size=fullsize`}
              alt={active.alt}
              width={800}
              height={600}
            />
            <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm text-[var(--ink)]">
              {active.title && <span className="font-medium">{active.title}</span>}
              <span className="font-mono text-xs text-[var(--muted)]">{active.meta}</span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
