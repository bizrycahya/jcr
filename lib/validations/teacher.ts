import { z } from "zod";

const waIndonesiaRegex = /^(08|628)[0-9]{8,11}$/;

export const JABATAN_OPTIONS = ["Guru Mapel", "Wali Kelas", "BK", "Kepala Sekolah"] as const;

export const JABATAN_ROLE_MAP: Record<(typeof JABATAN_OPTIONS)[number], "GURU" | "WALI_KELAS" | "BK" | "KEPALA_SEKOLAH"> = {
  "Guru Mapel": "GURU",
  "Wali Kelas": "WALI_KELAS",
  BK: "BK",
  "Kepala Sekolah": "KEPALA_SEKOLAH",
};

export const teacherSchema = z.object({
  nip: z.string().min(3, "NIP minimal 3 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  jabatan: z.enum(JABATAN_OPTIONS, {
    errorMap: () => ({ message: "Jabatan wajib dipilih" }),
  }),
  mapel: z.string().min(1, "Mata pelajaran / bidang wajib diisi"),
  whatsapp: z.string().regex(waIndonesiaRegex, "Format nomor WA Indonesia tidak valid"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  fotoUrl: z.string().url("URL foto tidak valid").optional().or(z.literal("")),
  status: z.enum(["AKTIF", "NONAKTIF", "DIBEKUKAN"]).default("AKTIF"),
});

export type TeacherInput = z.infer<typeof teacherSchema>;