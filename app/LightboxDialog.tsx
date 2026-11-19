"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
  className,
  children,
}: LightboxDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className={className} closeLabel={closeLabel}>
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">{label}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
