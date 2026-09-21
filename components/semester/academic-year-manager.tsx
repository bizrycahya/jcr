"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, CalendarRange } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AcademicYearFormDialog, type AcademicYearRecord } from "./academic-year-form-dialog";

export function AcademicYearManager() {
  const [rows, setRows] = useState<AcademicYearRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicYearRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicYearRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/semester");
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
    } else {
      toast.error(json.message ?? "Gagal memuat data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/semester/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menghapus tahun ajaran.");
    } else {
      toast.success("Tahun ajaran berhasil dihapus.");
      fetchData();
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Tahun Ajaran / Semester</h1>
          <p className="text-sm text-maroon-800/50">Kelola tahun ajaran dan semester aktif sekolah.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900"
        >
          <Plus className="h-4 w-4" />
          Tambah Tahun Ajaran
        </button>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Belum ada tahun ajaran"
          description='Klik "Tambah Tahun Ajaran" untuk mulai menambahkan data.'
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Tahun Ajaran</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3">Status</th>
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
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                    <td className="px-4 py-3 font-medium text-maroon-900">{r.tahun}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{r.semester === 1 ? "Ganjil" : "Genap"}</td>
                    <td className="px-4 py-3 text-maroon-800/70">
                      {new Date(r.startDate).toLocaleDateString("id-ID")} - {new Date(r.endDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      {r.isActive ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">Aktif</span>
                      ) : (
                        <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-xs text-maroon-700">Nonaktif</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditing({
                              ...r,
                              startDate: new Date(r.startDate).toISOString().slice(0, 10),
                              endDate: new Date(r.endDate).toISOString().slice(0, 10),
                            });
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-2 text-maroon-700 hover:bg-maroon-900/5"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AcademicYearFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchData}
        initialData={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus tahun ajaran?"
        description={`Tahun ajaran "${deleteTarget?.tahun ?? ""}" akan dihapus permanen.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}