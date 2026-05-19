"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { CYBER_CATEGORIES, type CyberCategory } from "@/lib/cyber/constants";
import { Search } from "lucide-react";

interface CyberFiltersProps {
  tags: string[];
  activeCategory: CyberCategory;
  activeTag?: string;
  activeSearch?: string;
}

export function CyberFilters({
  tags,
  activeCategory,
  activeTag,
  activeSearch,
}: CyberFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(activeSearch ?? "");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      startTransition(() => {
        router.push(`/cyber?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  const activeMeta = CYBER_CATEGORIES.find((c) => c.value === activeCategory);

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
        />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="search articles..."
          className={cn(
            "w-full bg-[#111111] border border-[#1e1e1e] rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#00ff88]/40",
            isPending && "opacity-70"
          )}
        />
      </form>

      {activeMeta && activeCategory !== "all" && (
        <p className="text-xs text-[#6b6b6b] font-mono">{activeMeta.desc}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {CYBER_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() =>
              updateParams({ category: cat.value === "all" ? null : cat.value })
            }
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

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => updateParams({ tag: null })}
            className={cn(
              "font-mono text-[10px] px-2 py-1 rounded border transition-all",
              !activeTag
                ? "border-[#00ff88]/40 text-[#00ff88]"
                : "border-[#1e1e1e] text-[#6b6b6b] hover:text-white"
            )}
          >
            all tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => updateParams({ tag })}
              className={cn(
                "font-mono text-[10px] px-2 py-1 rounded border transition-all",
                activeTag === tag
                  ? "border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/5"
                  : "border-[#1e1e1e] text-[#6b6b6b] hover:text-white"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
