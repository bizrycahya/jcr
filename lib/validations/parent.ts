import { z } from "zod";

const waIndonesiaRegex = /^(08|628)[0-9]{8,11}$/;

export const parentSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  whatsapp: z.string().regex(waIndonesiaRegex, "Format nomor WA Indonesia tidak valid"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  studentIds: z.array(z.string()).min(1, "Pilih minimal satu siswa"),
});

export type ParentInput = z.infer<typeof parentSchema>;