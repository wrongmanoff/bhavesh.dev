import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge border",
        variant === "outline"
          ? "bg-transparent border-current"
          : "border-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
