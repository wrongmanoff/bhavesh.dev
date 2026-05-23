"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { feedAdminSchema, toCommaArray, toFieldErrors, toLineArray, type FeedAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createFeedPost(input: FeedAdminInput) {
  const parsed = feedAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["life_feed"]["Insert"] = {
    title: parsed.data.title,
    content: parsed.data.content,
    type: parsed.data.type,
    mood: parsed.data.mood,
    tags: toCommaArray(parsed.data.tags),
    images: toLineArray(parsed.data.images),
    published: parsed.data.published,
  };

  const { error } = await supabase.from("life_feed").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/feed", "/feed", "/feed.xml");
  return successResult();
}

export async function updateFeedPost(id: string, input: FeedAdminInput) {
  const parsed = feedAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["life_feed"]["Update"] = {
    title: parsed.data.title,
    content: parsed.data.content,
    type: parsed.data.type,
    mood: parsed.data.mood,
    tags: toCommaArray(parsed.data.tags),
    images: toLineArray(parsed.data.images),
    published: parsed.data.published,
  };

  const { error } = await supabase.from("life_feed").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/feed", "/feed", "/feed.xml");
  return successResult();
}

export async function deleteFeedPost(id: string) {
  const supabase = await createAdminActionClient();
  const { error } = await supabase.from("life_feed").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/feed", "/feed", "/feed.xml");
  return successResult();
}
