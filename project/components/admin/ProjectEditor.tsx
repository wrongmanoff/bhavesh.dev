"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!project?.slug);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError("Slug is required");
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug: finalSlug,
      description,
      why_built: whyBuilt,
      problem_faced: problemFaced,
      lessons_learned: lessonsLearned,
      future_plans: futurePlans,
      tech_stack: techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      screenshots: screenshots
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      architecture_img: architectureImg.trim(),
      github_url: githubUrl.trim(),
      live_url: liveUrl.trim(),
      status,
    };

    const supabase = createClient();

    if (project?.id) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("projects").insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/projects");
    router.refresh();
  }

  async function handleDelete() {
    if (!project?.id || !confirm("Delete this project?")) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", project.id);
    router.push("/admin/projects");
    router.refresh();
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
        </div>

        <MdField label="why i built this" value={whyBuilt} onChange={setWhyBuilt} />
        <MdField
          label="problems i faced"
          value={problemFaced}
          onChange={setProblemFaced}
        />
        <MdField
          label="lessons learned"
          value={lessonsLearned}
          onChange={setLessonsLearned}
        />
        <MdField label="future plans" value={futurePlans} onChange={setFuturePlans} />

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 disabled:opacity-50"
          >
            {saving ? "saving..." : project ? "update" : "create"}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">{label}</label>
      <MDEditor value={value} onChange={(v) => onChange(v ?? "")} height={200} />
    </div>
  );
}
