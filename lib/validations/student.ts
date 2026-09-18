import { z } from "zod";

// Nomor WA Indonesia: boleh diawali 08 atau 62, 9-13 digit setelahnya
const waIndonesiaRegex = /^(08|628)[0-9]{8,11}$/;

export const studentSchema = z.object({
  nis: z.string().min(3, "NIS minimal 3 karakter"),
  nisn: z.string().min(3, "NISN minimal 3 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  jenisKelamin: z.enum(["L", "P"]),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  agama: z.string().min(1, "Agama wajib diisi"),
  classId: z.string().min(1, "Kelas wajib dipilih"),
  fotoUrl: z.string().url("URL foto tidak valid").optional().or(z.literal("")),
  namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
  namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
  waOrangTua: z.string().regex(waIndonesiaRegex, "Format nomor WA Indonesia tidak valid"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  status: z.enum(["AKTIF", "LULUS", "PINDAH", "KELUAR", "NONAKTIF"]).default("AKTIF"),
});

export type StudentInput = z.infer<typeof studentSchema>;
