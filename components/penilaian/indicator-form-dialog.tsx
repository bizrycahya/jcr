"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { indicatorSchema, type IndicatorInput } from "@/lib/validations/character";

export type IndicatorRecord = {
  id: string;
  categoryId: string;
  nama: string;
  deskripsi: string | null;
  urutan: number;
};

export function IndicatorFormDialog({
  open,
  onClose,
  onSaved,
  categoryId,
  categoryLabel,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categoryId: string;
  categoryLabel: string;
  initialData: IndicatorRecord | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IndicatorInput>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: { categoryId, nama: "", deskripsi: "", urutan: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              categoryId: initialData.categoryId,
              nama: initialData.nama,
              deskripsi: initialData.deskripsi ?? "",
              urutan: initialData.urutan,
            }
          : { categoryId, nama: "", deskripsi: "", urutan: 0 }
      );
    }
  }, [open, initialData, categoryId, reset]);

  if (!open) return null;

  async function onSubmit(values: IndicatorInput) {
    const url = initialData ? `/api/indikator-karakter/${initialData.id}` : "/api/indikator-karakter";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan indikator.");
      return;
    }

    toast.success(initialData ? "Indikator berhasil diperbarui." : "Indikator berhasil ditambahkan.");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg text-maroon-900">
              {initialData ? "Edit Indikator" : "Tambah Indikator"}
            </h2>
            <p className="mt-0.5 text-sm text-maroon-800/50">Kategori: {categoryLabel}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Nama Indikator</label>
            <input
              {...register("nama")}
              placeholder="Contoh: Sholat berjamaah"
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
            {errors.nama && <p className="text-sm text-red-600">{errors.nama.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Deskripsi (opsional)</label>
            <textarea
              {...register("deskripsi")}
              rows={2}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Urutan</label>
            <input
              type="number"
              {...register("urutan", { valueAsNumber: true })}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-maroon-900/15 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}