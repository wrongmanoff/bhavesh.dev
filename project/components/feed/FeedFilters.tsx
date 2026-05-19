"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { FeedFilter } from "@/lib/feed/constants";

const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "productive", label: "Productive" },
  { value: "wasted", label: "Wasted" },
  { value: "review", label: "Reviews" },
  { value: "thought", label: "Thoughts" },
  { value: "log", label: "Logs" },
];

interface FeedFiltersProps {
  tags: string[];
  activeFilter: FeedFilter;
  activeTag?: string;
}

export function FeedFilters({ tags, activeFilter, activeTag }: FeedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    router.push(`/feed?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => updateParams({ filter: f.value === "all" ? null : f.value })}
            className={cn(
              "font-mono text-xs px-3 py-1.5 rounded border transition-all",
              activeFilter === f.value
                ? "border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10"
                : "border-[#1e1e1e] text-[#a0a0a0] hover:border-[#2e2e2e] hover:text-white"
            )}
          >
            {f.label}
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
