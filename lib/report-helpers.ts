// lib/report-helpers.ts

export type Predikat = "A" | "B" | "C" | "D";

// Nilai maksimum skala penilaian karakter.
// Ubah sesuai aplikasimu: 4 (skala 1-4), 5 (skala 1-5), atau 100.
export const NILAI_MAX = 4;

export function nilaiToPredikat(nilai: number): Predikat {
  const persen = (nilai / NILAI_MAX) * 100;
  if (persen >= 90) return "A";
  if (persen >= 75) return "B";
  if (persen >= 60) return "C";
  return "D";
}

const DESKRIPSI: Record<Predikat, string> = {
  A: "sangat baik",
  B: "baik",
  C: "cukup",
  D: "perlu bimbingan",
};

export function generateCapaianText(
  label: string,
  avg: number,
  indikatorNames: string[]
): string {
  const predikat = nilaiToPredikat(avg);
  const indikator =
    indikatorNames.length > 0
      ? ` Indikator yang dinilai: ${indikatorNames.join(", ")}.`
      : "";

  return `Capaian pada aspek ${label} tergolong ${DESKRIPSI[predikat]}.${indikator}`;
}