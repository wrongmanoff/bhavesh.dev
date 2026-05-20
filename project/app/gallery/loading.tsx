import { Skeleton } from "@/components/ui/SkeletonLoader";

export default function GalleryLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <Skeleton className="h-10 w-full mb-8 rounded-lg" />
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className={index % 2 === 0 ? "h-72 rounded-lg" : "h-96 rounded-lg"}
          />
        ))}
      </div>
    </div>
  );
}
