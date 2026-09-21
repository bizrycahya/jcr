import { requireRole } from "@/lib/session";
import { AssignmentManager } from "@/components/penugasan/assignment-manager";

export default async function SuperAdminPenugasanMapelPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <AssignmentManager />;
}