"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import type { HeatmapDay } from "@/lib/feed/constants";
import { cn } from "@/lib/utils";

const LEVEL_COLORS = [
  "bg-[#161616]",
  "bg-[#00ff88]/20",
  "bg-[#00ff88]/40",
  "bg-[#00ff88]/65",
  "bg-[#00ff88]",
];

interface ActivityHeatmapProps {
  days: HeatmapDay[];
}

export function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    count: number;
  } | null>(null);

  const weeks = useMemo(() => {
    const result: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const totalPosts = days.reduce((sum, d) => sum + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="font-mono text-xs text-[#00ff88] uppercase tracking-widest">
            activity
          </h2>
          <p className="text-sm text-[#a0a0a0] mt-0.5">
            {totalPosts} posts · {activeDays} active days (last year)
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#6b6b6b]">
          <span>less</span>
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-sm", color)} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-1">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  className={cn(
                    "w-[11px] h-[11px] sm:w-3 sm:h-3 rounded-sm transition-all hover:ring-1 hover:ring-[#00ff88]/50",
                    LEVEL_COLORS[day.level]
                  )}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      date: day.date,
                      count: day.count,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  aria-label={`${day.date}: ${day.count} posts`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded bg-[#1a1a1a] border border-[#2e2e2e] text-xs font-mono text-white shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {format(parseISO(tooltip.date), "MMM d, yyyy")} — {tooltip.count}{" "}
          {tooltip.count === 1 ? "post" : "posts"}
        </div>
      )}
    </div>
  );
}