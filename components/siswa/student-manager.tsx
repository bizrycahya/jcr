"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { StudentFormDialog, type StudentRecord } from "./student-form-dialog";
import { StudentImportDialog } from "./student-import-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GraduationCap } from "lucide-react";

type ClassOption = { id: string; nama: string };

type StudentRow = StudentRecord & { class: ClassOption };

const STATUS_LABEL: Record<string, string> = {
  AKTIF: "Aktif",
  LULUS: "Lulus",
  PINDAH: "Pindah",
  KELUAR: "Keluar",
  NONAKTIF: "Nonaktif",
};

const STATUS_COLOR: Record<string, string> = {
  AKTIF: "bg-green-50 text-green-700",
  LULUS: "bg-gold-50 text-gold-700",
  PINDAH: "bg-blue-50 text-blue-700",
  KELUAR: "bg-red-50 text-red-700",
  NONAKTIF: "bg-maroon-50 text-maroon-700",
};

export function StudentManager({ classes }: { classes: ClassOption[] }) {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StudentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
      search,
      ...(classFilter ? { classId: classFilter } : {}),
    });

    const res = await fetch(`/api/siswa?${params.toString()}`);
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
      setTotalPages(json.pagination.totalPages || 1);
    } else {
      toast.error(json.message ?? "Gagal memuat data siswa.");
    }
    setLoading(false);
  }, [page, search, classFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setPage(1);
  }, [search, classFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/siswa/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();

    if (res.ok) {
      toast.success("Siswa berhasil dihapus.");
      fetchStudents();
    } else {
      toast.error(json.message ?? "Gagal menghapus siswa.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Data Siswa</h1>
          <p className="text-sm text-maroon-800/50">Kelola data induk siswa JaNIC.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/siswa/export"
            className="flex items-center gap-2 rounded-xl border border-maroon-900/15 px-4 py-2.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </a>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-maroon-900/15 px-4 py-2.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Import Excel
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900"
          >
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-800/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIS, atau NISN..."
            className="w-full rounded-xl border border-maroon-900/15 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nama}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIS / NISN</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">WA Orang Tua</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-maroon-800/40">
                  Memuat data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8">
                  <EmptyState
                    icon={GraduationCap}
                    title="Belum ada data siswa"
                    description='Klik "Tambah Siswa" untuk mulai menambahkan data.'
                  />
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                  <td className="px-4 py-3 text-maroon-900">{s.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.nis} / {s.nisn}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.class.nama}</td>
                  <td className="px-4 py-3 text-maroon-800/70">{s.waOrangTua}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditing({
                            ...s,
                            tanggalLahir: new Date(s.tanggalLahir).toISOString().slice(0, 10),
                            fotoUrl: s.fotoUrl ?? "",
                          });
                          setFormOpen(true);
                        }}
                        className="rounded-lg p-2 text-maroon-700 hover:bg-maroon-900/5"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
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
          <span className="text-sm text-maroon-800/60">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg p-2 text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <StudentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchStudents}
        classes={classes}
        initialData={editing}
      />

      <StudentImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={fetchStudents}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus data siswa?"
        description={`Data ${deleteTarget?.nama ?? ""} akan dihapus permanen dan tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}