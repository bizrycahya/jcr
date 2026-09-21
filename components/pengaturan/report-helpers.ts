const PREDIKAT_TEXT: Record<number, string> = {
  1: "masih perlu bimbingan dan pendampingan intensif",
  2: "sudah menunjukkan usaha yang cukup baik",
  3: "menunjukkan perkembangan yang baik dan konsisten",
  4: "menunjukkan perkembangan yang sangat baik dan patut dicontoh",
};

export function generateCapaianText(categoryLabel: string, rataRata: number, indikatorNames: string[]): string {
  const rounded = Math.round(rataRata);
  const clamped = Math.min(4, Math.max(1, rounded));
  const teks = PREDIKAT_TEXT[clamped];

  if (indikatorNames.length === 0) {
    return `Ananda ${teks} pada aspek ${categoryLabel.toLowerCase()}.`;
  }

  return `Ananda ${teks} pada aspek ${categoryLabel.toLowerCase()}, khususnya dalam ${indikatorNames.join(", ")}.`;
}

export function nilaiToPredikat(nilai: number): string {
  const rounded = Math.round(nilai);
  if (rounded <= 1) return "Kurang";
  if (rounded === 2) return "Cukup";
  if (rounded === 3) return "Baik";
  return "Sangat Baik";
}