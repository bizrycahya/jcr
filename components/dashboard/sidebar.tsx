"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import type { Role } from "@prisma/client";
import { NAV_ITEMS, ROLE_LABEL } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] ?? [];

  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r border-maroon-900/10 bg-maroon-950 text-cream md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="font-serif text-xl">JANIC</span>
        <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold-300">
          {ROLE_LABEL[role]}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role.toLowerCase().replace("_", "-")}` &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition",
                isActive
                  ? "bg-gold-400/15 text-gold-300"
                  : "text-cream/60 hover:bg-cream/5 hover:text-cream"
              )}
            >
              <item.icon className="h-4.5 w-4.5" strokeWidth={1.6} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cream/60 transition hover:bg-cream/5 hover:text-cream"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={1.6} />
          Logout
        </button>
      </div>
    </aside>
  );
}
