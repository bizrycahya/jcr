"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classSchema, type ClassInput } from "@/lib/validations/class";

type AcademicYear = { id: string; tahun: string; semester: number };

type ClassFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYears: AcademicYear[];
  initialData?: {
    id: string;
    nama: string;
    jenjang: "SMP" | "SMA";
    academicYear: { id: string };
    status: string;
  } | null;
  onSuccess: () => void;
};

export function ClassFormDialog({
  open,
  onOpenChange,
  academicYears,
  initialData,
  onSuccess,
}: ClassFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassInput>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      nama: "",
      jenjang: "SMP",
      academicYearId: "",
      status: "AKTIF",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              nama: initialData.nama,
              jenjang: initialData.jenjang,
              academicYearId: initialData.academicYear.id,
              status: initialData.status as ClassInput["status"],
            }
          : { nama: "", jenjang: "SMP", academicYearId: "", status: "AKTIF" }
      );
    }
  }, [open, initialData, reset]);

  async function onSubmit(values: ClassInput) {
    const url = initialData ? `/api/kelas/${initialData.id}` : "/api/kelas";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message ?? "Gagal menyimpan data kelas.");
      return;
    }

    toast.success(initialData ? "Kelas berhasil diperbarui." : "Kelas berhasil ditambahkan.");
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kelas</Label>
            <Input id="nama" placeholder="Contoh: VII-A" {...register("nama")} />
            {errors.nama && (
              <p className="text-sm text-destructive">{errors.nama.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenjang">Jenjang</Label>
            <select
              id="jenjang"
              {...register("jenjang")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
            {errors.jenjang && (
              <p className="text-sm text-destructive">{errors.jenjang.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYearId">Tahun Ajaran</Label>
            <select
              id="academicYearId"
              {...register("academicYearId")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Pilih tahun ajaran</option>
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>
                  {ay.tahun} - Semester {ay.semester}
                </option>
              ))}
            </select>
            {errors.academicYearId && (
              <p className="text-sm text-destructive">{errors.academicYearId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-maroon-500 hover:bg-maroon-600">
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}