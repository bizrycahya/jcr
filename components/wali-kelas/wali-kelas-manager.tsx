"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { AssignWaliKelasDialog } from "./assign-dialog";

type TeacherOption = { id: string; nama: string; nip: string };

type ClassRow = {
  id: string;
  nama: string;
  jenjang: string;
  academicYear: { tahun: string };
  homeroom: { teacher: { nama: string } } | null;
};

export function WaliKelasManager() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [assignTarget, setAssignTarget] = useState<ClassRow | null>(null);
  const [unassignTarget, setUnassignTarget] = useState<ClassRow | null>(null);
  const [unassigning, setUnassigning] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/wali-kelas");
    const json = await res.json();

    if (res.ok) {
      setClasses(json.classes);
      setAvailableTeachers(json.availableTeachers);
    } else {
      toast.error(json.message ?? "Gagal memuat data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleUnassign() {
    if (!unassignTarget) return;
    setUnassigning(true);
    const res = await fetch(`/api/wali-kelas/${unassignTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setUnassigning(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal melepas wali kelas.");
    } else {
      toast.success("Wali kelas berhasil dilepas.");
      fetchData();
    }
    setUnassignTarget(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Wali Kelas</h1>
        <p className="text-sm text-maroon-800/50">Kelola penugasan wali kelas untuk setiap kelas.</p>
      </div>

      {!loading && classes.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="Belum ada data kelas"
          description="Tambahkan data kelas terlebih dahulu di menu Kelas."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Jenjang</th>
                <th className="px-4 py-3">Tahun Ajaran</th>
                <th className="px-4 py-3">Wali Kelas</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-maroon-800/40">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr key={c.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                    <td className="px-4 py-3 font-medium text-maroon-900">{c.nama}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{c.jenjang}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{c.academicYear.tahun}</td>
                    <td className="px-4 py-3 text-maroon-800/70">
                      {c.homeroom?.teacher.nama ?? (
                        <span className="text-maroon-800/40">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.homeroom ? (
                        <button
                          onClick={() => setUnassignTarget(c)}
                          className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          Lepas
                        </button>
                      ) : (
                        <button
                          onClick={() => setAssignTarget(c)}
                          className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
                        >
                          Tetapkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AssignWaliKelasDialog
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        onAssigned={fetchData}
        classId={assignTarget?.id ?? null}
        className={assignTarget?.nama ?? ""}
        availableTeachers={availableTeachers}
      />

      <ConfirmDialog
        open={Boolean(unassignTarget)}
        title="Lepas wali kelas?"
        description={`Wali kelas untuk "${unassignTarget?.nama ?? ""}" akan dilepas. Guru tersebut akan tersedia untuk ditetapkan ke kelas lain.`}
        onConfirm={handleUnassign}
        onCancel={() => setUnassignTarget(null)}
        isLoading={unassigning}
      />
    </div>
  );
}