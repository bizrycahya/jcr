const DOTS = [
  { top: "12%", left: "8%", size: 3, delay: "0s" },
  { top: "22%", left: "82%", size: 2, delay: "0.6s" },
  { top: "68%", left: "12%", size: 2, delay: "1.1s" },
  { top: "78%", left: "88%", size: 3, delay: "0.3s" },
  { top: "40%", left: "92%", size: 2, delay: "1.6s" },
  { top: "8%", left: "48%", size: 2, delay: "0.9s" },
  { top: "85%", left: "45%", size: 2, delay: "1.3s" },
  { top: "55%", left: "5%", size: 3, delay: "0.2s" },
];

export function ParticleField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold-400/50 animate-pulse"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            animationDelay: dot.delay,
            animationDuration: "3.5s",
          }}
        />
      ))}
    </div>
  );
}
