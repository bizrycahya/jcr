"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SemesterReportDialog } from "./semester-report-dialog";

type ClassOption = { id: string; nama: string };
type AcademicYearOption = { id: string; tahun: string; semester: number };
type StudentRow = {
  id: string;
  nama: string;
  nis: string;
  monthlyCount: number;
  reportId: string | null;
  pdfUrl: string | null;
};

export function SemesterLaporanManager() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [classId, setClassId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<StudentRow | null>(null);

  const fetchData = useCallback(async () => {
    if (!classId || !academicYearId) {
      setStudents([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ classId, academicYearId });
    const res = await fetch(`/api/laporan/semester?${params.toString()}`);
    const json = await res.json();

    if (res.ok) {
      setStudents(json.data);
      if (json.classes) setClasses(json.classes);
      if (json.academicYears) setAcademicYears(json.academicYears);
    } else {
      toast.error(json.message ?? "Gagal memuat data.");
    }
    setLoading(false);
  }, [classId, academicYearId]);

  useEffect(() => {
    fetch("/api/laporan/semester")
      .then((res) => res.json())
      .then((json) => {
        setClasses(json.classes ?? []);
        setAcademicYears(json.academicYears ?? []);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Laporan Semester</h1>
        <p className="text-sm text-maroon-800/50">
          Rekap perkembangan karakter siswa satu semester, dihitung dari laporan bulanan.
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
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">Pilih Tahun Ajaran</option>
          {academicYears.map((ay) => (
            <option key={ay.id} value={ay.id}>{ay.tahun} - Semester {ay.semester}</option>
          ))}
        </select>
      </div>

      {!classId || !academicYearId ? (
        <EmptyState icon={FileText} title="Pilih kelas dan tahun ajaran" description="Pilih kelas dan tahun ajaran di atas untuk melihat data." />
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
                <th className="px-4 py-3">Laporan Bulanan</th>
                <th className="px-4 py-3">Status Semester</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                  <td className="px-4 py-3 text-maroon-900">{s.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.nis}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.monthlyCount} bulan</td>
                  <td className="px-4 py-3">
                    {s.reportId ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">Sudah dibuat</span>
                    ) : (
                      <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-xs text-maroon-700">Belum dibuat</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (s.monthlyCount === 0) {
                          toast.error("Belum ada laporan bulanan untuk siswa ini.");
                          return;
                        }
                        setTarget(s);
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
                    >
                      {s.reportId ? "Edit Rekap" : "Buat Rekap"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SemesterReportDialog
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onSaved={fetchData}
        studentId={target?.id ?? null}
        studentName={target?.nama ?? ""}
        academicYearId={academicYearId}
      />
    </div>
  );
}
