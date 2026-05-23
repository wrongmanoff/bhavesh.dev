"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGalleryItem } from "@/app/x9k2-manage/actions/gallery";
import { FieldError } from "@/components/admin/FieldError";
import { Card } from "@/components/ui/Card";

type GalleryCategory = "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";

export function GalleryForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    category: "screenshot" as GalleryCategory,
    taken_at: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await createGalleryItem({
        title: formData.title,
        caption: formData.caption,
        category: formData.category,
        takenAt: formData.taken_at,
        imageUrl: formData.image_url,
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to create gallery item.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push("/x9k2-manage/gallery");
      router.refresh();
    });
  };

  return (
    <Card className="p-6 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs text-[#6b6b6b] mb-2">
            title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded px-3 py-2 text-white text-sm focus:border-[#00ff88]/50 focus:outline-none"
            required
          />
          <FieldError error={fieldErrors.title} />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#6b6b6b] mb-2">
            caption
          </label>
          <textarea
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded px-3 py-2 text-white text-sm focus:border-[#00ff88]/50 focus:outline-none resize-none"
            rows={3}
          />
          <FieldError error={fieldErrors.caption} />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#6b6b6b] mb-2">
            category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as GalleryCategory,
              })
            }
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded px-3 py-2 text-white text-sm focus:border-[#00ff88]/50 focus:outline-none"
            required
          >
            <option value="screenshot">Screenshot</option>
            <option value="setup">Setup</option>
            <option value="travel">Travel</option>
            <option value="cert">Certificate</option>
            <option value="coding">Coding</option>
            <option value="event">Event</option>
          </select>
          <FieldError error={fieldErrors.category} />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#6b6b6b] mb-2">
            date taken
          </label>
          <input
            type="date"
            value={formData.taken_at}
            onChange={(e) => setFormData({ ...formData, taken_at: e.target.value })}
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded px-3 py-2 text-white text-sm focus:border-[#00ff88]/50 focus:outline-none"
          />
          <FieldError error={fieldErrors.takenAt} />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#6b6b6b] mb-2">
            image url *
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded px-3 py-2 text-white text-sm focus:border-[#00ff88]/50 focus:outline-none"
            placeholder="https://..."
            required
          />
          <FieldError error={fieldErrors.imageUrl} />
          <p className="text-xs text-[#4a4a4a] mt-1">
            Upload to Supabase Storage and paste the public URL here
          </p>
        </div>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 font-mono text-xs px-4 py-2 rounded bg-[#00ff88] text-black hover:bg-[#00cc6a] transition-colors disabled:opacity-50"
          >
            {isPending ? "saving..." : "save"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 font-mono text-xs px-4 py-2 rounded border border-[#1e1e1e] text-[#a0a0a0] hover:border-[#2e2e2e] hover:text-white transition-colors"
          >
            cancel
          </button>
        </div>
      </form>
    </Card>
  );
}
