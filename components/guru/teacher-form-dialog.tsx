"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { teacherSchema, JABATAN_OPTIONS, type TeacherInput } from "@/lib/validations/teacher";

export type TeacherRecord = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  mapel: string;
  whatsapp: string;
  email: string | null;
  fotoUrl: string | null;
  status: string;
};

export function TeacherFormDialog({
  open,
  onClose,
  onSaved,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData: TeacherRecord | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      nip: "",
      nama: "",
      jabatan: "Guru Mapel",
      mapel: "",
      whatsapp: "",
      email: "",
      fotoUrl: "",
      status: "AKTIF",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              nip: initialData.nip,
              nama: initialData.nama,
              jabatan: initialData.jabatan as TeacherInput["jabatan"],
              mapel: initialData.mapel,
              whatsapp: initialData.whatsapp,
              email: initialData.email ?? "",
              fotoUrl: initialData.fotoUrl ?? "",
              status: initialData.status as TeacherInput["status"],
            }
          : {
              nip: "",
              nama: "",
              jabatan: "Guru Mapel",
              mapel: "",
              whatsapp: "",
              email: "",
              fotoUrl: "",
              status: "AKTIF",
            }
      );
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  async function onSubmit(values: TeacherInput) {
    const url = initialData ? `/api/guru/${initialData.id}` : "/api/guru";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan data guru.");
      return;
    }

    if (!initialData && json.defaultPassword) {
      toast.success(
        `Guru ditambahkan. Username: ${values.nip}, Password: ${json.defaultPassword}`,
        { duration: 12000 }
      );
    } else {
      toast.success("Data guru berhasil diperbarui.");
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-lg text-maroon-900">
            {initialData ? "Edit Guru" : "Tambah Guru"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">NIP</label>
            <input
              {...register("nip")}
              disabled={!!initialData}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500 disabled:bg-maroon-50/50"
            />
            {errors.nip && <p className="text-sm text-red-600">{errors.nip.message}</p>}
            {initialData && (
              <p className="text-xs text-maroon-800/50">NIP tidak dapat diubah karena digunakan sebagai username.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Nama</label>
            <input
              {...register("nama")}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            />
            {errors.nama && <p className="text-sm text-red-600">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Jabatan</label>
              <select
                {...register("jabatan")}
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              >
                {JABATAN_OPTIONS.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Mapel / Bidang</label>
              <input
                {...register("mapel")}
                placeholder="Contoh: Matematika"
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
              {errors.mapel && <p className="text-sm text-red-600">{errors.mapel.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">No. WhatsApp</label>
              <input
                {...register("whatsapp")}
                placeholder="081234567890"
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
              {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-maroon-800">Email (opsional)</label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-maroon-800">Status</label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-maroon-900/15 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
              <option value="DIBEKUKAN">Dibekukan</option>
            </select>
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