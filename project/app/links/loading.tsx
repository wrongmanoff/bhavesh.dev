import { Skeleton } from "@/components/ui/SkeletonLoader";

export default function LinksLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-24">
      <Skeleton className="w-20 h-20 rounded-full mb-4" />
      <Skeleton className="h-7 w-56 mb-2" />
      <Skeleton className="h-4 w-64 mb-10" />
      <div className="w-full max-w-md space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
