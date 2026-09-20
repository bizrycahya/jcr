"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type IndicatorRow = { id: string; nama: string; nilai: number | null };
type CategoryRow = { id: string; label: string; indicators: IndicatorRow[] };

const NILAI_OPTIONS = [
  { value: 1, label: "1 - Kurang" },
  { value: 2, label: "2 - Cukup" },
  { value: 3, label: "3 - Baik" },
  { value: 4, label: "4 - Sangat Baik" },
];

export function ScoreDialog({
  open,
  onClose,
  onSaved,
  studentId,
  studentName,
  bulan,
  tahun,
  teacherId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  studentId: string | null;
  studentName: string;
  bulan: number;
  tahun: number;
  teacherId: string;
}) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !studentId) return;

    setLoading(true);
    fetch(`/api/penilaian/${studentId}?bulan=${bulan}&tahun=${tahun}`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.categories ?? []);
        const initial: Record<string, number> = {};
        (json.categories ?? []).forEach((cat: CategoryRow) => {
          cat.indicators.forEach((ind) => {
            if (ind.nilai) initial[ind.id] = ind.nilai;
          });
        });
        setValues(initial);
        setLoading(false);
      });
  }, [open, studentId, bulan, tahun]);

  if (!open || !studentId) return null;

  async function handleSubmit() {
    const scores = Object.entries(values).map(([indicatorId, nilai]) => ({
      indicatorId,
      nilai,
    }));

    if (scores.length === 0) {
      toast.error("Isi minimal satu indikator.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/penilaian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, teacherId, bulan, tahun, scores }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan penilaian.");
      return;
    }

    toast.success("Penilaian berhasil disimpan.");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg text-maroon-900">Input Nilai Karakter</h2>
            <p className="mt-0.5 text-sm text-maroon-800/50">
              {studentName} — Periode {bulan}/{tahun}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-maroon-800/40">Memuat indikator...</p>
        ) : (
          <div className="mt-4 space-y-5">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="mb-2 text-sm font-semibold text-maroon-800">{cat.label}</h3>
                <div className="space-y-2">
                  {cat.indicators.length === 0 ? (
                    <p className="text-xs text-maroon-800/40">Belum ada indikator di kategori ini.</p>
                  ) : (
                    cat.indicators.map((ind) => (
                      <div
                        key={ind.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-maroon-50/50 px-3 py-2.5"
                      >
                        <span className="text-sm text-maroon-900">{ind.nama}</span>
                        <select
                          value={values[ind.id] ?? ""}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, [ind.id]: Number(e.target.value) }))
                          }
                          className="rounded-lg border border-maroon-900/15 px-2 py-1.5 text-sm outline-none focus:border-gold-500"
                        >
                          <option value="">Pilih nilai</option>
                          {NILAI_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-maroon-900/15 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Penilaian"}
          </button>
        </div>
      </div>
    </div>
  );
}