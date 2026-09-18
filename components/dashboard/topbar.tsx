"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { ROLE_LABEL } from "@/lib/nav-items";
import type { Role } from "@prisma/client";

export function Topbar({
  name,
  role,
  onMenuClick,
}: {
  name: string;
  role: Role;
  onMenuClick?: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-maroon-900/5 bg-cream/70 px-5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-maroon-800/60 hover:bg-maroon-900/5 md:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-maroon-800/50">
          Selamat datang, <span className="text-maroon-900">{name}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-full p-2 text-maroon-800/60 hover:bg-maroon-900/5" aria-label="Notifikasi">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-maroon-900/5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-800 font-serif text-sm text-cream">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-left text-sm md:block">
              <span className="block leading-none text-maroon-900">{name}</span>
              <span className="text-xs text-maroon-800/50">{ROLE_LABEL[role]}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-maroon-800/50" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-maroon-900/10 bg-white py-1.5 shadow-soft">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-maroon-800 hover:bg-maroon-900/5"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
