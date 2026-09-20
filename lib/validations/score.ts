import { z } from "zod";

export const scoreEntrySchema = z.object({
  indicatorId: z.string().min(1),
  nilai: z.number().int().min(1).max(4),
});

export const scoreSubmitSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  teacherId: z.string().min(1, "Guru penilai wajib dipilih"),
  bulan: z.number().int().min(1).max(12),
  tahun: z.number().int().min(2000),
  scores: z.array(scoreEntrySchema).min(1, "Minimal satu indikator dinilai"),
});

export type ScoreSubmitInput = z.infer<typeof scoreSubmitSchema>;