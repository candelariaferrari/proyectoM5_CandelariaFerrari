//presentacional
interface SkeletonProps {
  className?: string;
}

// Bloque base para estados de carga
export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse rounded-input bg-gris-claro ${className}`} />
);
