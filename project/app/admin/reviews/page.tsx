import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewEditor } from "@/components/admin/ReviewEditor";
import { formatDate, REVIEW_CATEGORY_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const editing = (reviews as Review[] | null)?.find((r) => r.id === searchParams.edit);

  if (searchParams.new === "1" || editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">{editing ? "Edit review" : "New review"}</h1>
          <Link href="/admin/reviews" className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88]">← back</Link>
        </div>
        <ReviewEditor review={editing} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Reviews</h1>
        <Link href="/admin/reviews?new=1" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00ff88]/40 text-[#00ff88]">+ new review</Link>
      </div>
      <div className="space-y-2">
        {(reviews as Review[] | null)?.map((r) => {
          const cat = REVIEW_CATEGORY_CONFIG[r.category];
          return (
            <Link key={r.id} href={`/admin/reviews?edit=${r.id}`} className="block p-4 rounded-lg border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e]">
              <div className="flex justify-between gap-4">
                <div>
                  <span className={cn("font-mono text-[10px] px-1.5 py-0.5 rounded border", cat.color)}>{r.category}</span>
                  {!r.published && <span className="ml-2 font-mono text-[10px] text-amber-400">draft</span>}
                  <p className="text-sm text-white mt-1">{r.title}</p>
                </div>
                <span className="font-mono text-xs text-[#6b6b6b]">{formatDate(r.created_at)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
