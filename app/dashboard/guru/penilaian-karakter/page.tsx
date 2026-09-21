import { requireRole } from "@/lib/session";
import { GuruScoreInput } from "@/components/guru/guru-score-input";

export default async function GuruPenilaianKarakterPage() {
  await requireRole(["GURU", "WALI_KELAS", "BK"]);

  return <GuruScoreInput />;
}
