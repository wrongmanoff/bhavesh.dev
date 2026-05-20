"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface GalleryFiltersProps {
  categories: string[];
  activeCategory: string;
}

export function GalleryFilters({ categories, activeCategory }: GalleryFiltersProps) {
  const categoryLabels: Record<string, string> = {
    all: "All",
    screenshot: "Screenshots",
    setup: "Setups",
    travel: "Travel",
    cert: "Certificates",
    coding: "Coding",
    event: "Events",
  };

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/gallery?category=${category}`}
          className={cn(
            "font-mono text-xs px-3 py-1.5 rounded border transition-all duration-200",
            activeCategory === category
              ? "border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10"
              : "border-[#1e1e1e] text-[#a0a0a0] hover:border-[#2e2e2e] hover:text-white"
          )}
        >
          {categoryLabels[category] || category}
        </Link>
      ))}
    </div>
  );
}
