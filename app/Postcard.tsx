"use client";

import { useEffect, useRef, useState } from "react";

export default function Postcard() {
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (expanded) dialog.showModal();
    else dialog.close();
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [expanded]);

  return (
    <figure className="postcard relative mx-auto my-auto w-full max-w-[600px] py-3 pr-2 pl-7 sm:pt-8 sm:pr-16 sm:pb-20 sm:pl-20 lg:mr-0 lg:ml-auto">
      <div className="postcard-stage relative mx-auto w-full max-w-[392px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-5 -right-3 z-20 size-[clamp(82px,9vw,124px)] bg-[var(--hero-tile-green)] sm:-top-8 sm:-right-9"
        />
        <button
          className="postcard-button group relative block w-full cursor-zoom-in overflow-hidden border-0 bg-[var(--hero-art-paper)] p-0 focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="放大查看天坛明信片"
          aria-haspopup="dialog"
        >
          <span className="postcard-image block overflow-hidden">
            <img
              className="block aspect-[3/4] h-auto w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.015]"
              src="/hero-yuhang-temple.jpg"
              alt="与航和朋友在天坛的手绘旅行画"
              width={1086}
              height={1448}
              fetchPriority="high"
              decoding="async"
            />
          </span>
          <span
            className="image-expand absolute bottom-3 left-3 z-10 grid size-8 place-items-center rounded-full bg-[#1b2826]/45 text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" />
            </svg>
          </span>
        </button>
        <div className="pointer-events-none absolute top-[18%] -left-7 z-20 grid size-[clamp(96px,10.6vw,142px)] place-items-center bg-[var(--hero-tile-blue)] p-2.5 backdrop-blur-[4px] sm:-left-22 sm:p-3">
          <svg className="postmark" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="postmark-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
            <circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="31" />
            <text className="postmark-ring"><textPath href="#postmark-ring" textLength="246" lengthAdjust="spacing">TEMPLE OF HEAVEN · BEIJING · JANUARY 2026 ·</textPath></text>
            <text className="postmark-day" x="60" y="58" textAnchor="middle">01.31</text>
            <text className="postmark-year" x="60" y="72" textAnchor="middle">天坛</text>
          </svg>
        </div>
        <figcaption className="postcard-card relative z-20 mt-3 ml-auto w-[min(100%,292px)] border border-[var(--hero-card-line)] bg-[var(--hero-card-bg)] px-4 py-3 font-sans text-[13px] leading-[1.6] text-[var(--hero-ink)] backdrop-blur-md sm:absolute sm:-right-14 sm:-bottom-[68px] sm:mt-0 sm:w-[clamp(236px,21vw,288px)] sm:px-5 sm:py-3.5">
          <span className="block font-medium">天地这么大，</span>
          <span className="block text-[var(--hero-muted)]">我们恰好在这一刻并肩而立。</span>
        </figcaption>
      </div>
      <dialog
        ref={dialogRef}
        className="postcard-dialog max-h-[90svh] max-w-[min(90vw,680px)] overflow-visible border-0 bg-white p-3 shadow-[0_30px_100px_#0005] backdrop:bg-[#151923cc] backdrop:backdrop-blur-[10px]"
        aria-label="天坛明信片"
        onCancel={() => setExpanded(false)}
        onClose={() => setExpanded(false)}
        onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}
      >
        <button
          className="dialog-close absolute top-3 right-3 grid size-[42px] cursor-pointer place-items-center rounded-full border border-[#22293620] bg-[#ffffffe8] text-[#222936]"
          type="button"
          aria-label="关闭明信片"
          onClick={() => setExpanded(false)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <img
          className="max-h-[calc(90svh-24px)] w-auto object-contain"
          src="/hero-yuhang-temple.jpg"
          alt="与航和朋友在天坛的手绘旅行画"
          width={1086}
          height={1448}
        />
      </dialog>
    </figure>
  );
}
