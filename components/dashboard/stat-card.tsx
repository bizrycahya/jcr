import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-maroon-800/60">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
        </span>
      </div>
      <p className="mt-3 font-serif text-3xl text-maroon-900">{value}</p>
    </div>
  );
}
