"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { reviewAdminSchema, toFieldErrors, toLineArray, type ReviewAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createReview(input: ReviewAdminInput) {
  const parsed = reviewAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["reviews"]["Insert"] = {
    title: parsed.data.title,
    content: parsed.data.content,
    category: parsed.data.category,
    rating: parsed.data.rating,
    location: parsed.data.location,
    price_range: parsed.data.priceRange,
    images: toLineArray(parsed.data.images),
    published: parsed.data.published,
  };

  const { error } = await supabase.from("reviews").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/reviews", "/reviews");
  return successResult();
}

export async function updateReview(id: string, input: ReviewAdminInput) {
  const parsed = reviewAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["reviews"]["Update"] = {
    title: parsed.data.title,
    content: parsed.data.content,
    category: parsed.data.category,
    rating: parsed.data.rating,
    location: parsed.data.location,
    price_range: parsed.data.priceRange,
    images: toLineArray(parsed.data.images),
    published: parsed.data.published,
  };

  const { error } = await supabase.from("reviews").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/reviews", "/reviews");
  return successResult();
}

export async function deleteReview(id: string) {
  const supabase = await createAdminActionClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/reviews", "/reviews");
  return successResult();
}
