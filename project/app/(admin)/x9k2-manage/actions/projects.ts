"use server";

import { createAdminActionClient, errorResult, revalidateAdminPaths, successResult } from "@/app/x9k2-manage/actions/shared";
import { projectAdminSchema, toCommaArray, toFieldErrors, toLineArray, type ProjectAdminInput } from "@/lib/validation/admin-schemas";
import type { Database } from "@/types/database";

export async function createProject(input: ProjectAdminInput) {
  const parsed = projectAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["projects"]["Insert"] = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    why_built: parsed.data.whyBuilt,
    problem_faced: parsed.data.problemFaced,
    lessons_learned: parsed.data.lessonsLearned,
    future_plans: parsed.data.futurePlans,
    tech_stack: toCommaArray(parsed.data.techStack),
    screenshots: toLineArray(parsed.data.screenshots),
    architecture_img: parsed.data.architectureImg,
    github_url: parsed.data.githubUrl,
    live_url: parsed.data.liveUrl,
    status: parsed.data.status,
  };

  const { error } = await supabase.from("projects").insert(payload);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/projects", "/projects", `/projects/${payload.slug}`, "/sitemap.xml");
  return successResult();
}

export async function updateProject(id: string, input: ProjectAdminInput) {
  const parsed = projectAdminSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Please fix the highlighted fields.", toFieldErrors(parsed.error));
  }

  const supabase = await createAdminActionClient();
  const payload: Database["public"]["Tables"]["projects"]["Update"] = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    why_built: parsed.data.whyBuilt,
    problem_faced: parsed.data.problemFaced,
    lessons_learned: parsed.data.lessonsLearned,
    future_plans: parsed.data.futurePlans,
    tech_stack: toCommaArray(parsed.data.techStack),
    screenshots: toLineArray(parsed.data.screenshots),
    architecture_img: parsed.data.architectureImg,
    github_url: parsed.data.githubUrl,
    live_url: parsed.data.liveUrl,
    status: parsed.data.status,
  };

  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/projects", "/projects", `/projects/${parsed.data.slug}`, "/sitemap.xml");
  return successResult();
}

export async function deleteProject(id: string) {
  const supabase = await createAdminActionClient();
  const { data } = await supabase.from("projects").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return errorResult(error.message);

  revalidateAdminPaths("/x9k2-manage/projects", "/projects", data?.slug ? `/projects/${data.slug}` : "/projects", "/sitemap.xml");
  return successResult();
}
