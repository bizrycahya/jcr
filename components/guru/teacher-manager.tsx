"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, UserSquare2 } from "lucide-react";
import { toast } from "sonner";
import { TeacherFormDialog, type TeacherRecord } from "./teacher-form-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JABATAN_OPTIONS } from "@/lib/validations/teacher";

type TeacherRow = TeacherRecord & { user: { username: string; role: string; status: string } };

const STATUS_COLOR: Record<string, string> = {
  AKTIF: "bg-green-50 text-green-700",
  NONAKTIF: "bg-maroon-50 text-maroon-700",
  DIBEKUKAN: "bg-red-50 text-red-700",
};

export function TeacherManager() {
  const [rows, setRows] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jabatanFilter, setJabatanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeacherRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
      search,
      ...(jabatanFilter ? { jabatan: jabatanFilter } : {}),
    });

    const res = await fetch(`/api/guru?${params.toString()}`);
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
      setTotalPages(json.pagination.totalPages || 1);
    } else {
      toast.error(json.message ?? "Gagal memuat data guru.");
    }
    setLoading(false);
  }, [page, search, jabatanFilter]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    setPage(1);
  }, [search, jabatanFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/guru/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();

    if (res.ok) {
      toast.success("Guru berhasil dihapus.");
      fetchTeachers();
    } else {
      toast.error(json.message ?? "Gagal menghapus guru.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Data Guru</h1>
          <p className="text-sm text-maroon-800/50">Kelola data guru, wali kelas, BK, dan kepala sekolah.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900"
        >
          <Plus className="h-4 w-4" />
          Tambah Guru
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-800/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIP..."
            className="w-full rounded-xl border border-maroon-900/15 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <select
          value={jabatanFilter}
          onChange={(e) => setJabatanFilter(e.target.value)}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">Semua Jabatan</option>
          {JABATAN_OPTIONS.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIP</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Mapel/Bidang</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-maroon-800/40">
                  Memuat data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <EmptyState
                    icon={UserSquare2}
                    title="Belum ada data guru"
                    description='Klik "Tambah Guru" untuk mulai menambahkan data.'
                  />
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr key={t.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                  <td className="px-4 py-3 text-maroon-900">{t.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{t.nip}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{t.jabatan}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{t.mapel}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{t.whatsapp}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditing(t);
                          setFormOpen(true);
                        }}
                        className="rounded-lg p-2 text-maroon-700 hover:bg-maroon-900/5"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label="Hapus"
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg p-2 text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-maroon-800/60">Halaman {page} dari {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg p-2 text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <TeacherFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchTeachers}
        initialData={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus data guru?"
        description={`Data ${deleteTarget?.nama ?? ""} akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}