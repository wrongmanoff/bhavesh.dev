"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AchievementCard } from "@/components/vault/AchievementCard";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import type { Achievement } from "@/types";

interface VaultGridProps {
  featured: Achievement[];
  rest: Achievement[];
}

export function VaultGrid({ featured, rest }: VaultGridProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      {featured.length > 0 && (
        <section className="mb-10">
          <FadeInUp>
            <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
              featured
            </h2>
          </FadeInUp>
          <StaggerContainer className="grid sm:grid-cols-2 gap-4">
            {featured.map((a) => (
              <StaggerItem key={a.id}>
                <AchievementCard
                  achievement={a}
                  featured
                  onImageClick={setLightbox}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {rest.length > 0 && (
        <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {rest.map((a) => (
            <StaggerItem key={a.id} className="break-inside-avoid">
              <AchievementCard achievement={a} onImageClick={setLightbox} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

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
            className="relative w-full max-w-3xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={lightbox} alt="" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}
