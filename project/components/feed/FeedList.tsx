"use client";

import { useState } from "react";
import { FeedCard } from "@/components/feed/FeedCard";
import { FeedSkeleton } from "@/components/ui/SkeletonLoader";
import { createClient } from "@/lib/supabase/client";
import type { LifeFeedPost } from "@/types";
import { PAGE_SIZE, type FeedFilter } from "@/lib/feed/constants";

interface FeedListProps {
  initialPosts: LifeFeedPost[];
  total: number;
  filter: FeedFilter;
  tag?: string;
}

export function FeedList({ initialPosts, total, filter, tag }: FeedListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const hasMore = posts.length < total;

  async function loadMore() {
    setLoading(true);
    const supabase = createClient();
    const nextPage = page + 1;

    let query = supabase
      .from("life_feed")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("type", filter);
    }
    if (tag) {
      query = query.contains("tags", [tag]);
    }

    const from = nextPage * PAGE_SIZE;
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);

    if (!error && data) {
      setPosts((prev) => [...prev, ...(data as LifeFeedPost[])]);
      setPage(nextPage);
    }
    setLoading(false);
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
        <p className="font-mono text-sm text-[#6b6b6b]">no posts yet</p>
        <p className="text-xs text-[#4a4a4a] mt-2">
          check back soon — or log in to admin to publish
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      {loading && <FeedSkeleton />}

      {hasMore && !loading && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full font-mono text-sm py-3 rounded-lg border border-[#1e1e1e] text-[#a0a0a0] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-all"
        >
          load more ({posts.length} / {total})
        </button>
      )}
    </div>
  );
}
