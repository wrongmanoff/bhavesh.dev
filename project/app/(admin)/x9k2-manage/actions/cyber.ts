"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { cyberAdminSchema, toCommaArray, toFieldErrors, type CyberAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createCyberPost(input: CyberAdminInput) {
  const parsed = cyberAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["cyber_posts"]["Insert"] = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    content_md: parsed.data.contentMd,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    platform: parsed.data.platform,
    tags: toCommaArray(parsed.data.tags),
    published: parsed.data.published,
    images: [],
  };

  const { error } = await supabase.from("cyber_posts").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/cyber", "/cyber", `/cyber/${payload.slug}`, "/feed.xml", "/sitemap.xml");
  return successResult();
}

export async function updateCyberPost(id: string, input: CyberAdminInput) {
  const parsed = cyberAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["cyber_posts"]["Update"] = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    content_md: parsed.data.contentMd,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    platform: parsed.data.platform,
    tags: toCommaArray(parsed.data.tags),
    published: parsed.data.published,
  };

  const { error } = await supabase.from("cyber_posts").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/cyber", "/cyber", `/cyber/${parsed.data.slug}`, "/feed.xml", "/sitemap.xml");
  return successResult();
}

export async function deleteCyberPost(id: string) {
  const supabase = await createAdminActionClient();
  const { data } = await supabase.from("cyber_posts").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("cyber_posts").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/cyber", "/cyber", data?.slug ? `/cyber/${data.slug}` : "/cyber", "/feed.xml", "/sitemap.xml");
  return successResult();
}
