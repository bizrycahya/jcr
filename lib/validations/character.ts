import { z } from "zod";

export const categorySchema = z.object({
  label: z.string().min(1, "Label wajib diisi"),
  deskripsi: z.string().optional().or(z.literal("")),
  urutan: z.number().int().min(0),
});

export const indicatorSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  nama: z.string().min(1, "Nama indikator wajib diisi"),
  deskripsi: z.string().optional().or(z.literal("")),
  urutan: z.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type IndicatorInput = z.infer<typeof indicatorSchema>;