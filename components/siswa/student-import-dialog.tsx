"use client";

import { useState } from "react";
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type ImportResult = {
  successCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
};

export function StudentImportDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/siswa/import", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal memproses file.");
      return;
    }

    setResult(json);
    if (json.successCount > 0) {
      toast.success(`${json.successCount} siswa berhasil diimport.`);
      onImported();
    }
    if (json.errorCount > 0) {
      toast.error(`${json.errorCount} baris gagal diimport.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg text-maroon-900">Import Data Siswa</h2>
            <p className="mt-1 text-sm text-maroon-800/60">
              Unggah file Excel untuk menambahkan banyak siswa sekaligus.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <a href="/api/siswa/template" className="mt-4 flex items-center gap-2 rounded-xl border border-maroon-900/15 px-4 py-2.5 text-sm text-maroon-800 hover:bg-maroon-900/5">
          <Download className="h-4 w-4" />
          Download Template Excel
        </a>

        <div className="mt-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-maroon-900/15 px-4 py-8 text-center hover:border-gold-500">
            <FileSpreadsheet className="h-8 w-8 text-maroon-800/40" />
            <span className="mt-2 text-sm text-maroon-800/70">
              {file ? file.name : "Klik untuk pilih file .xlsx"}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setResult(null);
              }}
            />
          </label>
        </div>

        {result && (
          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-maroon-900/10 p-3">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {result.successCount} baris berhasil diimport
            </div>
            {result.errors.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {result.errorCount} baris gagal:
                </div>
                <ul className="ml-6 list-disc space-y-0.5 text-xs text-maroon-800/70">
                  {result.errors.map((err, i) => (
                    <li key={i}>
                      Baris {err.row}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-xl border border-maroon-900/15 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            Tutup
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Memproses..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
