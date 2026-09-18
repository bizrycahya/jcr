"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { studentSchema, type StudentInput } from "@/lib/validations/student";

type ClassOption = { id: string; nama: string };

export type StudentRecord = StudentInput & { id: string };

export function StudentFormDialog({
  open,
  onClose,
  onSaved,
  classes,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  classes: ClassOption[];
  initialData?: StudentRecord | null;
}) {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: { status: "AKTIF" },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData ?? {
          nis: "",
          nisn: "",
          nama: "",
          jenisKelamin: "L",
          tempatLahir: "",
          tanggalLahir: "",
          agama: "",
          classId: classes[0]?.id ?? "",
          fotoUrl: "",
          namaAyah: "",
          namaIbu: "",
          waOrangTua: "",
          alamat: "",
          status: "AKTIF",
        }
      );
    }
  }, [open, initialData, reset, classes]);

  if (!open) return null;

  const onSubmit = async (values: StudentInput) => {
    const url = isEdit ? `/api/siswa/${initialData!.id}` : "/api/siswa";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Terjadi kesalahan.");
      return;
    }

    toast.success(isEdit ? "Data siswa diperbarui." : "Siswa baru ditambahkan.");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl text-maroon-900">
            {isEdit ? "Edit Data Siswa" : "Tambah Siswa"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-maroon-800/50 hover:bg-maroon-900/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="NIS" error={errors.nis?.message}>
            <input {...register("nis")} className={inputClass} />
          </Field>
          <Field label="NISN" error={errors.nisn?.message}>
            <input {...register("nisn")} className={inputClass} />
          </Field>
          <Field label="Nama Lengkap" error={errors.nama?.message} full>
            <input {...register("nama")} className={inputClass} />
          </Field>
          <Field label="Jenis Kelamin" error={errors.jenisKelamin?.message}>
            <select {...register("jenisKelamin")} className={inputClass}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </Field>
          <Field label="Kelas" error={errors.classId?.message}>
            <select {...register("classId")} className={inputClass}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </Field>
          <Field label="Tempat Lahir" error={errors.tempatLahir?.message}>
            <input {...register("tempatLahir")} className={inputClass} />
          </Field>
          <Field label="Tanggal Lahir" error={errors.tanggalLahir?.message}>
            <input type="date" {...register("tanggalLahir")} className={inputClass} />
          </Field>
          <Field label="Agama" error={errors.agama?.message}>
            <input {...register("agama")} className={inputClass} />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select {...register("status")} className={inputClass}>
              <option value="AKTIF">Aktif</option>
              <option value="LULUS">Lulus</option>
              <option value="PINDAH">Pindah</option>
              <option value="KELUAR">Keluar</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </Field>
          <Field label="Nama Ayah" error={errors.namaAyah?.message}>
            <input {...register("namaAyah")} className={inputClass} />
          </Field>
          <Field label="Nama Ibu" error={errors.namaIbu?.message}>
            <input {...register("namaIbu")} className={inputClass} />
          </Field>
          <Field label="WA Orang Tua" error={errors.waOrangTua?.message}>
            <input placeholder="08xxxxxxxxxx" {...register("waOrangTua")} className={inputClass} />
          </Field>
          <Field label="URL Foto (opsional)" error={errors.fotoUrl?.message}>
            <input placeholder="https://..." {...register("fotoUrl")} className={inputClass} />
          </Field>
          <Field label="Alamat" error={errors.alamat?.message} full>
            <textarea {...register("alamat")} rows={2} className={inputClass} />
          </Field>

          <div className="mt-2 flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-maroon-900/15 px-5 py-2.5 text-sm text-maroon-800 hover:bg-maroon-900/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-maroon-900/15 bg-white px-3.5 py-2.5 text-sm text-maroon-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs text-maroon-800/60">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
