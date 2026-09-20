import { requireRole } from "@/lib/session";
import { WaliKelasManager } from "@/components/wali-kelas/wali-kelas-manager";

export default async function SuperAdminWaliKelasPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <WaliKelasManager />;
}