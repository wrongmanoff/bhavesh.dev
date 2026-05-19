import { createClient } from "@/lib/supabase/server";
import type { LifeFeedPost } from "@/types";
import {
  PAGE_SIZE,
  type FeedFilter,
  type HeatmapDay,
} from "@/lib/feed/constants";

export type { FeedFilter, HeatmapDay };
export { PAGE_SIZE };

export async function getFeedPosts(options: {
  page?: number;
  filter?: FeedFilter;
  tag?: string;
}): Promise<{ posts: LifeFeedPost[]; total: number }> {
  const { page = 0, filter = "all", tag } = options;
  const supabase = await createClient();

  let query = supabase
    .from("life_feed")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    if (filter === "review") {
      query = query.eq("type", "review");
    } else {
      query = query.eq("type", filter);
    }
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("getFeedPosts:", error.message);
    return { posts: [], total: 0 };
  }

  return { posts: (data ?? []) as LifeFeedPost[], total: count ?? 0 };
}

export async function getFeedTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("life_feed")
    .select("tags")
    .eq("published", true);

  if (error || !data) return [];

  const tagSet = new Set<string>();
  for (const row of data) {
    for (const tag of row.tags ?? []) {
      if (tag) tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export async function getFeedHeatmapData(): Promise<HeatmapDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("life_feed")
    .select("created_at")
    .eq("published", true);

  if (error || !data) return buildEmptyHeatmap();

  const counts = new Map<string, number>();
  for (const row of data) {
    const day = row.created_at.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const days: HeatmapDay[] = [];
  const today = new Date();
  const totalDays = 52 * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const count = counts.get(date) ?? 0;
    days.push({ date, count, level: countToLevel(count) });
  }

  return days;
}

function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

function buildEmptyHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const today = new Date();
  const totalDays = 52 * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    });
  }
  return days;
}
