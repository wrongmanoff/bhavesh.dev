import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types";
import type { ReviewCategoryFilter } from "@/lib/reviews/constants";

export async function getReviews(options?: {
  category?: ReviewCategoryFilter;
}): Promise<Review[]> {
  const { category = "all" } = options ?? {};
  const supabase = await createClient();

  let query = supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getReviews:", error.message);
    return [];
  }
  return (data ?? []) as Review[];
}

export async function getReviewById(id: string): Promise<Review | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Review;
}
