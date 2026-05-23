"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFeedPost, deleteFeedPost, updateFeedPost } from "@/app/x9k2-manage/actions/feed";
import { FieldError } from "@/components/admin/FieldError";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const payload = {
        title,
        content,
        type,
        mood,
        tags,
        images,
        published,
      };

      const result = post?.id
        ? await updateFeedPost(post.id, payload)
        : await createFeedPost(payload);

      if (!result.ok) {
        setError(result.error ?? "Unable to save post.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push("/x9k2-manage/feed");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!post?.id || !confirm("Delete this post?")) return;
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await deleteFeedPost(post.id);
      if (!result.ok) {
        setError(result.error ?? "Unable to delete post.");
        return;
      }
      router.push("/x9k2-manage/feed");
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
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
            <FieldError error={fieldErrors.title} />
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
            <FieldError error={fieldErrors.type} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            content (markdown)
          </label>
          <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={320} />
          <FieldError error={fieldErrors.content} />
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
            <FieldError error={fieldErrors.mood} />
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
            <FieldError error={fieldErrors.tags} />
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
          <FieldError error={fieldErrors.images} />
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
            disabled={isPending}
            className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 disabled:opacity-50"
          >
            {isPending ? "saving..." : post ? "update" : "create"}
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
