"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { achievementAdminSchema, toFieldErrors, type AchievementAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createAchievement(input: AchievementAdminInput) {
  const parsed = achievementAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["achievements"]["Insert"] = {
    title: parsed.data.title,
    type: parsed.data.type,
    issuer: parsed.data.issuer,
    date: parsed.data.date || null,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl,
    credential_url: parsed.data.credentialUrl,
    featured: parsed.data.featured,
  };

  const { error } = await supabase.from("achievements").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/vault", "/vault");
  return successResult();
}

export async function updateAchievement(id: string, input: AchievementAdminInput) {
  const parsed = achievementAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["achievements"]["Update"] = {
    title: parsed.data.title,
    type: parsed.data.type,
    issuer: parsed.data.issuer,
    date: parsed.data.date || null,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl,
    credential_url: parsed.data.credentialUrl,
    featured: parsed.data.featured,
  };

  const { error } = await supabase.from("achievements").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/vault", "/vault");
  return successResult();
}

export async function deleteAchievement(id: string) {
  const supabase = await createAdminActionClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/vault", "/vault");
  return successResult();
}
