"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { galleryAdminSchema, toFieldErrors, type GalleryAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createGalleryItem(input: GalleryAdminInput) {
  const parsed = galleryAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["gallery"]["Insert"] = {
    title: parsed.data.title,
    caption: parsed.data.caption,
    category: parsed.data.category,
    taken_at: parsed.data.takenAt || null,
    image_url: parsed.data.imageUrl,
  };

  const { error } = await supabase.from("gallery").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/gallery", "/gallery");
  return successResult();
}

export async function updateGalleryItem(id: string, input: GalleryAdminInput) {
  const parsed = galleryAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["gallery"]["Update"] = {
    title: parsed.data.title,
    caption: parsed.data.caption,
    category: parsed.data.category,
    taken_at: parsed.data.takenAt || null,
    image_url: parsed.data.imageUrl,
  };

  const { error } = await supabase.from("gallery").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/gallery", "/gallery");
  return successResult();
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createAdminActionClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/gallery", "/gallery");
  return successResult();
}
