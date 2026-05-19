import { createClient } from "@/lib/supabase/server";
import type { LearningItem, NowPage } from "@/types";

export async function getNowPage(): Promise<NowPage | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("now_page")
    .select("*")
    .order("last_updated", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    learning_roadmap: (data.learning_roadmap as unknown as LearningItem[]) ?? [],
  } as NowPage;
}
