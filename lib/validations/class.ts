import { z } from "zod";

export const classSchema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi").max(50),
  jenjang: z.enum(["SMP", "SMA"], {
    errorMap: () => ({ message: "Jenjang wajib dipilih" }),
  }),
  academicYearId: z.string().min(1, "Tahun ajaran wajib dipilih"),
  status: z.enum(["AKTIF", "LULUS", "PINDAH", "KELUAR", "NONAKTIF"]).default("AKTIF"),
});

export type ClassInput = z.infer<typeof classSchema>;