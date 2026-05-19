"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/gallery/Lightbox";
import { formatDate } from "@/lib/utils";
import type { GalleryItem } from "@/types";
import Masonry from "react-masonry-css";

interface GalleryGridProps {
  items: GalleryItem[];
}

const breakpointColumnsObj = {
  default: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1,
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
        <p className="font-mono text-sm text-[#6b6b6b]">no images yet</p>
        <p className="text-xs text-[#4a4a4a] mt-2">
          check back soon — or log in to admin to upload
        </p>
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-full"
        columnClassName="pl-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative overflow-hidden rounded-lg bg-[#111111] border border-[#1e1e1e] group-hover:border-[#00ff88]/30 transition-all duration-200">
              <div className="relative aspect-[4/3] sm:aspect-[3/4]">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                {item.caption && (
                  <p className="text-[#a0a0a0] text-xs mt-1 line-clamp-2">{item.caption}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-xs text-[#00ff88] uppercase">
                    {item.category}
                  </span>
                  {item.taken_at && (
                    <span className="text-xs text-[#6b6b6b]">
                      {formatDate(item.taken_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>

      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}
