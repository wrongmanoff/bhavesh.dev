import { createClient } from "@/lib/supabase/server";
import type { Link } from "@/types";

export async function getLinks(): Promise<Link[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("getLinks:", error.message);
    return [];
  }
  return (data ?? []) as Link[];
}
