"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_FILTERS,
  type ProjectStatusFilter,
} from "@/lib/projects/constants";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  activeStatus: ProjectStatusFilter;
  activeSearch?: string;
}

export function ProjectFilters({
  activeStatus,
  activeSearch,
}: ProjectFiltersProps) {
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
        router.push(`/projects?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
        />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="search projects..."
          className={cn(
            "w-full bg-[#111111] border border-[#1e1e1e] rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#00ff88]/40",
            isPending && "opacity-70"
          )}
        />
      </form>

      <div className="flex flex-wrap gap-2">
        {PROJECT_STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() =>
              updateParams({ status: f.value === "all" ? null : f.value })
            }
            className={cn(
              "font-mono text-xs px-3 py-1.5 rounded border transition-all",
              activeStatus === f.value
                ? "border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10"
                : "border-[#1e1e1e] text-[#a0a0a0] hover:border-[#2e2e2e] hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
