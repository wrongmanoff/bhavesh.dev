"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface ScreenshotGalleryProps {
  screenshots: string[];
  title: string;
}

export function ScreenshotGallery({ screenshots, title }: ScreenshotGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (screenshots.length === 0) return null;

  return (
    <>
      <section className="mb-10">
        <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
          screenshots
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {screenshots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightbox(src)}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#1e1e1e] hover:border-[#00ff88]/30 transition-colors group"
            >
              <Image
                src={src}
                alt={`${title} screenshot ${i + 1}`}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white hover:text-[#00ff88] p-2"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
