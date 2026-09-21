import { requireRole } from "@/lib/session";
import { UserManager } from "@/components/user/user-manager";

export default async function SuperAdminManajemenUserPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <UserManager />;
}