import { prisma } from "@/lib/prisma";

export async function logActivity(params: {
  userId: string;
  aksi: string;
  detail?: string;
  request?: Request;
}) {
  const { userId, aksi, detail, request } = params;

  const ip =
    request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request?.headers.get("x-real-ip") ??
    undefined;
  const userAgent = request?.headers.get("user-agent") ?? undefined;

  await prisma.activityLog.create({
    data: {
      userId,
      aksi,
      detail,
      ip,
      browser: userAgent,
    },
  });
}
