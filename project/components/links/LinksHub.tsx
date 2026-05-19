"use client";

import {
  Mail,
  Code2,
  Shield,
  Box,
  Terminal,
  ExternalLink,
  FileText,
} from "lucide-react";
import type { Link as SiteLink } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, typeof Code2> = {
  github: Code2,
  linkedin: Code2,
  mail: Mail,
  email: Mail,
  shield: Shield,
  box: Box,
  tryhackme: Shield,
  hackthebox: Box,
  resume: FileText,
  terminal: Terminal,
};

interface LinksHubProps {
  links: SiteLink[];
  resumeUrl?: string;
}

export function LinksHub({ links, resumeUrl }: LinksHubProps) {
  const allLinks = [...links];
  if (resumeUrl && !allLinks.some((l) => l.icon === "resume")) {
    allLinks.push({
      id: "resume",
      label: "Resume",
      url: resumeUrl,
      icon: "resume",
      category: "contact",
      display_order: 999,
    });
  }

  return (
    <ul className="space-y-3 w-full max-w-md mx-auto">
      {allLinks.map((link) => {
        const Icon = ICON_MAP[link.icon.toLowerCase()] ?? ExternalLink;
        const isResume = link.icon === "resume" || link.label.toLowerCase().includes("resume");

        return (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              download={isResume ? true : undefined}
              className={cn(
                "flex items-center justify-center gap-3 w-full font-mono text-sm py-3.5 px-6 rounded-lg border transition-all duration-200",
                "border-[#1e1e1e] bg-[#111111] text-[#e5e5e5]",
                "hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5 hover:text-[#00ff88] hover:scale-[1.02]"
              )}
            >
              <Icon size={18} />
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
