"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CyberPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";
import { CYBER_DIFFICULTIES } from "@/lib/cyber/constants";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CATEGORIES = ["ctf", "writeup", "lab", "notes", "tool", "blog"] as const;

interface CyberPostEditorProps {
  post?: CyberPost;
}

export function CyberPostEditor({ post }: CyberPostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [contentMd, setContentMd] = useState(post?.content_md ?? "");
  const [category, setCategory] = useState<CyberPost["category"]>(
    post?.category ?? "blog"
  );
  const [difficulty, setDifficulty] = useState<CyberPost["difficulty"]>(
    post?.difficulty ?? "medium"
  );
  const [platform, setPlatform] = useState(post?.platform ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!post?.slug);

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
      content_md: contentMd,
      category,
      difficulty,
      platform,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: post?.images ?? [],
      published,
    };

    const supabase = createClient();

    if (post?.id) {
      const { error: updateError } = await supabase
        .from("cyber_posts")
        .update(payload)
        .eq("id", post.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("cyber_posts")
        .insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/cyber");
    router.refresh();
  }

  async function handleDelete() {
    if (!post?.id || !confirm("Delete this article?")) return;
    const supabase = createClient();
    await supabase.from("cyber_posts").delete().eq("id", post.id);
    router.push("/admin/cyber");
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

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CyberPost["category"])
              }
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as CyberPost["difficulty"])
              }
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            >
              {CYBER_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              platform
            </label>
            <input
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="HackTheBox, TryHackMe..."
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            tags (comma separated)
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="linux, privesc, htb"
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
          />
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            content (markdown)
          </label>
          <MDEditor
            value={contentMd}
            onChange={(v) => setContentMd(v ?? "")}
            height={400}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span className="font-mono text-xs text-[#a0a0a0]">published</span>
        </label>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 disabled:opacity-50"
          >
            {saving ? "saving..." : post ? "update" : "create"}
          </button>
          {post && (
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
