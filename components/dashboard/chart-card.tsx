export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-maroon-900">{title}</h3>
        {subtitle && <p className="text-xs text-maroon-800/50">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
