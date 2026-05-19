import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import type { ProjectStatusFilter } from "@/lib/projects/constants";

export async function getProjects(options?: {
  status?: ProjectStatusFilter;
  search?: string;
}): Promise<Project[]> {
  const { status = "all", search } = options ?? {};
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search?.trim()) {
    const safe = search.trim().replace(/[%_,]/g, "");
    if (safe) {
      const term = `%${safe}%`;
      query = query.or(`title.ilike.${term},description.ilike.${term}`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }

  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Project;
}

export async function getRelatedProjects(
  project: Project,
  limit = 3
): Promise<Project[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", project.status)
    .neq("id", project.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Project[];
}
