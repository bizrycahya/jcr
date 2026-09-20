"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { IndicatorFormDialog, type IndicatorRecord } from "./indicator-form-dialog";

type CategoryRow = {
  id: string;
  nama: string;
  label: string;
  deskripsi: string | null;
  urutan: number;
  indicators: IndicatorRecord[];
};

export function CategoryManager() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRecord | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryRow | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IndicatorRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/kategori-karakter");
    const json = await res.json();

    if (res.ok) {
      setCategories(json.data);
    } else {
      toast.error(json.message ?? "Gagal memuat kategori.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/indikator-karakter/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(false);

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menghapus indikator.");
    } else {
      toast.success("Indikator berhasil dihapus.");
      fetchCategories();
    }
    setDeleteTarget(null);
  }

  if (loading) {
    return <p className="text-sm text-maroon-800/50">Memuat kategori...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Kategori & Indikator Karakter</h1>
        <p className="text-sm text-maroon-800/50">
          5 kategori sudah ditetapkan sistem. Kelola indikator penilaian di setiap kategori.
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="overflow-hidden rounded-2xl border border-maroon-900/8 bg-white shadow-soft">
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              className="flex w-full items-center justify-between px-4 py-3.5"
            >
              <div className="text-left">
                <p className="font-medium text-maroon-900">{cat.label}</p>
                <p className="text-xs text-maroon-800/50">{cat.indicators.length} indikator</p>
              </div>
              {expanded === cat.id ? (
                <ChevronUp className="h-4 w-4 text-maroon-800/50" />
              ) : (
                <ChevronDown className="h-4 w-4 text-maroon-800/50" />
              )}
            </button>

            {expanded === cat.id && (
              <div className="border-t border-maroon-900/8 p-4">
                <div className="mb-3 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                      setEditing(null);
                      setFormOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-maroon-800 px-3 py-2 text-xs text-cream hover:bg-maroon-900"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Indikator
                  </button>
                </div>

                {cat.indicators.length === 0 ? (
                  <p className="py-4 text-center text-sm text-maroon-800/40">Belum ada indikator.</p>
                ) : (
                  <ul className="space-y-2">
                    {cat.indicators.map((ind) => (
                      <li
                        key={ind.id}
                        className="flex items-center justify-between rounded-xl bg-maroon-50/50 px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm text-maroon-900">{ind.nama}</p>
                          {ind.deskripsi && (
                            <p className="text-xs text-maroon-800/50">{ind.deskripsi}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setActiveCategory(cat);
                              setEditing(ind);
                              setFormOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-maroon-700 hover:bg-maroon-900/5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ind)}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {activeCategory && (
        <IndicatorFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={fetchCategories}
          categoryId={activeCategory.id}
          categoryLabel={activeCategory.label}
          initialData={editing}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus indikator?"
        description={`Indikator "${deleteTarget?.nama ?? ""}" akan dihapus permanen.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}