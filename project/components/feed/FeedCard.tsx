import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { FEED_TYPE_CONFIG, formatDate, truncate } from "@/lib/utils";
import type { LifeFeedPost } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_EMOJI: Record<LifeFeedPost["type"], string> = {
  productive: "🟢",
  wasted: "🔴",
  log: "📝",
  review: "🍜",
  thought: "💭",
};

interface FeedCardProps {
  post: LifeFeedPost;
}

export function FeedCard({ post }: FeedCardProps) {
  const config = FEED_TYPE_CONFIG[post.type];
  const preview =
    post.content.length > 280 ? truncate(post.content, 280) : post.content;

  return (
    <Card hover glow className="p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("border", config.color)}>
            {TYPE_EMOJI[post.type]} {config.label}
          </Badge>
          {post.mood && (
            <span className="text-sm" title="mood">
              {post.mood}
            </span>
          )}
        </div>
        <time
          dateTime={post.created_at}
          className="font-mono text-xs text-[#6b6b6b] shrink-0"
        >
          {formatDate(post.created_at)}
        </time>
      </div>

      {post.title && (
        <h3 className="text-base font-semibold text-white mb-2">{post.title}</h3>
      )}

      <div className="text-sm text-[#c0c0c0] leading-relaxed">
        <MarkdownRenderer content={preview} />
      </div>

      {post.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {post.images.slice(0, 4).map((src) => (
            <div
              key={src}
              className={cn(
                "relative rounded-md overflow-hidden border border-[#1e1e1e] aspect-video",
                post.images.length === 1 && "col-span-2"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
          ))}
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1a1a1a] text-[#6b6b6b] border border-[#1e1e1e]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
