"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Users, KeyRound, ShieldOff, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { AddAdminDialog } from "./add-admin-dialog";
import { AddParentDialog } from "./add-parent-dialog";

type UserRow = {
  id: string;
  username: string;
  email: string | null;
  role: string;
  status: string;
  lastLoginAt: string | null;
  teacher: { nama: string } | null;
  student: { nama: string } | null;
  parent: { nama: string } | null;
};

const ROLE_OPTIONS = [
  "SUPER_ADMIN", "ADMIN", "KEPALA_SEKOLAH", "BK",
  "WALI_KELAS", "GURU", "ORANG_TUA", "SISWA",
];

const STATUS_COLOR: Record<string, string> = {
  AKTIF: "bg-green-50 text-green-700",
  NONAKTIF: "bg-maroon-50 text-maroon-700",
  DIBEKUKAN: "bg-red-50 text-red-700",
};

function displayName(u: UserRow) {
  return u.teacher?.nama ?? u.student?.nama ?? u.parent?.nama ?? "-";
}

export function UserManager() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addParentOpen, setAddParentOpen] = useState(false);

  const [statusTarget, setStatusTarget] = useState<{ user: UserRow; newStatus: string } | null>(null);
  const [resetTarget, setResetTarget] = useState<UserRow | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
      search,
      ...(roleFilter ? { role: roleFilter } : {}),
    });

    const res = await fetch(`/api/user?${params.toString()}`);
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
      setTotalPages(json.pagination.totalPages || 1);
    } else {
      toast.error(json.message ?? "Gagal memuat data akun.");
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  async function handleToggleStatus() {
    if (!statusTarget) return;
    setProcessing(true);
    const res = await fetch(`/api/user/${statusTarget.user.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusTarget.newStatus }),
    });
    const json = await res.json();
    setProcessing(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal mengubah status.");
    } else {
      toast.success("Status akun berhasil diubah.");
      fetchUsers();
    }
    setStatusTarget(null);
  }

  async function handleResetPassword() {
    if (!resetTarget) return;
    setProcessing(true);
    const res = await fetch(`/api/user/${resetTarget.id}/reset-password`, { method: "POST" });
    const json = await res.json();
    setProcessing(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal reset password.");
    } else {
      toast.success(`Password baru untuk ${resetTarget.username}: ${json.newPassword}`, { duration: 15000 });
    }
    setResetTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Manajemen User</h1>
          <p className="text-sm text-maroon-800/50">Kelola seluruh akun pengguna sistem.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddParentOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-maroon-900/15 px-4 py-2.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
          >
            <Plus className="h-4 w-4" />
            Tambah Orang Tua
          </button>
          <button
            onClick={() => setAddAdminOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900"
          >
            <Plus className="h-4 w-4" />
            Tambah Admin
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari username..."
          className="min-w-[220px] flex-1 rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">Semua Role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState icon={Users} title="Belum ada akun" description="Belum ada data akun yang cocok dengan filter." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-maroon-900/8 text-left text-xs text-maroon-800/50">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Role</th>
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
                rows.map((u) => (
                  <tr key={u.id} className="border-b border-maroon-900/5 last:border-0 hover:bg-maroon-50/40">
                    <td className="px-4 py-3 text-maroon-900">{u.username}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{displayName(u)}</td>
                    <td className="px-4 py-3 text-maroon-800/70">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setResetTarget(u)}
                          title="Reset Password"
                          className="rounded-lg p-2 text-maroon-700 hover:bg-maroon-900/5"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {u.status === "AKTIF" ? (
                          <button
                            onClick={() => setStatusTarget({ user: u, newStatus: "NONAKTIF" })}
                            title="Nonaktifkan"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <ShieldOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatusTarget({ user: u, newStatus: "AKTIF" })}
                            title="Aktifkan"
                            className="rounded-lg p-2 text-green-700 hover:bg-green-50"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-maroon-800/60">Halaman {page} dari {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-sm text-maroon-800 hover:bg-maroon-900/5 disabled:opacity-30"
          >
            Berikutnya
          </button>
        </div>
      )}

      <AddAdminDialog open={addAdminOpen} onClose={() => setAddAdminOpen(false)} onSaved={fetchUsers} />
      <AddParentDialog open={addParentOpen} onClose={() => setAddParentOpen(false)} onSaved={fetchUsers} />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.newStatus === "AKTIF" ? "Aktifkan akun?" : "Nonaktifkan akun?"}
        description={`Akun "${statusTarget?.user.username ?? ""}" akan diubah statusnya.`}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusTarget(null)}
        isLoading={processing}
      />

      <ConfirmDialog
        open={Boolean(resetTarget)}
        title="Reset password?"
        description={`Password akun "${resetTarget?.username ?? ""}" akan diganti dengan password baru secara acak.`}
        onConfirm={handleResetPassword}
        onCancel={() => setResetTarget(null)}
        isLoading={processing}
      />
    </div>
  );
}