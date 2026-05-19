import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";
import { getProjects } from "@/lib/data/projects";
import type { ProjectStatusFilter } from "@/lib/projects/constants";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I've built — cybersecurity tools, web apps, and experiments with honest writeups.",
};

interface ProjectsPageProps {
  searchParams: { status?: string; q?: string };
}

function parseStatus(value?: string): ProjectStatusFilter {
  const valid: ProjectStatusFilter[] = ["all", "active", "wip", "archived"];
  if (value && valid.includes(value as ProjectStatusFilter)) {
    return value as ProjectStatusFilter;
  }
  return "all";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const status = parseStatus(searchParams.status);
  const search = searchParams.q;

  const projects = await getProjects({ status, search });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/projects"
        title="Project Showcase"
        description="Cybersecurity tools, web apps, and experiments — with the full story behind each build."
      />

      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <div className="mb-8">
          <ProjectFilters activeStatus={status} activeSearch={search} />
        </div>
      </Suspense>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
          <p className="font-mono text-sm text-[#6b6b6b]">no projects found</p>
          <p className="text-xs text-[#4a4a4a] mt-2">
            add projects from admin or try a different filter
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
