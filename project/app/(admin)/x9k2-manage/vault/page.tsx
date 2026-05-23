import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementEditor } from "@/components/admin/AchievementEditor";
import { formatDate, ACHIEVEMENT_TYPE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";

export default async function AdminVaultPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/x9k2-manage/login");

  const { data: items } = await supabase
    .from("achievements")
    .select("*")
    .order("featured", { ascending: false })
    .order("date", { ascending: false });

  const editing = (items as Achievement[] | null)?.find((a) => a.id === searchParams.edit);

  if (searchParams.new === "1" || editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">{editing ? "Edit achievement" : "New achievement"}</h1>
          <Link href="/x9k2-manage/vault" className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88]">← back</Link>
        </div>
        <AchievementEditor achievement={editing} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Achievements</h1>
        <Link href="/x9k2-manage/vault?new=1" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00ff88]/40 text-[#00ff88]">+ new</Link>
      </div>
      <div className="space-y-2">
        {(items as Achievement[] | null)?.map((a) => {
          const cfg = ACHIEVEMENT_TYPE_CONFIG[a.type];
          return (
            <Link key={a.id} href={`/x9k2-manage/vault?edit=${a.id}`} className="block p-4 rounded-lg border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e]">
              <div className="flex justify-between gap-4">
                <div>
                  <span className={cn("font-mono text-[10px] px-1.5 py-0.5 rounded border", cfg.color)}>{a.type}</span>
                  {a.featured && <span className="ml-2 font-mono text-[10px] text-[#00ff88]">featured</span>}
                  <p className="text-sm text-white mt-1">{a.title}</p>
                </div>
                <span className="font-mono text-xs text-[#6b6b6b]">{a.date ? formatDate(a.date) : "—"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
