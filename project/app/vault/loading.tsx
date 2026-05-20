import { Skeleton, CardSkeleton } from "@/components/ui/SkeletonLoader";

export default function VaultLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Skeleton className="h-8 w-52 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
