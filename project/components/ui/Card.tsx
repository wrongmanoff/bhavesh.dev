import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#111111] border border-[#1e1e1e] rounded-lg",
        hover &&
          "transition-all duration-300 hover:border-[#2e2e2e] hover:-translate-y-0.5",
        glow &&
          "hover:border-[#00ff88]/30 hover:shadow-[0_0_24px_rgba(0,255,136,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
}
