import { Skeleton } from "../ui/Skeleton";
//presentacional

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-card p-3 flex flex-col gap-1.5 shadow-card">
    <Skeleton className="w-full aspect-square rounded-input" />
    <Skeleton className="h-2.5 w-12" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-3 w-16" />
    <Skeleton className="h-5 w-20" />
    <Skeleton className="h-8 w-full rounded-pill mt-1" />
  </div>
);
