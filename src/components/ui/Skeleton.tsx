interface SkeletonProps {
  className?: string;
}

// Bloque base para estados de carga: un gris clarito con un pulso sutil
// (animate-pulse, viene con Tailwind) en vez de reemplazar todo de golpe
// por "Cargando...". Cada pantalla compone este bloque con la forma que
// tiene su propio contenido real (ver ProductCardSkeleton y los skeletons
// armados a mano en cada página), para que el esqueleto se parezca a lo
// que va a aparecer y no salte tanto al terminar de cargar.
export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse rounded-input bg-gris-claro ${className}`} />
);
