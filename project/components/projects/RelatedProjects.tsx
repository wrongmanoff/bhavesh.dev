import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PROJECT_STATUS_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface RelatedProjectsProps {
  projects: Project[];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[#1e1e1e]">
      <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
        more projects
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {projects.map((project) => {
          const status = PROJECT_STATUS_CONFIG[project.status];
          return (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <Card hover className="p-4 h-full">
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded border mb-2 inline-block",
                    status.color
                  )}
                >
                  {status.label}
                </span>
                <h3 className="text-sm font-medium text-white line-clamp-2">
                  {project.title}
                </h3>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
