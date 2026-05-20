import { Skeleton } from "@/components/ui/SkeletonLoader";

export default function NowLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-80 mb-8" />
      <Skeleton className="h-24 w-full rounded-lg mb-6" />
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-28 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
