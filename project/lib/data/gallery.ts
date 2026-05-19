import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types";

export async function getGalleryItems(options?: {
  category?: GalleryItem["category"] | "all";
}): Promise<GalleryItem[]> {
  const { category } = options ?? {};
  const supabase = await createClient();

  let query = supabase
    .from("gallery")
    .select("*")
    .order("taken_at", { ascending: false, nullsFirst: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getGalleryItems:", error.message);
    return [];
  }

  return (data ?? []) as GalleryItem[];
}

export async function getGalleryCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery").select("category");

  if (error || !data) return ["all"];

  const categories = new Set(data.map((item) => item.category));
  return ["all", ...Array.from(categories)];
}
