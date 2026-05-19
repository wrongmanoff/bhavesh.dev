import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface ProjectSectionProps {
  label: string;
  content: string;
}

export function ProjectSection({ label, content }: ProjectSectionProps) {
  if (!content?.trim()) return null;

  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-4">
        {label}
      </h2>
      <MarkdownRenderer content={content} />
    </section>
  );
}
