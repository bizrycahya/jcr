import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-maroon-900/15 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-700">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <div>
        <p className="font-serif text-lg text-maroon-900">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-maroon-800/50">{description}</p>
      </div>
    </div>
  );
}
