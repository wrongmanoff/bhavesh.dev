"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LifeFeedPost } from "@/types";
import { Card } from "@/components/ui/Card";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const FEED_TYPES = ["log", "review", "thought", "productive", "wasted"] as const;

interface FeedPostEditorProps {
  post?: LifeFeedPost;
}

export function FeedPostEditor({ post }: FeedPostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [type, setType] = useState<LifeFeedPost["type"]>(post?.type ?? "log");
  const [mood, setMood] = useState(post?.mood ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [images, setImages] = useState(post?.images?.join("\n") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      content,
      type,
      mood,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: images
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      published,
    };

    const supabase = createClient();

    if (post?.id) {
      const { error: updateError } = await supabase
        .from("life_feed")
        .update(payload)
        .eq("id", post.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("life_feed")
        .insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/feed");
    router.refresh();
  }

  async function handleDelete() {
    if (!post?.id || !confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("life_feed").delete().eq("id", post.id);
    router.push("/admin/feed");
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
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              type
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as LifeFeedPost["type"])
              }
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            >
              {FEED_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            content (markdown)
          </label>
          <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={320} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              mood (emoji)
            </label>
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="🔥"
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
              tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ctf, linux, win"
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            image URLs (one per line)
          </label>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-[#1e1e1e]"
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
