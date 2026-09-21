import { requireRole } from "@/lib/session";
import { SemesterLaporanManager } from "@/components/laporan/semester-laporan-manager";

export default async function SuperAdminLaporanSemesterPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <SemesterLaporanManager />;
}