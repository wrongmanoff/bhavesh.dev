"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAchievement, deleteAchievement, updateAchievement } from "@/app/x9k2-manage/actions/achievements";
import { FieldError } from "@/components/admin/FieldError";
import type { Achievement } from "@/types";
import { Card } from "@/components/ui/Card";

const TYPES = [
  "cert",
  "internship",
  "hackathon",
  "club",
  "ranking",
  "badge",
  "streak",
] as const;

interface AchievementEditorProps {
  achievement?: Achievement;
}

export function AchievementEditor({ achievement }: AchievementEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(achievement?.title ?? "");
  const [type, setType] = useState<Achievement["type"]>(achievement?.type ?? "cert");
  const [issuer, setIssuer] = useState(achievement?.issuer ?? "");
  const [date, setDate] = useState(achievement?.date?.slice(0, 10) ?? "");
  const [description, setDescription] = useState(achievement?.description ?? "");
  const [imageUrl, setImageUrl] = useState(achievement?.image_url ?? "");
  const [credentialUrl, setCredentialUrl] = useState(achievement?.credential_url ?? "");
  const [featured, setFeatured] = useState(achievement?.featured ?? false);
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
        type,
        issuer,
        date,
        description,
        imageUrl,
        credentialUrl,
        featured,
      };

      const result = achievement?.id
        ? await updateAchievement(achievement.id, payload)
        : await createAchievement(payload);

      if (!result.ok) {
        setError(result.error ?? "Unable to save achievement.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push("/x9k2-manage/vault");
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!achievement?.id || !confirm("Delete this achievement?")) return;

    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await deleteAchievement(achievement.id);
      if (!result.ok) {
        setError(result.error ?? "Unable to delete achievement.");
        return;
      }

      router.push("/x9k2-manage/vault");
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            />
            <FieldError error={fieldErrors.title} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Achievement["type"])}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            >
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FieldError error={fieldErrors.type} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">issuer</label>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            />
            <FieldError error={fieldErrors.issuer} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
            />
            <FieldError error={fieldErrors.date} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm text-white"
          />
          <FieldError error={fieldErrors.description} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">image url</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white"
            />
            <FieldError error={fieldErrors.imageUrl} />
          </div>
          <div>
            <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">credential url</label>
            <input
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white"
            />
            <FieldError error={fieldErrors.credentialUrl} />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className="font-mono text-xs text-[#a0a0a0]">featured</span>
        </label>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono text-sm px-4 py-2 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] disabled:opacity-50"
          >
            {isPending ? "saving..." : achievement ? "update" : "create"}
          </button>
          {achievement && (
            <button
              type="button"
              onClick={handleDelete}
              className="font-mono text-sm px-4 py-2 rounded border border-red-500/30 text-red-400"
            >
              delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
