import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-mono">
      <p className="text-[#00ff88] text-sm mb-4">visitor@bhavesh:~$</p>
      <pre className="text-sm sm:text-base text-[#e5e5e5] mb-2">
        <span className="text-red-400">bash:</span> page not found: command not found
      </pre>
      <p className="text-[#6b6b6b] text-xs mb-8">
        exit code: 127 — the path you requested does not exist on this system
      </p>
      <Link
        href="/"
        className="text-sm text-[#00ff88] border border-[#00ff88]/30 px-4 py-2 rounded hover:bg-[#00ff88]/10 transition-colors"
      >
        cd ~
      </Link>
    </div>
  );
}
