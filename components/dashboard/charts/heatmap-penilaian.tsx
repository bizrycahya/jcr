// NOTE: data contoh untuk demo tampilan. Ganti dengan agregasi rata-rata
// CharacterScore per (CharacterCategory x bulan) dari Prisma.
const CATEGORIES = ["Akhlak", "Disiplin", "Kepemimpinan", "Akademik", "Sosial"];
const MONTHS = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const VALUES: number[][] = [
  [3.4, 3.5, 3.6, 3.5, 3.7, 3.8],
  [3.0, 3.1, 3.3, 3.0, 3.2, 3.4],
  [3.2, 3.3, 3.2, 3.4, 3.5, 3.6],
  [2.9, 3.0, 3.1, 3.0, 3.2, 3.3],
  [3.5, 3.6, 3.7, 3.6, 3.8, 3.9],
];

function intensity(value: number) {
  // skala 1-4 -> opacity 0.15-1
  const ratio = Math.min(Math.max((value - 1) / 3, 0), 1);
  return 0.15 + ratio * 0.85;
}

export function HeatmapPenilaian() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="w-24" />
            {MONTHS.map((m) => (
              <th key={m} className="pb-1 font-normal text-maroon-800/50">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat, rowIdx) => (
            <tr key={cat}>
              <td className="pr-2 text-right text-maroon-800/60">{cat}</td>
              {VALUES[rowIdx].map((value, colIdx) => (
                <td key={colIdx}>
                  <div
                    className="flex h-9 w-full items-center justify-center rounded-md text-[11px] font-medium text-maroon-900"
                    style={{ backgroundColor: `rgba(212, 175, 55, ${intensity(value)})` }}
                    title={`${cat} · ${MONTHS[colIdx]}: ${value}`}
                  >
                    {value.toFixed(1)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
