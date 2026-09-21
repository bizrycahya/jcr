"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export function SemesterReportDialog({
  open,
  onClose,
  onSaved,
  studentId,
  studentName,
  academicYearId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  studentId: string | null;
  studentName: string;
  academicYearId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [rataRata, setRataRata] = useState(0);
  const [predikatUmum, setPredikatUmum] = useState("");
  const [summary, setSummary] = useState<{ categoryId: string; categoryLabel: string; rataRata: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!open || !studentId) return null;

  function resetState() {
    setGenerated(false);
    setSummary([]);
  }

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/laporan/semester/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, academicYearId }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal membuat rekap semester.");
      return;
    }

    setMonthlyCount(json.monthlyCount);
    setRataRata(json.rataRata);
    setPredikatUmum(json.predikatUmum);
    setSummary(json.summary);
    setGenerated(true);
  }

  async function handleSave() {
    setSubmitting(true);
    const res = await fetch("/api/laporan/semester/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, academicYearId, rataRata, predikatUmum }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan laporan semester.");
      return;
    }

    toast.success("Laporan semester berhasil disimpan.");
    resetState();
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">Laporan Semester</h2>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-0.5 text-sm text-maroon-800/50">{studentName}</p>

        {!generated ? (
          <div className="mt-6 flex flex-col items-center gap-4 py-8">
            <p className="text-center text-sm text-maroon-800/60">
              Rekap ini dihitung otomatis dari rata-rata seluruh laporan bulanan pada tahun ajaran ini.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
            >
              {loading ? "Menghitung..." : "Hitung Rekap Semester"}
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-maroon-50/50 p-3 text-sm text-maroon-800">
              Berdasarkan <strong>{monthlyCount}</strong> laporan bulanan. Rata-rata keseluruhan:{" "}
              <strong>{rataRata.toFixed(2)}</strong> — Predikat: <strong>{predikatUmum}</strong>
            </div>

            <div className="space-y-2">
              {summary.map((s) => (
                <div key={s.categoryId} className="flex items-center justify-between rounded-xl bg-maroon-50/30 px-3 py-2">
                  <span className="text-sm text-maroon-900">{s.categoryLabel}</span>
                  <span className="text-sm font-medium text-maroon-800">{s.rataRata.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {generated && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                resetState();
                onClose();
              }}
              className="rounded-xl border border-maroon-900/15 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Laporan Semester"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}