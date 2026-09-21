"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";

type JournalRow = { id: string; tanggal: string; isi: string };

export function JurnalGuru() {
  const [rows, setRows] = useState<JournalRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [isi, setIsi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<JournalRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/guru/jurnal");
    const json = await res.json();

    if (res.ok) {
      setRows(json.data);
    } else {
      toast.error(json.message ?? "Gagal memuat jurnal.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAdd() {
    if (!isi.trim()) {
      toast.error("Isi jurnal tidak boleh kosong.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/guru/jurnal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tanggal, isi }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan jurnal.");
      return;
    }

    toast.success("Jurnal berhasil ditambahkan.");
    setIsi("");
    fetchData();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/guru/jurnal/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menghapus jurnal.");
    } else {
      toast.success("Jurnal berhasil dihapus.");
      fetchData();
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Jurnal Guru</h1>
        <p className="text-sm text-maroon-800/50">Catatan harian kegiatan mengajar Anda.</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="rounded-xl border border-maroon-900/15 py-2.5 px-3 text-sm outline-none focus:border-gold-500"
          />
        </div>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          rows={3}
          placeholder="Tulis catatan kegiatan hari ini..."
          className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Tambah Jurnal
          </button>
        </div>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState icon={NotebookPen} title="Belum ada jurnal" description="Tambahkan catatan kegiatan pertama Anda di atas." />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-3 rounded-2xl border border-maroon-900/8 bg-white p-4 shadow-soft">
              <div>
                <p className="text-xs text-maroon-800/50">
                  {new Date(r.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="mt-1 text-sm text-maroon-900">{r.isi}</p>
              </div>
              <button
                onClick={() => setDeleteTarget(r)}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus jurnal?"
        description="Catatan jurnal ini akan dihapus permanen."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}