"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ScoreDialog } from "./score-dialog";

type ClassOption = { id: string; nama: string };
type TeacherOption = { id: string; nama: string; jabatan: string };
type StudentRow = { id: string; nama: string; nis: string; scored: number; total: number };

const BULAN_OPTIONS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function ScoreInput() {
  const now = new Date();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [myTeacherId, setMyTeacherId] = useState<string | null>(null);

  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [scoreTarget, setScoreTarget] = useState<StudentRow | null>(null);

  const fetchOptions = useCallback(async () => {
    const res = await fetch("/api/penilaian");
    const json = await res.json();
    setClasses(json.classes ?? []);
    setTeachers(json.teachers ?? []);
    setMyTeacherId(json.myTeacherId ?? null);
    if (json.myTeacherId) setTeacherId(json.myTeacherId);
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const fetchStudents = useCallback(async () => {
    if (!classId) {
      setStudents([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/penilaian?classId=${classId}&bulan=${bulan}&tahun=${tahun}`);
    const json = await res.json();

    if (res.ok) {
      setStudents(json.data);
    } else {
      toast.error(json.message ?? "Gagal memuat data siswa.");
    }
    setLoading(false);
  }, [classId, bulan, tahun]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="space-y-4">
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

        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          disabled={!!myTeacherId}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500 disabled:bg-maroon-50/50"
        >
          <option value="">Dinilai oleh (Guru)...</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.nama} — {t.jabatan}</option>
          ))}
        </select>
      </div>

      {!classId ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Pilih kelas untuk mulai menilai"
          description="Pilih kelas, bulan, dan tahun penilaian di atas."
        />
      ) : loading ? (
        <p className="py-10 text-center text-sm text-maroon-800/40">Memuat data siswa...</p>
      ) : students.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Belum ada siswa di kelas ini"
          description="Tambahkan siswa terlebih dahulu di menu Data Siswa."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">NIS</th>
                <th className="px-4 py-3">Progres</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                  <td className="px-4 py-3 text-maroon-900">{s.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.nis}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.scored} / {s.total} indikator</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (!teacherId) {
                          toast.error("Pilih guru penilai terlebih dahulu.");
                          return;
                        }
                        setScoreTarget(s);
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
                    >
                      {s.scored > 0 ? "Edit Nilai" : "Isi Nilai"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ScoreDialog
        open={Boolean(scoreTarget)}
        onClose={() => setScoreTarget(null)}
        onSaved={fetchStudents}
        studentId={scoreTarget?.id ?? null}
        studentName={scoreTarget?.nama ?? ""}
        bulan={bulan}
        tahun={tahun}
        teacherId={teacherId}
      />
    </div>
  );
}