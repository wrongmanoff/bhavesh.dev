import Link from "next/link";
import {
  Activity,
  Shield,
  FolderKanban,
  Clock,
  Star,
  Images,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const SECTIONS = [
  {
    href: "/feed",
    label: "Life Feed",
    desc: "Journal, wins, thoughts",
    icon: Activity,
  },
  {
    href: "/cyber",
    label: "Cyber",
    desc: "CTFs, writeups, labs",
    icon: Shield,
  },
  {
    href: "/projects",
    label: "Projects",
    desc: "Things I've built",
    icon: FolderKanban,
  },
  {
    href: "/now",
    label: "Now",
    desc: "Current focus",
    icon: Clock,
  },
  {
    href: "/reviews",
    label: "Reviews",
    desc: "Food, books, places",
    icon: Star,
  },
  {
    href: "/gallery",
    label: "Gallery",
    desc: "Visual memory vault",
    icon: Images,
  },
];

export function QuickAccessGrid() {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SECTIONS.map((section) => (
        <StaggerItem key={section.href}>
          <Link href={section.href} className="block h-full">
            <Card hover glow className="p-5 h-full group">
              <section.icon
                size={20}
                className="text-[#00ff88] mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-mono text-sm font-semibold text-white mb-1">
                {section.label}
              </h3>
              <p className="text-xs text-[#6b6b6b]">{section.desc}</p>
            </Card>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
