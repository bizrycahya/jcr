"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ReportEditorDialog } from "./report-editor-dialog";

type ClassOption = { id: string; nama: string };
type StudentRow = {
  id: string;
  nama: string;
  nis: string;
  hasScores: boolean;
  reportId: string | null;
  pdfUrl: string | null;
};

const BULAN_OPTIONS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function LaporanManager() {
  const now = new Date();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState("");
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<StudentRow | null>(null);

  const fetchData = useCallback(async () => {
    if (!classId) {
      setStudents([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ classId, bulan: String(bulan), tahun: String(tahun) });
    const res = await fetch(`/api/laporan/bulanan?${params.toString()}`);
    const json = await res.json();

    if (res.ok) {
      setStudents(json.data);
      if (json.classes) setClasses(json.classes);
    } else {
      toast.error(json.message ?? "Gagal memuat data.");
    }
    setLoading(false);
  }, [classId, bulan, tahun]);

  useEffect(() => {
    fetch("/api/laporan/bulanan")
      .then((res) => res.json())
      .then((json) => setClasses(json.classes ?? []));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Laporan Bulanan</h1>
        <p className="text-sm text-maroon-800/50">
          Buat rapor perkembangan karakter siswa (JANIC Character Report) per bulan.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">Pilih Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nama}</option>
          ))}
        </select>
        <select
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          {BULAN_OPTIONS.map((b, i) => (
            <option key={i} value={i + 1}>{b}</option>
          ))}
        </select>
        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="w-24 rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        />
      </div>

      {!classId ? (
        <EmptyState icon={FileText} title="Pilih kelas untuk mulai" description="Pilih kelas, bulan, dan tahun laporan di atas." />
      ) : loading ? (
        <p className="py-10 text-center text-sm text-maroon-800/40">Memuat data...</p>
      ) : students.length === 0 ? (
        <EmptyState icon={FileText} title="Belum ada siswa di kelas ini" description="Tambahkan siswa terlebih dahulu." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">NIS</th>
                <th className="px-4 py-3">Status Nilai</th>
                <th className="px-4 py-3">Status Laporan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                  <td className="px-4 py-3 text-maroon-900">{s.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.nis}</td>
                  <td className="px-4 py-3">
                    {s.hasScores ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">Sudah dinilai</span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700">Belum dinilai</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.reportId ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">Sudah dibuat</span>
                    ) : (
                      <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-xs text-maroon-700">Belum dibuat</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          if (!s.hasScores) {
                            toast.error("Isi nilai karakter siswa ini terlebih dahulu di menu Penilaian.");
                            return;
                          }
                          setTarget(s);
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
                      >
                        {s.reportId ? "Edit Laporan" : "Buat Laporan"}
                      </button>
                      {s.pdfUrl && (
                        <a
                          href={s.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReportEditorDialog
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onSaved={fetchData}
        studentId={target?.id ?? null}
        studentName={target?.nama ?? ""}
        bulan={bulan}
        tahun={tahun}
      />
    </div>
  );
}
