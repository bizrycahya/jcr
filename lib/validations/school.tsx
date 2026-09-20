import { z } from "zod";

export const schoolSchema = z.object({
  namaSekolah: z.string().min(1, "Nama sekolah wajib diisi").max(150),
  yayasan: z.string().max(150).optional().or(z.literal("")),
  alamat: z.string().max(300).optional().or(z.literal("")),
  telepon: z.string().max(30).optional().or(z.literal("")),
  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  logoUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  loginBackgroundUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

export type SchoolInput = z.infer<typeof schoolSchema>;