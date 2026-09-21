"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";

type TeacherOption = { id: string; nama: string; nip: string; mapel: string };
type ClassOption = { id: string; nama: string };
type AssignmentRow = {
  id: string;
  mapel: string;
  teacher: { id: string; nama: string };
  class: { id: string; nama: string };
};

export function AssignmentManager() {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [teacherId, setTeacherId] = useState("");
  const [classId, setClassId] = useState("");
  const [mapel, setMapel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AssignmentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/penugasan-mapel");
    const json = await res.json();

    if (res.ok) {
      setAssignments(json.assignments);
      setTeachers(json.teachers);
      setClasses(json.classes);
    } else {
      toast.error(json.message ?? "Gagal memuat data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (teacherId) {
      const t = teachers.find((x) => x.id === teacherId);
      if (t) setMapel(t.mapel);
    }
  }, [teacherId, teachers]);

  async function handleAdd() {
    if (!teacherId || !classId || !mapel) {
      toast.error("Lengkapi guru, kelas, dan mata pelajaran.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/penugasan-mapel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, classId, mapel }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menambahkan penugasan.");
      return;
    }

    toast.success("Penugasan berhasil ditambahkan.");
    setTeacherId("");
    setClassId("");
    setMapel("");
    fetchData();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/penugasan-mapel/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menghapus penugasan.");
    } else {
      toast.success("Penugasan berhasil dihapus.");
      fetchData();
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Penugasan Mengajar</h1>
        <p className="text-sm text-maroon-800/50">
          Tetapkan guru mata pelajaran ke kelas-kelas yang diampu.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <div className="min-w-[200px] flex-1 space-y-1.5">
          <label className="text-sm text-maroon-800">Guru</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
          >
            <option value="">Pilih guru...</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.nama} ({t.nip})</option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] space-y-1.5">
          <label className="text-sm text-maroon-800">Kelas</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
          >
            <option value="">Pilih kelas...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nama}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] space-y-1.5">
          <label className="text-sm text-maroon-800">Mata Pelajaran</label>
          <input
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </div>

      {!loading && assignments.length === 0 ? (
        <EmptyState icon={BookOpen} title="Belum ada penugasan" description="Tambahkan penugasan guru ke kelas di atas." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Guru</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Mata Pelajaran</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-maroon-800/40">Memuat data...</td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                    <td className="px-4 py-3 text-maroon-900">{a.teacher.nama}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{a.class.nama}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{a.mapel}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(a)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus penugasan?"
        description={`Penugasan ${deleteTarget?.teacher.nama ?? ""} di kelas ${deleteTarget?.class.nama ?? ""} akan dihapus.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}