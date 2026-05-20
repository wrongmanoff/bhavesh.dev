import { Skeleton, CardSkeleton } from "@/components/ui/SkeletonLoader";

export default function ReviewsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <Skeleton className="h-10 w-full mb-6 rounded-lg" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
