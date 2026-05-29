interface SparklineProps {
  accent: string;
  points?: number[];
}

export function Sparkline({
  accent,
  points = [4, 8, 6, 10, 7, 12, 9, 14, 11, 16, 13, 18, 15, 20],
}: SparklineProps) {
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${30 - (p / max) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-full w-full">
      <polyline
        points={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={accent}
      />
    </svg>
  );
}
