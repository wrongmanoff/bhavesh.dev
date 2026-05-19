import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { CyberFilters } from "@/components/cyber/CyberFilters";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";
import { getCyberPosts, getCyberTags } from "@/lib/data/cyber";
import type { CyberCategory } from "@/lib/cyber/constants";

export const metadata: Metadata = {
  title: "Cybersecurity Hub",
  description:
    "CTF writeups, walkthroughs, learning notes, labs, tools, and technical blog posts.",
};

interface CyberPageProps {
  searchParams: { category?: string; tag?: string; q?: string };
}

function parseCategory(value?: string): CyberCategory {
  const valid: CyberCategory[] = [
    "all",
    "ctf",
    "writeup",
    "lab",
    "notes",
    "tool",
    "blog",
  ];
  if (value && valid.includes(value as CyberCategory)) {
    return value as CyberCategory;
  }
  return "all";
}

function CyberGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function CyberPage({ searchParams }: CyberPageProps) {
  const category = parseCategory(searchParams.category);
  const tag = searchParams.tag;
  const search = searchParams.q;

  const [posts, tags] = await Promise.all([
    getCyberPosts({ category, tag, search }),
    getCyberTags(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/cyber"
        title="Cybersecurity Hub"
        description="CTF writeups, walkthroughs, learning notes, home lab docs, tools, and technical deep-dives."
      />

      <Suspense fallback={<CyberGridSkeleton />}>
        <div className="mb-8">
          <CyberFilters
            tags={tags}
            activeCategory={category}
            activeTag={tag}
            activeSearch={search}
          />
        </div>
      </Suspense>

      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
          <p className="font-mono text-sm text-[#6b6b6b]">no articles found</p>
          <p className="text-xs text-[#4a4a4a] mt-2">
            try a different filter or add posts from admin
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <CyberCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
