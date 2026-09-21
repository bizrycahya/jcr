import { z } from "zod";

export const academicYearSchema = z.object({
  tahun: z.string().min(4, "Format tahun ajaran tidak valid, contoh: 2025/2026"),
  semester: z.number().int().min(1).max(2),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  isActive: z.boolean().default(false),
});

export type AcademicYearInput = z.infer<typeof academicYearSchema>;