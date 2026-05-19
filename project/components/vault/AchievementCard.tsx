"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ACHIEVEMENT_TYPE_CONFIG, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";
import { ExternalLink, Award } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
  featured?: boolean;
  onImageClick?: (url: string) => void;
}

export function AchievementCard({
  achievement,
  featured = false,
  onImageClick,
}: AchievementCardProps) {
  const typeConfig = ACHIEVEMENT_TYPE_CONFIG[achievement.type];

  return (
    <Card
      className={cn(
        "overflow-hidden h-full flex flex-col",
        featured && "sm:col-span-2 border-[#00ff88]/20"
      )}
      glow={featured}
    >
      {achievement.image_url ? (
        <button
          type="button"
          onClick={() => onImageClick?.(achievement.image_url)}
          className={cn(
            "relative w-full border-b border-[#1e1e1e] bg-[#0d0d0d]",
            featured ? "aspect-[2/1]" : "aspect-video"
          )}
        >
          <Image
            src={achievement.image_url}
            alt={achievement.title}
            fill
            className="object-contain p-2 hover:opacity-90 transition-opacity"
            sizes={featured ? "600px" : "300px"}
          />
        </button>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center border-b border-[#1e1e1e] bg-[#0d0d0d]",
            featured ? "aspect-[2/1]" : "aspect-video"
          )}
        >
          <Award size={featured ? 48 : 32} className="text-[#2e2e2e]" />
        </div>
      )}

      <div className={cn("p-4 flex flex-col flex-1", featured && "p-6")}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={cn("border", typeConfig.color)}>{typeConfig.label}</Badge>
          {achievement.featured && (
            <span className="font-mono text-[10px] text-[#00ff88]">featured</span>
          )}
        </div>
        <h3
          className={cn(
            "font-semibold text-white mb-1",
            featured ? "text-lg" : "text-sm"
          )}
        >
          {achievement.title}
        </h3>
        {achievement.issuer && (
          <p className="text-xs text-[#6b6b6b] font-mono mb-2">{achievement.issuer}</p>
        )}
        {achievement.description && (
          <p className="text-sm text-[#a0a0a0] line-clamp-2 flex-1">
            {achievement.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1e1e]">
          {achievement.date && (
            <span className="font-mono text-[10px] text-[#6b6b6b]">
              {formatDate(achievement.date)}
            </span>
          )}
          {achievement.credential_url && (
            <a
              href={achievement.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-[#00ff88] hover:underline"
            >
              verify <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
