import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { isRoleAllowedForPath, getDashboardPathForRole } from "@/lib/role-routes";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Belum login sama sekali -> withAuth sudah redirect ke /login,
    // di sini kita hanya menangani kasus role tidak sesuai path.
    if (token?.role && !isRoleAllowedForPath(token.role as Role, pathname)) {
      const correctPath = getDashboardPathForRole(token.role as Role);
      return NextResponse.redirect(new URL(correctPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/siswa/:path*",
    "/api/guru/:path*",
    "/api/kelas/:path*",
    "/api/penilaian/:path*",
    "/api/laporan/:path*",
    "/api/pengaturan/:path*",
    "/api/backup/:path*",
  ],
};
