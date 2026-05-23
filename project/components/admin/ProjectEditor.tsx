"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject, deleteProject, updateProject } from "@/app/x9k2-manage/actions/projects";
import { FieldError } from "@/components/admin/FieldError";
import type { Project } from "@/types";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const STATUSES = ["active", "wip", "archived"] as const;

interface ProjectEditorProps {
  project?: Project;
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [whyBuilt, setWhyBuilt] = useState(project?.why_built ?? "");
  const [problemFaced, setProblemFaced] = useState(project?.problem_faced ?? "");
  const [lessonsLearned, setLessonsLearned] = useState(
    project?.lessons_learned ?? ""
  );
  const [futurePlans, setFuturePlans] = useState(project?.future_plans ?? "");
  const [techStack, setTechStack] = useState(
    project?.tech_stack?.join(", ") ?? ""
  );
  const [screenshots, setScreenshots] = useState(
    project?.screenshots?.join("\n") ?? ""
  );
  const [architectureImg, setArchitectureImg] = useState(
    project?.architecture_img ?? ""
  );
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [status, setStatus] = useState<Project["status"]>(
    project?.status ?? "wip"
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!project?.slug);
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const payload = {
        title,
        slug: slug.trim() || slugify(title),
        description,
        whyBuilt,
        problemFaced,
        lessonsLearned,
        futurePlans,
        techStack,
        screenshots,
        architectureImg,
        githubUrl,
        liveUrl,
        status,
      };

      const result = project?.id
        ? await updateProject(project.id, payload)
        : await createProject(payload);

      if (!result.ok) {
        setError(result.error ?? "Unable to save project.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push("/x9k2-manage/projects");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!project?.id || !confirm("Delete this project?")) return;
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (!result.ok) {
        setError(result.error ?? "Unable to delete project.");
        return;
      }
      router.push("/x9k2-manage/projects");
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5" data-color-mode="dark">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              title
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
            <FieldError error={fieldErrors.title} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              slug
            </label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              required
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
            />
            <FieldError error={fieldErrors.slug} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            one-line description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
          />
          <FieldError error={fieldErrors.description} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <FieldError error={fieldErrors.status} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              github url
            </label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
            />
            <FieldError error={fieldErrors.githubUrl} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              live demo url
            </label>
            <input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
            />
            <FieldError error={fieldErrors.liveUrl} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            tech stack (comma separated)
          </label>
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Next.js, TypeScript, Supabase"
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
          />
          <FieldError error={fieldErrors.techStack} />
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            architecture image url
          </label>
          <input
            value={architectureImg}
            onChange={(e) => setArchitectureImg(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
          <FieldError error={fieldErrors.architectureImg} />
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            screenshot urls (one per line)
          </label>
          <textarea
            value={screenshots}
            onChange={(e) => setScreenshots(e.target.value)}
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
          <FieldError error={fieldErrors.screenshots} />
        </div>

        <MdField
          label="why i built this"
          value={whyBuilt}
          onChange={setWhyBuilt}
          error={fieldErrors.whyBuilt}
        />
        <MdField
          label="problems i faced"
          value={problemFaced}
          onChange={setProblemFaced}
          error={fieldErrors.problemFaced}
        />
        <MdField
          label="lessons learned"
          value={lessonsLearned}
          onChange={setLessonsLearned}
          error={fieldErrors.lessonsLearned}
        />
        <MdField
          label="future plans"
          value={futurePlans}
          onChange={setFuturePlans}
          error={fieldErrors.futurePlans}
        />

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 disabled:opacity-50"
          >
            {isPending ? "saving..." : project ? "update" : "create"}
          </button>
          {project && (
            <button
              type="button"
              onClick={handleDelete}
              className="font-mono text-sm px-4 py-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}

function MdField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">{label}</label>
      <MDEditor value={value} onChange={(v) => onChange(v ?? "")} height={200} />
      <FieldError error={error} />
    </div>
  );
}
