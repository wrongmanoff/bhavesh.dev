"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  REVIEW_CATEGORIES,
  type ReviewCategoryFilter,
} from "@/lib/reviews/constants";

interface ReviewFiltersProps {
  activeCategory: ReviewCategoryFilter;
}

export function ReviewFilters({ activeCategory }: ReviewFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(category: ReviewCategoryFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    router.push(`/reviews?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REVIEW_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => setCategory(cat.value)}
          className={cn(
            "font-mono text-xs px-3 py-1.5 rounded border transition-all",
            activeCategory === cat.value
              ? "border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10"
              : "border-[#1e1e1e] text-[#a0a0a0] hover:border-[#2e2e2e] hover:text-white"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
