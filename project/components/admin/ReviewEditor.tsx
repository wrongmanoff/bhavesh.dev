"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/types";
import { Card } from "@/components/ui/Card";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CATEGORIES = ["food", "cafe", "product", "place", "movie", "book"] as const;

interface ReviewEditorProps {
  review?: Review;
}

export function ReviewEditor({ review }: ReviewEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(review?.title ?? "");
  const [content, setContent] = useState(review?.content ?? "");
  const [category, setCategory] = useState<Review["category"]>(review?.category ?? "food");
  const [rating, setRating] = useState(review?.rating ?? 4);
  const [location, setLocation] = useState(review?.location ?? "");
  const [priceRange, setPriceRange] = useState(review?.price_range ?? "");
  const [images, setImages] = useState(review?.images?.join("\n") ?? "");
  const [published, setPublished] = useState(review?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      content,
      category,
      rating,
      location,
      price_range: priceRange,
      images: images.split("\n").map((u) => u.trim()).filter(Boolean),
      published,
    };

    const supabase = createClient();

    if (review?.id) {
      const { error: err } = await supabase.from("reviews").update(payload).eq("id", review.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("reviews").insert(payload);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/reviews");
    router.refresh();
  }

  async function handleDelete() {
    if (!review?.id || !confirm("Delete this review?")) return;
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", review.id);
    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5" data-color-mode="dark">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Review["category"])}
                className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">price range</label>
            <input
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="$, $$, $$$"
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">image urls</label>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={2}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white"
          />
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">content</label>
          <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={280} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span className="font-mono text-xs text-[#a0a0a0]">published</span>
        </label>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] disabled:opacity-50">
            {saving ? "saving..." : review ? "update" : "create"}
          </button>
          {review && (
            <button type="button" onClick={handleDelete} className="font-mono text-sm px-4 py-2 rounded border border-red-500/30 text-red-400">
              delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
