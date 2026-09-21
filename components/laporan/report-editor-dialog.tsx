"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type DetailDraft = {
  categoryId: string;
  categoryLabel: string;
  indikator: string;
  capaian: string;
};

export function ReportEditorDialog({
  open,
  onClose,
  onSaved,
  studentId,
  studentName,
  bulan,
  tahun,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  studentId: string | null;
  studentName: string;
  bulan: number;
  tahun: number;
}) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [academicYearId, setAcademicYearId] = useState("");
  const [rataRata, setRataRata] = useState(0);
  const [predikatUmum, setPredikatUmum] = useState("");
  const [details, setDetails] = useState<DetailDraft[]>([]);
  const [catatanWali, setCatatanWali] = useState("");
  const [rencanaTindakLanjut, setRencanaTindakLanjut] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerate() {
    if (!studentId) return;
    setLoading(true);
    const res = await fetch("/api/laporan/bulanan/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, bulan, tahun }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal membuat draft laporan.");
      return;
    }

    setAcademicYearId(json.academicYearId);
    setRataRata(json.rataRata);
    setPredikatUmum(json.predikatUmum);
    setDetails(json.details);
    setGenerated(true);
  }

  function resetState() {
    setGenerated(false);
    setDetails([]);
    setCatatanWali("");
    setRencanaTindakLanjut("");
  }

  if (!open || !studentId) return null;

  async function handleSave() {
    setSubmitting(true);
    const res = await fetch("/api/laporan/bulanan/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        academicYearId,
        bulan,
        tahun,
        rataRata,
        predikatUmum,
        catatanWali,
        rencanaTindakLanjut,
        details: details.map((d) => ({
          categoryId: d.categoryId,
          indikator: d.indikator,
          capaian: d.capaian,
        })),
      }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan laporan.");
      return;
    }

    toast.success("Laporan berhasil disimpan.");
    resetState();
    onSaved();
    onClose();
  }

  function updateCapaian(index: number, value: string) {
    setDetails((prev) => prev.map((d, i) => (i === index ? { ...d, capaian: value } : d)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg text-maroon-900">Buat Laporan Bulanan</h2>
            <p className="mt-0.5 text-sm text-maroon-800/50">
              {studentName} — Periode {bulan}/{tahun}
            </p>
          </div>
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

        {!generated ? (
          <div className="mt-6 flex flex-col items-center gap-4 py-8">
            <p className="text-center text-sm text-maroon-800/60">
              Klik tombol di bawah untuk membuat draft otomatis berdasarkan rata-rata nilai karakter bulan ini.
              Kamu bisa mengedit teksnya sebelum disimpan.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
            >
              {loading ? "Membuat draft..." : "Buat Draft Otomatis"}
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            <div className="rounded-xl bg-maroon-50/50 p-3 text-sm text-maroon-800">
              Rata-rata keseluruhan: <strong>{rataRata.toFixed(2)}</strong> — Predikat: <strong>{predikatUmum}</strong>
            </div>

            {details.map((d, i) => (
              <div key={d.categoryId}>
                <h3 className="mb-1.5 text-sm font-semibold text-maroon-800">{d.categoryLabel}</h3>
                <p className="mb-1.5 text-xs text-maroon-800/50">Indikator: {d.indikator}</p>
                <textarea
                  value={d.capaian}
                  onChange={(e) => updateCapaian(i, e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-maroon-800">Catatan Pendamping (Wali Kelas)</label>
              <textarea
                value={catatanWali}
                onChange={(e) => setCatatanWali(e.target.value)}
                rows={3}
                placeholder="Catatan tambahan dari wali kelas..."
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-maroon-800">Rencana Tindak Lanjut Pembinaan</label>
              <textarea
                value={rencanaTindakLanjut}
                onChange={(e) => setRencanaTindakLanjut(e.target.value)}
                rows={3}
                placeholder="Rencana pembinaan ke depan..."
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
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
              {submitting ? "Menyimpan..." : "Simpan Laporan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}