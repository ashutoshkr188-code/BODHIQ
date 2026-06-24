export default function LoadingSkeleton({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-full animate-shimmer"
          style={{
            width: `${85 - i * 15}%`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
