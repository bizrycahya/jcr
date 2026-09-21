"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { academicYearSchema, type AcademicYearInput } from "@/lib/validations/academic-year";

export type AcademicYearRecord = {
  id: string;
  tahun: string;
  semester: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export function AcademicYearFormDialog({
  open,
  onClose,
  onSaved,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData: AcademicYearRecord | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AcademicYearInput>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      tahun: "",
      semester: 1,
      startDate: "",
      endDate: "",
      isActive: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              tahun: initialData.tahun,
              semester: initialData.semester,
              startDate: initialData.startDate,
              endDate: initialData.endDate,
              isActive: initialData.isActive,
            }
          : { tahun: "", semester: 1, startDate: "", endDate: "", isActive: false }
      );
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  async function onSubmit(values: AcademicYearInput) {
    const url = initialData ? `/api/semester/${initialData.id}` : "/api/semester";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan tahun ajaran.");
      return;
    }

    toast.success(initialData ? "Tahun ajaran berhasil diperbarui." : "Tahun ajaran berhasil ditambahkan.");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">
            {initialData ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Tahun Ajaran</label>
            <input
              {...register("tahun")}
              placeholder="Contoh: 2025/2026"
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
            {errors.tahun && <p className="text-sm text-red-600">{errors.tahun.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Semester</label>
            <select
              {...register("semester", { valueAsNumber: true })}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            >
              <option value={1}>1 - Ganjil</option>
              <option value={2}>2 - Genap</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Tanggal Mulai</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Tanggal Selesai</label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-maroon-800">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-maroon-900/30" />
            Jadikan tahun ajaran aktif
          </label>
          <p className="text-xs text-maroon-800/50">
            Hanya satu tahun ajaran yang bisa aktif. Mengaktifkan ini akan menonaktifkan tahun ajaran lain.
          </p>

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