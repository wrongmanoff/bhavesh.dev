"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { linkAdminSchema, toFieldErrors, type LinkAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createLink(input: LinkAdminInput) {
  const parsed = linkAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["links"]["Insert"] = {
    label: parsed.data.label,
    url: parsed.data.url,
    icon: parsed.data.icon,
    category: parsed.data.category,
    display_order: parsed.data.displayOrder,
  };

  const { error } = await supabase.from("links").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/links", "/links");
  return successResult();
}

export async function updateLink(id: string, input: LinkAdminInput) {
  const parsed = linkAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["links"]["Update"] = {
    label: parsed.data.label,
    url: parsed.data.url,
    icon: parsed.data.icon,
    category: parsed.data.category,
    display_order: parsed.data.displayOrder,
  };

  const { error } = await supabase.from("links").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/links", "/links");
  return successResult();
}

export async function deleteLink(id: string) {
  const supabase = await createAdminActionClient();
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/links", "/links");
  return successResult();
}
