"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";

type GalleryCategory = "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";

export function GalleryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    category: "screenshot" as GalleryCategory,
    taken_at: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").insert({
        title: formData.title,
        caption: formData.caption,
        category: formData.category,
        taken_at: formData.taken_at || null,
        image_url: formData.image_url,
      });

      if (error) throw error;
      router.push("/admin/gallery");
    } catch (error) {
      console.error("Error creating gallery item:", error);
      alert("Failed to create gallery item");
    } finally {
      setLoading(false);
    }
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
          <p className="text-xs text-[#4a4a4a] mt-1">
            Upload to Supabase Storage and paste the public URL here
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 font-mono text-xs px-4 py-2 rounded bg-[#00ff88] text-black hover:bg-[#00cc6a] transition-colors disabled:opacity-50"
          >
            {loading ? "saving..." : "save"}
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
