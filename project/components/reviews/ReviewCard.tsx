import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/reviews/StarRating";
import { REVIEW_CATEGORY_CONFIG, formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const category = REVIEW_CATEGORY_CONFIG[review.category];
  const image = review.images[0];

  return (
    <Link href={`/reviews/${review.id}`}>
      <Card hover glow className="overflow-hidden h-full flex flex-col group">
        {image && (
          <div className="relative aspect-[16/10] border-b border-[#1e1e1e]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform"
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge className={cn("border", category.color)}>{category.label}</Badge>
            <StarRating rating={review.rating} size={12} />
          </div>
          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors line-clamp-2">
            {review.title}
          </h3>
          <p className="text-sm text-[#a0a0a0] line-clamp-2 flex-1">
            {truncate(review.content.replace(/[#*`\[\]]/g, ""), 100)}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e1e] text-[10px] font-mono text-[#6b6b6b]">
            <span>{formatDate(review.created_at)}</span>
            {review.location && <span className="truncate max-w-[50%]">{review.location}</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
