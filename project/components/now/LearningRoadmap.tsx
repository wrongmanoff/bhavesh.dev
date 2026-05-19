import type { LearningItem } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  done: {
    label: "done",
    bar: "bg-[#00ff88]",
    text: "text-[#00ff88]",
    dot: "bg-[#00ff88]",
  },
  in_progress: {
    label: "in progress",
    bar: "bg-amber-400",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
  },
  queued: {
    label: "queued",
    bar: "bg-[#2e2e2e]",
    text: "text-[#6b6b6b]",
    dot: "bg-[#3a3a3a]",
  },
} as const;

interface LearningRoadmapProps {
  items: LearningItem[];
}

export function LearningRoadmap({ items }: LearningRoadmapProps) {
  if (items.length === 0) return null;

  const grouped = {
    in_progress: items.filter((i) => i.status === "in_progress"),
    queued: items.filter((i) => i.status === "queued"),
    done: items.filter((i) => i.status === "done"),
  };

  return (
    <div className="space-y-6">
      {(["in_progress", "queued", "done"] as const).map((status) => {
        const list = grouped[status];
        if (list.length === 0) return null;
        const style = STATUS_STYLE[status];
        return (
          <div key={status}>
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest mb-3",
                style.text
              )}
            >
              {style.label}
            </p>
            <ul className="space-y-3">
              {list.map((item) => (
                <li key={item.skill} className="flex items-center gap-3">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e5e5e5]">{item.skill}</p>
                    <div className="mt-1.5 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          style.bar,
                          status === "done" && "w-full",
                          status === "in_progress" && "w-2/3",
                          status === "queued" && "w-1/4"
                        )}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
