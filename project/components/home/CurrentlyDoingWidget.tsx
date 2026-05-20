import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { FadeInUp } from "@/components/ui/Motion";
import { formatDate } from "@/lib/utils";
import type { NowPage } from "@/types";
import { Zap } from "lucide-react";

interface CurrentlyDoingWidgetProps {
  now: NowPage | null;
}

export function CurrentlyDoingWidget({ now }: CurrentlyDoingWidgetProps) {
  if (!now?.current_focus) {
    return null;
  }

  return (
    <FadeInUp delay={0.08}>
      <Card className="p-5 border-[#00ff88]/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-[#00ff88]" />
          <span className="font-mono text-xs text-[#00ff88] uppercase tracking-widest">
            currently doing
          </span>
        </div>
        <p className="text-sm text-[#e5e5e5] leading-relaxed">{now.current_focus}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href="/now"
            className="font-mono text-xs text-[#00ff88] hover:underline"
          >
            view /now →
          </Link>
          <span className="font-mono text-[10px] text-[#6b6b6b] text-right">
            updated {formatDate(now.last_updated)}
          </span>
        </div>
      </Card>
    </FadeInUp>
  );
}
