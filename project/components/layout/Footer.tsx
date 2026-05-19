import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#1e1e1e] mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#00ff88]" />
          <span className="font-mono text-xs text-[#6b6b6b]">
            bhavesh.dev © {year}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/feed.xml"
            className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88] transition-colors"
          >
            rss
          </Link>
          <Link
            href="/sitemap.xml"
            className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88] transition-colors"
          >
            sitemap
          </Link>
          <span className="font-mono text-xs text-[#3a3a3a]">
            built in public
          </span>
        </div>
      </div>
    </footer>
  );
}
