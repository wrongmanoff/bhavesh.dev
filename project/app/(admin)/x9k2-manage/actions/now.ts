"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { nowPageAdminSchema, parseLearningRoadmap, toFieldErrors, toLineArray, type NowPageAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function updateNowPage(id: string, input: NowPageAdminInput) {
  const parsed = nowPageAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["now_page"]["Update"] = {
    current_focus: parsed.data.currentFocus,
    current_goals: toLineArray(parsed.data.goals),
    books: toLineArray(parsed.data.books),
    obsessions: toLineArray(parsed.data.obsessions),
    current_projects: toLineArray(parsed.data.projects),
    learning_roadmap: parseLearningRoadmap(parsed.data.roadmapJson) as Database["public"]["Tables"]["now_page"]["Update"]["learning_roadmap"],
    last_updated: new Date().toISOString(),
  };

  const { error } = await supabase.from("now_page").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/now", "/now", "/");
  return successResult();
}
