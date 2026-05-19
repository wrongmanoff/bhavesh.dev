import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { formatDate, PROJECT_STATUS_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface AdminProjectsPageProps {
  searchParams: { new?: string; edit?: string };
}

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const editingId = searchParams.edit;
  const isNew = searchParams.new === "1";
  const editingProject = editingId
    ? (projects as Project[] | null)?.find((p) => p.id === editingId)
    : undefined;

  if (isNew || editingProject) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">
            {editingProject ? "Edit project" : "New project"}
          </h1>
          <Link
            href="/admin/projects"
            className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88]"
          >
            ← back
          </Link>
        </div>
        <ProjectEditor project={editingProject} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Projects</h1>
        <Link
          href="/admin/projects?new=1"
          className="font-mono text-xs px-3 py-1.5 rounded border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/10"
        >
          + new project
        </Link>
      </div>

      <div className="space-y-2">
        {(projects as Project[] | null)?.map((project) => {
          const config = PROJECT_STATUS_CONFIG[project.status];
          return (
            <Link
              key={project.id}
              href={`/admin/projects?edit=${project.id}`}
              className="block p-4 rounded-lg border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded border",
                        config.color
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-white truncate">{project.title}</p>
                  <p className="font-mono text-[10px] text-[#6b6b6b] mt-0.5">
                    /projects/{project.slug}
                  </p>
                </div>
                <span className="font-mono text-xs text-[#6b6b6b] shrink-0">
                  {formatDate(project.created_at)}
                </span>
              </div>
            </Link>
          );
        })}
        {!projects?.length && (
          <p className="text-sm text-[#6b6b6b] font-mono text-center py-8">
            no projects yet — create your first one
          </p>
        )}
      </div>
    </div>
  );
}
