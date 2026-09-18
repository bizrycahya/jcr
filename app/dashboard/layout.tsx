import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { getCurrentSession } from "@/lib/session";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as Role;
  const name = session.user.name ?? "Pengguna";

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar role={role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar name={name} role={role} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
