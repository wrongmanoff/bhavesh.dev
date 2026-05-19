"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LearningItem, NowPage } from "@/types";
import { Card } from "@/components/ui/Card";

interface NowPageEditorProps {
  now: NowPage;
}

export function NowPageEditor({ now }: NowPageEditorProps) {
  const router = useRouter();
  const [currentFocus, setCurrentFocus] = useState(now.current_focus);
  const [goals, setGoals] = useState(now.current_goals.join("\n"));
  const [books, setBooks] = useState(now.books.join("\n"));
  const [obsessions, setObsessions] = useState(now.obsessions.join("\n"));
  const [projects, setProjects] = useState(now.current_projects.join("\n"));
  const [roadmapJson, setRoadmapJson] = useState(
    JSON.stringify(now.learning_roadmap, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let learning_roadmap: LearningItem[] = [];
    try {
      learning_roadmap = JSON.parse(roadmapJson) as LearningItem[];
    } catch {
      setError("Invalid learning roadmap JSON");
      setSaving(false);
      return;
    }

    const payload = {
      current_focus: currentFocus,
      current_goals: goals.split("\n").map((s) => s.trim()).filter(Boolean),
      books: books.split("\n").map((s) => s.trim()).filter(Boolean),
      obsessions: obsessions.split("\n").map((s) => s.trim()).filter(Boolean),
      current_projects: projects.split("\n").map((s) => s.trim()).filter(Boolean),
      learning_roadmap: learning_roadmap as unknown as import("@/types/database").Json,
      last_updated: new Date().toISOString(),
    };

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("now_page")
      .update(payload)
      .eq("id", now.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="current focus" value={currentFocus} onChange={setCurrentFocus} rows={3} />
        <Field label="current goals (one per line)" value={goals} onChange={setGoals} rows={4} />
        <Field label="books (one per line)" value={books} onChange={setBooks} rows={3} />
        <Field label="obsessions (one per line)" value={obsessions} onChange={setObsessions} rows={3} />
        <Field label="active projects (one per line)" value={projects} onChange={setProjects} rows={3} />
        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">
            learning roadmap (JSON)
          </label>
          <textarea
            value={roadmapJson}
            onChange={(e) => setRoadmapJson(e.target.value)}
            rows={8}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
          <p className="font-mono text-[10px] text-[#4a4a4a] mt-1">
            [{`{"skill":"...","status":"done|in_progress|queued"}`}, ...]
          </p>
        </div>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 disabled:opacity-50"
        >
          {saving ? "saving..." : "update now page"}
        </button>
      </form>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]/50"
      />
    </div>
  );
}
