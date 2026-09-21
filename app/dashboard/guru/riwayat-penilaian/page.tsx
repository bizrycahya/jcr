import { requireRole } from "@/lib/session";
import { RiwayatPenilaian } from "@/components/guru/riwayat-penilaian";

export default async function GuruRiwayatPenilaianPage() {
  await requireRole(["GURU", "WALI_KELAS", "BK"]);

  return <RiwayatPenilaian />;
}
