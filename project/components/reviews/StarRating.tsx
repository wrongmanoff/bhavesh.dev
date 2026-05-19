import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = 14,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-[#3a3a3a]"
          )}
        />
      ))}
    </div>
  );
}
