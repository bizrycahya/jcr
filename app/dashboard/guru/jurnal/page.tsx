import { requireRole } from "@/lib/session";
import { JurnalGuru } from "@/components/guru/jurnal-guru";

export default async function GuruJurnalPage() {
  await requireRole(["GURU", "WALI_KELAS", "BK"]);

  return <JurnalGuru />;
}