"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export default function Postcard({ children }: { children: ReactNode }) {
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
    <figure className="postcard hero-frame">
      <img
        className="hero-image"
        src="/hero-yuhang-temple.jpg"
        alt="与航和朋友在天坛的手绘旅行画"
        width={1086}
        height={1448}
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-copy">{children}</div>
      <figcaption className="hero-caption">
        天地这么大，我们恰好在这一刻并肩而立。
      </figcaption>
      <button
        className="hero-expand"
        type="button"
        onClick={() => setExpanded(true)}
        aria-label="放大查看天坛明信片"
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" />
        </svg>
      </button>
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
        <svg className="postmark hero-dialog-mark" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="postmark-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
          <circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="31" />
          <text className="postmark-ring"><textPath href="#postmark-ring" textLength="246" lengthAdjust="spacing">TEMPLE OF HEAVEN · BEIJING · JANUARY 2026 ·</textPath></text>
          <text className="postmark-day" x="60" y="58" textAnchor="middle">01.31</text>
          <text className="postmark-year" x="60" y="72" textAnchor="middle">天坛</text>
        </svg>
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
