"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Link } from "@/types";
import { Card } from "@/components/ui/Card";

const CATEGORIES = ["social", "hacking", "dev", "contact"] as const;

interface LinkEditorProps {
  link?: Link;
}

export function LinkEditor({ link }: LinkEditorProps) {
  const router = useRouter();
  const [label, setLabel] = useState(link?.label ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [icon, setIcon] = useState(link?.icon ?? "github");
  const [category, setCategory] = useState<Link["category"]>(link?.category ?? "social");
  const [displayOrder, setDisplayOrder] = useState(link?.display_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { label, url, icon, category, display_order: displayOrder };
    const supabase = createClient();

    if (link?.id) {
      const { error: err } = await supabase.from("links").update(payload).eq("id", link.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("links").insert(payload);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/links");
    router.refresh();
  }

  async function handleDelete() {
    if (!link?.id || !confirm("Delete this link?")) return;
    const supabase = createClient();
    await supabase.from("links").delete().eq("id", link.id);
    router.push("/admin/links");
    router.refresh();
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} required className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">icon</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="github, mail, shield..." className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white" />
          </div>
        </div>
        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">url</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Link["category"])} className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">display order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white" />
          </div>
        </div>
        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] disabled:opacity-50">
            {saving ? "saving..." : link ? "update" : "create"}
          </button>
          {link && (
            <button type="button" onClick={handleDelete} className="font-mono text-sm px-4 py-2 rounded border border-red-500/30 text-red-400">
              delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
