import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewFilters } from "@/components/reviews/ReviewFilters";
import { getReviews } from "@/lib/data/reviews";
import type { ReviewCategoryFilter } from "@/lib/reviews/constants";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Personal reviews of food, cafes, products, places, movies, and books.",
};

interface ReviewsPageProps {
  searchParams: { category?: string };
}

function parseCategory(value?: string): ReviewCategoryFilter {
  const valid: ReviewCategoryFilter[] = [
    "all",
    "food",
    "cafe",
    "product",
    "place",
    "movie",
    "book",
  ];
  if (value && valid.includes(value as ReviewCategoryFilter)) {
    return value as ReviewCategoryFilter;
  }
  return "all";
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const category = parseCategory(searchParams.category);
  const reviews = await getReviews({ category });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/reviews"
        title="Reviews"
        description="Honest takes on food, cafes, products, places, movies, and books."
      />

      <Suspense fallback={<div className="h-10 mb-8 animate-pulse bg-[#1a1a1a] rounded" />}>
        <div className="mb-8">
          <ReviewFilters activeCategory={category} />
        </div>
      </Suspense>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
          <p className="font-mono text-sm text-[#6b6b6b]">no reviews yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
