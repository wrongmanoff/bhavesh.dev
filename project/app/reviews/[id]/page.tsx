import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/reviews/StarRating";
import { getReviewById } from "@/lib/data/reviews";
import { REVIEW_CATEGORY_CONFIG, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";

interface ReviewPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const review = await getReviewById(params.id);
  if (!review) return { title: "Not Found" };
  return {
    title: review.title,
    description: review.content.slice(0, 160),
  };
}

export default async function ReviewDetailPage({ params }: ReviewPageProps) {
  const review = await getReviewById(params.id);
  if (!review) notFound();

  const category = REVIEW_CATEGORY_CONFIG[review.category];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Link
        href="/reviews"
        className="inline-flex items-center gap-2 font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88] mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        back to reviews
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className={cn("border", category.color)}>{category.label}</Badge>
          <StarRating rating={review.rating} size={18} />
          <time className="font-mono text-xs text-[#6b6b6b]">
            {formatDate(review.created_at)}
          </time>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {review.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-[#a0a0a0]">
          {review.location && (
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <MapPin size={12} className="text-[#00ff88]" />
              {review.location}
            </span>
          )}
          {review.price_range && (
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <DollarSign size={12} className="text-[#00ff88]" />
              {review.price_range}
            </span>
          )}
        </div>
      </header>

      {review.images.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {review.images.map((src, i) => (
            <div
              key={src}
              className={cn(
                "relative aspect-video rounded-lg overflow-hidden border border-[#1e1e1e]",
                review.images.length === 1 && "sm:col-span-2"
              )}
            >
              <Image
                src={src}
                alt={`${review.title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          ))}
        </div>
      )}

      <MarkdownRenderer content={review.content} />
    </article>
  );
}
