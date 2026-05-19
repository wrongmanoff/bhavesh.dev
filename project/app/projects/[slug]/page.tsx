import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProjectSection } from "@/components/projects/ProjectSection";
import { ScreenshotGallery } from "@/components/projects/ScreenshotGallery";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { getProjectBySlug, getRelatedProjects } from "@/lib/data/projects";
import { PROJECT_STATUS_CONFIG, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project);
  const status = PROJECT_STATUS_CONFIG[project.status];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88] mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        back to projects
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className={cn("border", status.color)}>{status.label}</Badge>
          <span className="font-mono text-xs text-[#6b6b6b]">
            {formatDate(project.created_at)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {project.title}
        </h1>

        <p className="text-[#a0a0a0] leading-relaxed mb-6">{project.description}</p>

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-2.5 py-1 rounded bg-[#111111] text-[#00ff88] border border-[#00ff88]/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded border border-[#1e1e1e] text-[#a0a0a0] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
            >
              <Code2 size={14} />
              github
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 transition-colors"
            >
              <ExternalLink size={14} />
              live demo
            </a>
          )}
        </div>
      </header>

      {project.architecture_img && (
        <section className="mb-10">
          <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
            architecture
          </h2>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1e1e1e]">
            <Image
              src={project.architecture_img}
              alt={`${project.title} architecture`}
              fill
              className="object-contain bg-[#0d0d0d]"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </section>
      )}

      <ProjectSection label="why i built this" content={project.why_built} />
      <ProjectSection label="problems i faced" content={project.problem_faced} />
      <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
      <ProjectSection label="lessons learned" content={project.lessons_learned} />
      <ProjectSection label="future plans" content={project.future_plans} />

      <RelatedProjects projects={related} />
    </article>
  );
}
