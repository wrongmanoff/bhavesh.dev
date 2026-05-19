import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FeedPostEditor } from "@/components/admin/FeedPostEditor";
import { formatDate, FEED_TYPE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LifeFeedPost } from "@/types";

interface AdminFeedPageProps {
  searchParams: { new?: string; edit?: string };
}

export default async function AdminFeedPage({ searchParams }: AdminFeedPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: posts } = await supabase
    .from("life_feed")
    .select("*")
    .order("created_at", { ascending: false });

  const editingId = searchParams.edit;
  const isNew = searchParams.new === "1";
  const editingPost = editingId
    ? (posts as LifeFeedPost[] | null)?.find((p) => p.id === editingId)
    : undefined;

  if (isNew || editingPost) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">
            {editingPost ? "Edit post" : "New post"}
          </h1>
          <Link
            href="/admin/feed"
            className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88]"
          >
            ← back
          </Link>
        </div>
        <FeedPostEditor post={editingPost} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Life Feed</h1>
        <Link
          href="/admin/feed?new=1"
          className="font-mono text-xs px-3 py-1.5 rounded border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/10"
        >
          + new post
        </Link>
      </div>

      <div className="space-y-2">
        {(posts as LifeFeedPost[] | null)?.map((post) => {
          const config = FEED_TYPE_CONFIG[post.type];
          return (
            <Link
              key={post.id}
              href={`/admin/feed?edit=${post.id}`}
              className="block p-4 rounded-lg border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded border",
                        config.color
                      )}
                    >
                      {post.type}
                    </span>
                    {!post.published && (
                      <span className="font-mono text-[10px] text-amber-400">
                        draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white truncate">
                    {post.title || post.content.slice(0, 60)}
                  </p>
                </div>
                <span className="font-mono text-xs text-[#6b6b6b] shrink-0">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </Link>
          );
        })}
        {!posts?.length && (
          <p className="text-sm text-[#6b6b6b] font-mono text-center py-8">
            no posts yet — create your first one
          </p>
        )}
      </div>
    </div>
  );
}
