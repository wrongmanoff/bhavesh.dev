"use client";

import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/markdown/toc";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <p className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-3">
        on this page
      </p>
      <ul className="space-y-2 border-l border-[#1e1e1e] pl-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block text-xs text-[#a0a0a0] hover:text-[#00ff88] transition-colors leading-snug",
                h.level === 3 && "pl-3"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
