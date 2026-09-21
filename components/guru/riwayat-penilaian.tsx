"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { History } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

type ScoreRow = {
  id: string;
  nilai: number;
  predikat: string;
  bulan: number;
  tahun: number;
  createdAt: string;
  student: { nama: string };
  indicator: { nama: string; category: { label: string } };
};

const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function RiwayatPenilaian() {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/guru/riwayat?page=${page}`);
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
      setTotalPages(json.pagination.totalPages || 1);
    } else {
      toast.error(json.message ?? "Gagal memuat riwayat.");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Riwayat Penilaian</h1>
        <p className="text-sm text-maroon-800/50">Daftar nilai karakter yang pernah Anda input.</p>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState icon={History} title="Belum ada riwayat penilaian" description="Nilai yang Anda input akan muncul di sini." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Indikator</th>
                <th className="px-4 py-3">Nilai</th>
                <th className="px-4 py-3">Periode</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-maroon-800/40">Memuat data...</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                    <td className="px-4 py-3 text-maroon-900">{r.student.nama}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{r.indicator.category.label}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{r.indicator.nama}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{r.nilai} - {r.predikat}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{BULAN_LABEL[r.bulan - 1]} {r.tahun}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-maroon-800/60">Halaman {page} dari {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}