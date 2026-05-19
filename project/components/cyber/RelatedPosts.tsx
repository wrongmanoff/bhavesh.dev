import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CYBER_CATEGORY_CONFIG, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CyberPost } from "@/types";

interface RelatedPostsProps {
  posts: CyberPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[#1e1e1e]">
      <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
        related posts
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {posts.map((post) => {
          const cat = CYBER_CATEGORY_CONFIG[post.category];
          return (
            <Link key={post.id} href={`/cyber/${post.slug}`}>
              <Card hover className="p-4 h-full">
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded border mb-2 inline-block",
                    cat.color
                  )}
                >
                  {cat.label}
                </span>
                <h3 className="text-sm font-medium text-white line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <span className="font-mono text-[10px] text-[#6b6b6b]">
                  {formatDate(post.created_at)}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
