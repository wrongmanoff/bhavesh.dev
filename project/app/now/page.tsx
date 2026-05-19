import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { LearningRoadmap } from "@/components/now/LearningRoadmap";
import { getNowPage } from "@/lib/data/now";
import { formatDate } from "@/lib/utils";
import { BookOpen, Target, Sparkles, FolderKanban, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm focused on right now — goals, books, obsessions, and learning roadmap.",
};

export default async function NowPage() {
  const now = await getNowPage();

  if (!now) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24 text-center">
        <p className="font-mono text-sm text-[#6b6b6b]">now page not configured yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/now"
        title="What I'm doing now"
        description="A snapshot of my current focus — updated periodically, inspired by the /now page movement."
      />

      <p className="font-mono text-xs text-[#6b6b6b] mb-8">
        Last updated: {formatDate(now.last_updated)} ·{" "}
        <Link
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff88] hover:underline"
        >
          What is a /now page?
        </Link>
      </p>

      <Card className="p-6 mb-6 border-[#00ff88]/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-[#00ff88]" />
          <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest">
            currently focusing on
          </h2>
        </div>
        <p className="text-[#e5e5e5] leading-relaxed">{now.current_focus}</p>
      </Card>

      {now.current_goals.length > 0 && (
        <Section icon={Target} title="current goals">
          <ul className="space-y-2">
            {now.current_goals.map((goal) => (
              <li
                key={goal}
                className="flex items-start gap-2 text-sm text-[#c0c0c0]"
              >
                <span className="text-[#00ff88] font-mono mt-0.5">›</span>
                {goal}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {now.books.length > 0 && (
        <Section icon={BookOpen} title="reading">
          <ul className="space-y-2">
            {now.books.map((book) => (
              <li key={book} className="text-sm text-[#c0c0c0]">
                {book}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {now.obsessions.length > 0 && (
        <Section icon={Sparkles} title="obsessions">
          <div className="flex flex-wrap gap-2">
            {now.obsessions.map((item) => (
              <span
                key={item}
                className="font-mono text-xs px-2.5 py-1 rounded bg-[#1a1a1a] text-[#a0a0a0] border border-[#1e1e1e]"
              >
                {item}
              </span>
            ))}
          </div>
        </Section>
      )}

      {now.current_projects.length > 0 && (
        <Section icon={FolderKanban} title="active projects">
          <ul className="space-y-2">
            {now.current_projects.map((p) => (
              <li key={p} className="text-sm text-[#c0c0c0]">
                {p}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {now.learning_roadmap.length > 0 && (
        <Section icon={Target} title="learning roadmap">
          <LearningRoadmap items={now.learning_roadmap} />
        </Section>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className="text-[#6b6b6b]" />
        <h2 className="font-mono text-xs text-[#6b6b6b] uppercase tracking-widest">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
