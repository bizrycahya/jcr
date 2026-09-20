import { requireRole } from "@/lib/session";
import { PenilaianManager } from "@/components/penilaian/penilaian-manager";

export default async function SuperAdminPenilaianPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <PenilaianManager />;
}