import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeInUp } from "@/components/ui/Motion";
import { PROJECT_STATUS_CONFIG, formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { Code2, ExternalLink, FolderKanban } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = PROJECT_STATUS_CONFIG[project.status];

  return (
    <FadeInUp>
      <Card hover glow className="p-5 h-full flex flex-col group">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className={cn("border", status.color)}>{status.label}</Badge>
          <FolderKanban
            size={14}
            className="text-[#3a3a3a] group-hover:text-[#00ff88]/50 shrink-0 transition-colors"
          />
        </div>

        <Link href={`/projects/${project.slug}`} className="flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-[#a0a0a0] leading-relaxed line-clamp-3 flex-1">
            {truncate(project.description, 160)}
          </p>
        </Link>

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tech_stack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1a1a1a] text-[#a0a0a0] border border-[#1e1e1e]"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 5 && (
              <span className="font-mono text-[10px] text-[#6b6b6b]">
                +{project.tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e1e]">
          <span className="font-mono text-[10px] text-[#6b6b6b]">
            {formatDate(project.created_at)}
          </span>
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b6b6b] hover:text-[#00ff88] transition-colors"
                aria-label="GitHub"
              >
                <Code2 size={14} />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b6b6b] hover:text-[#00ff88] transition-colors"
                aria-label="Live demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="font-mono text-[10px] text-[#00ff88] hover:underline"
            >
              details →
            </Link>
          </div>
        </div>
      </Card>
    </FadeInUp>
  );
}
