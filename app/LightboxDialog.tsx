"use client";

import { useEffect, useRef, type ReactNode } from "react";

type LightboxDialogProps = {
  open: boolean;
  label: string;
  closeLabel: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

export default function LightboxDialog({
  open,
  label,
  closeLabel,
  onClose,
  className = "",
  children,
}: LightboxDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={className}
      aria-label={label}
      onCancel={onClose}
      onClose={onClose}
    >
      <button
        className="dialog-close absolute top-3 right-3 grid size-[40px] cursor-pointer place-items-center rounded-full border border-[#22293620] bg-[#ffffffe8] text-[#222936]"
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      {children}
    </dialog>
  );
}
