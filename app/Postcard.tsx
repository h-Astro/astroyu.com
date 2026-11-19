"use client";

import { useCallback, useState } from "react";
import { Maximize2 } from "lucide-react";
import LightboxDialog from "./LightboxDialog";

export default function Postcard() {
  const [expanded, setExpanded] = useState(false);
  const handleClose = useCallback(() => setExpanded(false), []);

  return (
    <figure className="postcard relative mx-auto my-auto w-full max-w-[600px] py-3 pr-2 pl-7 sm:pt-8 sm:pr-16 sm:pb-24 sm:pl-20 lg:mr-0 lg:ml-auto">
      <div className="postcard-stage relative mx-auto w-full max-w-[392px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-5 -right-3 z-20 size-[clamp(82px,9vw,124px)] border border-[var(--hero-outline)] sm:-top-8 sm:-right-9"
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
            <Maximize2 className="size-4" strokeWidth={1.6} />
          </span>
        </button>
        <div className="pointer-events-none absolute top-[18%] -left-7 z-20 grid size-[clamp(96px,10.2vw,132px)] -rotate-12 place-items-center sm:-left-18">
          <svg className="postmark" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="postmark-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
            <circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="31" />
            <text className="postmark-ring"><textPath href="#postmark-ring" textLength="246" lengthAdjust="spacing">TEMPLE OF HEAVEN · BEIJING · JANUARY 2026 ·</textPath></text>
            <text className="postmark-day" x="60" y="58" textAnchor="middle">01.31</text>
            <text className="postmark-year" x="60" y="72" textAnchor="middle">天坛</text>
          </svg>
        </div>
        <figcaption className="postcard-card relative z-20 mt-3 ml-auto w-[min(100%,292px)] rounded-[4px] border border-[var(--hero-card-line)] bg-[var(--hero-card-bg)] px-4 py-3 text-[14.5px] leading-[1.9] font-normal tracking-[0.04em] text-[var(--hero-inscription)] backdrop-blur-sm sm:absolute sm:-right-16 sm:-bottom-16 sm:mt-0 sm:w-[clamp(248px,22vw,304px)] sm:px-5 sm:py-3.5 sm:text-[15px]">
          <span className="block">天地这么大，</span>
          <span className="block">我们恰好在这一刻并肩而立。</span>
        </figcaption>
      </div>
      <LightboxDialog
        open={expanded}
        label="天坛明信片"
        closeLabel="关闭明信片"
        onClose={handleClose}
        className="postcard-dialog max-h-[90svh] max-w-[min(90vw,680px)] overflow-visible border-0 bg-white p-3 shadow-[0_30px_100px_#0005] backdrop:bg-[#151923cc] backdrop:backdrop-blur-[10px]"
      >
        <img
          className="max-h-[calc(90svh-24px)] w-auto object-contain"
          src="/hero-yuhang-temple.jpg"
          alt="与航和朋友在天坛的手绘旅行画"
          width={1086}
          height={1448}
        />
      </LightboxDialog>
    </figure>
  );
}
