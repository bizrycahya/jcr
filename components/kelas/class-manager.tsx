"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Layers,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ClassFormDialog } from "./class-form-dialog";

type AcademicYear = {
  id: string;
  tahun: string;
  semester: number;
  isActive: boolean;
};

type ClassItem = {
  id: string;
  nama: string;
  jenjang: "SMP" | "SMA";
  status: string;
  academicYear: {
    id: string;
    tahun: string;
  };
  homeroom: {
    teacher: {
      nama: string;
    };
  } | null;
  _count: {
    students: number;
  };
};

export function ClassManager({
  academicYears,
}: {
  academicYears: AcademicYear[];
}) {
  // ============================================================
  // STATE
  // ============================================================

  const [data, setData] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] =
    useState<ClassItem | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<ClassItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================
  // FETCH DATA
  // ============================================================

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: "10",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (jenjang) {
        params.set("jenjang", jenjang);
      }

      if (academicYearId) {
        params.set("academicYearId", academicYearId);
      }

      const res = await fetch(
        `/api/kelas?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.message || "Gagal mengambil data kelas."
        );
      }

      setData(json.data ?? []);

      setTotalPages(
        json.pagination?.totalPages ?? 1
      );
    } catch (error) {
      console.error("FETCH KELAS ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data kelas."
      );

      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    jenjang,
    academicYearId,
  ]);

  // ============================================================
  // INITIAL LOAD / FILTER CHANGE
  // ============================================================

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete() {
    if (!deleteTarget || isDeleting) return;

    try {
      setIsDeleting(true);

      const res = await fetch(
        `/api/kelas/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.message || "Gagal menghapus kelas."
        );
      }

      toast.success("Kelas berhasil dihapus.");

      // Tutup dialog setelah berhasil
      setDeleteTarget(null);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("DELETE KELAS ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus kelas."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // ============================================================
  // OPEN ADD
  // ============================================================

  function handleAdd() {
    setEditingClass(null);
    setDialogOpen(true);
  }

  // ============================================================
  // OPEN EDIT
  // ============================================================

  function handleEdit(kelas: ClassItem) {
    setEditingClass(kelas);
    setDialogOpen(true);
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  function handleFormClose(open: boolean) {
    setDialogOpen(open);

    if (!open) {
      setEditingClass(null);
    }
  }

  // ============================================================
  // FORM SUCCESS
  // ============================================================

  async function handleFormSuccess() {
    setDialogOpen(false);
    setEditingClass(null);

    await fetchData();
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-maroon-700">
            Data Kelas
          </h1>

          <p className="text-sm text-muted-foreground">
            Kelola daftar kelas per tahun ajaran.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          className="bg-maroon-500 hover:bg-maroon-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kelas
        </Button>
      </div>

      {/* ======================================================
          FILTER
      ======================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row">

        {/* SEARCH */}

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Cari nama kelas..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        {/* JENJANG */}

        <select
          value={jenjang}
          onChange={(e) => {
            setPage(1);
            setJenjang(e.target.value);
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Semua Jenjang
          </option>

          <option value="SMP">
            SMP
          </option>

          <option value="SMA">
            SMA
          </option>
        </select>

        {/* TAHUN AJARAN */}

        <select
          value={academicYearId}
          onChange={(e) => {
            setPage(1);
            setAcademicYearId(e.target.value);
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Semua Tahun Ajaran
          </option>

          {academicYears.map((ay) => (
            <option
              key={ay.id}
              value={ay.id}
            >
              {ay.tahun} - Semester{" "}
              {ay.semester}
            </option>
          ))}
        </select>
      </div>

      {/* ======================================================
          DATA TABLE / EMPTY STATE
      ======================================================= */}

      {!loading && data.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={
            search ||
            jenjang ||
            academicYearId
              ? "Data kelas tidak ditemukan"
              : "Belum ada data kelas"
          }
          description={
            search ||
            jenjang ||
            academicYearId
              ? "Tidak ada kelas yang sesuai dengan filter pencarian."
              : "Tambahkan kelas baru untuk mulai mengelola data siswa per kelas."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">

            {/* TABLE HEADER */}

            <thead className="bg-maroon-50 text-left">
              <tr>
                <th className="p-3">
                  Nama Kelas
                </th>

                <th className="p-3">
                  Jenjang
                </th>

                <th className="p-3">
                  Tahun Ajaran
                </th>

                <th className="p-3">
                  Wali Kelas
                </th>

                <th className="p-3">
                  Jumlah Siswa
                </th>

                <th className="p-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />

                      <span>
                        Memuat data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((kelas) => (
                  <tr
                    key={kelas.id}
                    className="border-t transition-colors hover:bg-maroon-50/30"
                  >

                    {/* NAMA KELAS */}

                    <td className="p-3 font-medium text-maroon-900">
                      {kelas.nama}
                    </td>

                    {/* JENJANG */}

                    <td className="p-3">
                      <span className="inline-flex rounded-full bg-maroon-50 px-2.5 py-1 text-xs font-medium text-maroon-700">
                        {kelas.jenjang}
                      </span>
                    </td>

                    {/* TAHUN AJARAN */}

                    <td className="p-3">
                      {kelas.academicYear?.tahun ?? "-"}
                    </td>

                    {/* WALI KELAS */}

                    <td className="p-3">
                      {kelas.homeroom?.teacher?.nama ?? (
                        <span className="text-muted-foreground">
                          Belum ada
                        </span>
                      )}
                    </td>

                    {/* JUMLAH SISWA */}

                    <td className="p-3">
                      {kelas._count?.students ?? 0}
                    </td>

                    {/* AKSI */}

                    <td className="p-3">
                      <div className="flex justify-end gap-2">

                        {/* EDIT */}

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleEdit(kelas)
                          }
                          title="Edit kelas"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* DELETE */}

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setDeleteTarget(kelas)
                          }
                          disabled={isDeleting}
                          title="Hapus kelas"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================
          PAGINATION
      ======================================================= */}

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2">

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={
                p === page
                  ? "default"
                  : "outline"
              }
              onClick={() => setPage(p)}
              disabled={loading}
            >
              {p}
            </Button>
          ))}

        </div>
      )}

      {/* ======================================================
          ADD / EDIT CLASS DIALOG
      ======================================================= */}

      <ClassFormDialog
        open={dialogOpen}
        onOpenChange={handleFormClose}
        academicYears={academicYears}
        initialData={editingClass}
        onSuccess={handleFormSuccess}
      />

      {/* ======================================================
          DELETE CONFIRMATION DIALOG
      ======================================================= */}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Kelas?"
        description={
          deleteTarget
            ? `Kelas "${deleteTarget.nama}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`
            : "Data kelas akan dihapus permanen."
        }
        confirmLabel={
          isDeleting
            ? "Menghapus..."
            : "Hapus"
        }
        onConfirm={handleDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
        isLoading={isDeleting}
      />

    </div>
  );
}