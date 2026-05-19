"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { GalleryItem } from "@/types";

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-[#00ff88] transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-auto max-h-[80vh]">
          <Image
            src={item.image_url}
            alt={item.title}
            width={1200}
            height={800}
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-white">{item.title}</h2>
          {item.caption && (
            <p className="text-[#a0a0a0] mt-2 max-w-2xl mx-auto">{item.caption}</p>
          )}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#6b6b6b]">
            <div className="flex items-center gap-2">
              <Tag size={14} />
              <span className="capitalize">{item.category}</span>
            </div>
            {item.taken_at && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(item.taken_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
