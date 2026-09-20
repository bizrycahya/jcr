"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Hapus",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-maroon-700">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}