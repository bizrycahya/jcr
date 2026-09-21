"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ScoreDialog } from "@/components/penilaian/score-dialog";

type ClassOption = { id: string; nama: string };
type StudentRow = { id: string; nama: string; nis: string; scored: number; total: number };

const BULAN_OPTIONS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function GuruScoreInput() {
  const now = new Date();
  const [teacherId, setTeacherId] = useState("");
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState("");
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreTarget, setScoreTarget] = useState<StudentRow | null>(null);

  useEffect(() => {
    fetch("/api/guru/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.teacher) {
          setTeacherId(json.teacher.id);
          setClasses(json.classes ?? []);
        }
        setLoading(false);
      });
  }, []);

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
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Penilaian Karakter</h1>
        <p className="text-sm text-maroon-800/50">Isi nilai karakter siswa di kelas yang Anda ampu.</p>
      </div>

      {classes.length === 0 && !loading ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Belum ada kelas yang diampu"
          description="Hubungi admin untuk ditetapkan sebagai guru pengampu kelas."
        />
      ) : (
        <>
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
            <EmptyState icon={ClipboardCheck} title="Pilih kelas untuk mulai menilai" description="Pilih kelas, bulan, dan tahun penilaian di atas." />
          ) : loading ? (
            <p className="py-10 text-center text-sm text-maroon-800/40">Memuat data siswa...</p>
          ) : students.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="Belum ada siswa di kelas ini" description="Hubungi admin untuk menambahkan siswa." />
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
                          onClick={() => setScoreTarget(s)}
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
        </>
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