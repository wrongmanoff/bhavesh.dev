import { Suspense } from "react";
import type { Metadata } from "next";
import { ActivityHeatmap } from "@/components/heatmap/ActivityHeatmap";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { FeedList } from "@/components/feed/FeedList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeedSkeleton } from "@/components/ui/SkeletonLoader";
import {
  getFeedHeatmapData,
  getFeedPosts,
  getFeedTags,
} from "@/lib/data/feed";
import type { FeedFilter } from "@/lib/feed/constants";

export const metadata: Metadata = {
  title: "Life Feed",
  description: "Personal journal, productive logs, thoughts, and life moments.",
};

interface FeedPageProps {
  searchParams: { filter?: string; tag?: string };
}

function parseFilter(value?: string): FeedFilter {
  const valid: FeedFilter[] = [
    "all",
    "productive",
    "wasted",
    "review",
    "thought",
    "log",
  ];
  if (value && valid.includes(value as FeedFilter)) {
    return value as FeedFilter;
  }
  return "all";
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = searchParams;
  const filter = parseFilter(params.filter);
  const tag = params.tag;

  const [heatmapDays, { posts, total }, tags] = await Promise.all([
    getFeedHeatmapData(),
    getFeedPosts({ filter, tag }),
    getFeedTags(),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/feed"
        title="Life Feed"
        description="Short updates, wins, failures, thoughts — documenting the journey in public."
      />

      <div className="mb-8">
        <ActivityHeatmap days={heatmapDays} />
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <div className="mb-8">
          <FeedFilters tags={tags} activeFilter={filter} activeTag={tag} />
        </div>
      </Suspense>

      <FeedList
        key={`${filter}-${tag ?? ""}`}
        initialPosts={posts}
        total={total}
        filter={filter}
        tag={tag}
      />
    </div>
  );
}
