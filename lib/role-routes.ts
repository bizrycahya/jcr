import { Role } from "@prisma/client";

/**
 * Peta setiap role ke root path dashboard-nya.
 * Digunakan untuk redirect otomatis setelah login dan oleh middleware
 * untuk memvalidasi apakah sebuah role berhak mengakses sebuah path.
 */
export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  ADMIN: "/dashboard/admin",
  KEPALA_SEKOLAH: "/dashboard/kepala-sekolah",
  BK: "/dashboard/bk",
  WALI_KELAS: "/dashboard/wali-kelas",
  GURU: "/dashboard/guru",
  ORANG_TUA: "/dashboard/orang-tua",
  SISWA: "/dashboard/siswa",
};

/**
 * Role yang boleh mengakses sebuah prefix path dashboard.
 * SUPER_ADMIN selalu punya akses penuh ke semua dashboard.
 */
export const PATH_ALLOWED_ROLES: Record<string, Role[]> = {
  "/dashboard/super-admin": ["SUPER_ADMIN"],
  "/dashboard/admin": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/kepala-sekolah": ["SUPER_ADMIN", "KEPALA_SEKOLAH"],
  "/dashboard/bk": ["SUPER_ADMIN", "BK"],
  "/dashboard/wali-kelas": ["SUPER_ADMIN", "WALI_KELAS"],
  "/dashboard/guru": ["SUPER_ADMIN", "GURU"],
  "/dashboard/orang-tua": ["SUPER_ADMIN", "ORANG_TUA"],
  "/dashboard/siswa": ["SUPER_ADMIN", "SISWA"],
};

export function getDashboardPathForRole(role: Role): string {
  return ROLE_DASHBOARD_PATH[role] ?? "/login";
}

export function isRoleAllowedForPath(role: Role, pathname: string): boolean {
  const matchedPrefix = Object.keys(PATH_ALLOWED_ROLES).find((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!matchedPrefix) return true; // path di luar /dashboard/* tidak dibatasi di sini
  return PATH_ALLOWED_ROLES[matchedPrefix].includes(role);
}
