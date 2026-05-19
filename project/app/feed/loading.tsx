import { FeedSkeleton } from "@/components/ui/SkeletonLoader";
import { Skeleton } from "@/components/ui/SkeletonLoader";

export default function FeedLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <Skeleton className="h-32 w-full mb-8 rounded-lg" />
      <FeedSkeleton />
    </div>
  );
}
