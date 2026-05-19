import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FeedSkeleton } from "@/components/ui/SkeletonLoader";
import { getGalleryItems, getGalleryCategories } from "@/lib/data/gallery";
import type { GalleryItem } from "@/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Visual memory archive — screenshots, setups, travel, and moments.",
};

interface GalleryPageProps {
  searchParams: { category?: string };
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const category = (searchParams.category || "all") as "all" | GalleryItem["category"];
  const [items, categories] = await Promise.all([
    getGalleryItems({ category }),
    getGalleryCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/gallery"
        title="Visual Memories"
        description="A curated visual archive — screenshots, setups, travel, certifications, and moments worth remembering."
      />

      <Suspense fallback={<FeedSkeleton />}>
        <GalleryFilters categories={categories} activeCategory={category} />
      </Suspense>

      <GalleryGrid items={items} />
    </div>
  );
}
