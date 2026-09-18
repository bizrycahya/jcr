import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function QuickActionCard({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-3 rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft transition hover:border-gold-400/50 hover:shadow-glow"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="font-serif text-base text-maroon-900">{label}</span>
    </Link>
  );
}
