import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/role-routes";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

/**
 * Dipakai di awal Server Component dashboard untuk memastikan
 * hanya role yang diizinkan yang bisa merender halaman tersebut.
 * Contoh: const session = await requireRole(["GURU", "SUPER_ADMIN"]);
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as Role;

  if (!allowedRoles.includes(role)) {
    redirect(getDashboardPathForRole(role));
  }

  return session;
}
