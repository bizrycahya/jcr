import { requireRole } from "@/lib/session";
import { TeacherManager } from "@/components/guru/teacher-manager";

export default async function SuperAdminGuruPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <TeacherManager />;
}