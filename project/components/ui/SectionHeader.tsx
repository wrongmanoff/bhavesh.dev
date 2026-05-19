import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {label && (
        <p className="font-mono text-xs text-[#00ff88] uppercase tracking-widest mb-2">
          {label}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      {description && (
        <p className="mt-2 text-[#a0a0a0] text-sm leading-relaxed max-w-2xl">{description}</p>
      )}
    </div>
  );
}
