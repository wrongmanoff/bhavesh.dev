import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeInUp } from "@/components/ui/Motion";
import {
  CYBER_CATEGORY_CONFIG,
  DIFFICULTY_CONFIG,
  formatDate,
  truncate,
  estimateReadingTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CyberPost } from "@/types";
import { Clock, Shield } from "lucide-react";

interface CyberCardProps {
  post: CyberPost;
}

export function CyberCard({ post }: CyberCardProps) {
  const category = CYBER_CATEGORY_CONFIG[post.category];
  const difficulty = DIFFICULTY_CONFIG[post.difficulty];
  const readTime = estimateReadingTime(post.content_md);
  const excerpt = truncate(
    post.content_md.replace(/[#*`\[\]]/g, "").trim(),
    140
  );

  return (
    <FadeInUp>
      <Link href={`/cyber/${post.slug}`} className="block h-full">
        <Card hover glow className="p-5 h-full flex flex-col group">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge className={cn("border", category.color)}>{category.label}</Badge>
              {post.platform && (
                <Badge className="border border-[#1e1e1e] text-[#a0a0a0] bg-[#1a1a1a]">
                  {post.platform}
                </Badge>
              )}
              <Badge className={cn("border-0", difficulty.color)}>
                {difficulty.label}
              </Badge>
            </div>
            <Shield
              size={14}
              className="text-[#3a3a3a] group-hover:text-[#00ff88]/50 shrink-0 transition-colors"
            />
          </div>

          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-[#a0a0a0] leading-relaxed flex-1 line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e1e]">
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#6b6b6b]">
              <span>{formatDate(post.created_at)}</span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {readTime} min
              </span>
            </div>
            {post.tags.length > 0 && (
              <span className="font-mono text-[10px] text-[#6b6b6b] truncate max-w-[120px]">
                #{post.tags[0]}
              </span>
            )}
          </div>
        </Card>
      </Link>
    </FadeInUp>
  );
}
