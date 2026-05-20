import { createClient } from "@/lib/supabase/server";
import type { CyberPost } from "@/types";
import type { CyberCategory } from "@/lib/cyber/constants";

export async function getCyberPosts(options?: {
  category?: CyberCategory;
  tag?: string;
  search?: string;
}): Promise<CyberPost[]> {
  const { category = "all", tag, search } = options ?? {};
  const supabase = await createClient();

  let query = supabase
    .from("cyber_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (search?.trim()) {
    const safe = search.trim().replace(/[%_,]/g, "");
    if (safe) {
      const term = `%${safe}%`;
      query = query.or(`title.ilike.${term},content_md.ilike.${term}`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("getCyberPosts:", error.message);
    return [];
  }

  return (data ?? []) as CyberPost[];
}

export async function getCyberPostBySlug(slug: string): Promise<CyberPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cyber_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as CyberPost;
}

export async function getCyberTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cyber_posts")
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

export async function getRelatedCyberPosts(
  post: CyberPost,
  limit = 3
): Promise<CyberPost[]> {
  const supabase = await createClient();

  const { data: byCategory } = await supabase
    .from("cyber_posts")
    .select("*")
    .eq("published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  const related = (byCategory ?? []) as CyberPost[];

  if (related.length < limit && post.tags.length > 0) {
    const { data: byTag } = await supabase
      .from("cyber_posts")
      .select("*")
      .eq("published", true)
      .contains("tags", [post.tags[0]])
      .neq("id", post.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    const seen = new Set(related.map((p) => p.id));
    for (const p of (byTag ?? []) as CyberPost[]) {
      if (!seen.has(p.id) && related.length < limit) {
        related.push(p);
        seen.add(p.id);
      }
    }
  }

  return related.slice(0, limit);
}

export async function getAllCyberSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cyber_posts")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((r) => r.slug).filter(Boolean);
}

export async function getCyberPostsForSitemap(): Promise<
  Array<{ slug: string; created_at: string }>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cyber_posts")
    .select("slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.filter((post) => Boolean(post.slug));
}
