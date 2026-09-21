import { requireRole } from "@/lib/session";
import { LaporanManager } from "@/components/laporan/laporan-manager";

export default async function SuperAdminLaporanPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <LaporanManager />;
}