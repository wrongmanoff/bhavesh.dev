import type { Metadata } from "next";
import { LinksHub } from "@/components/links/LinksHub";
import { getLinks } from "@/lib/data/links";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Links",
  description: "Connect with Bhavesh — GitHub, LinkedIn, TryHackMe, HackTheBox, email, and resume.",
};

const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL ?? "";

export default async function LinksPage() {
  const links = await getLinks();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-24">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#111111] border border-[#1e1e1e] flex items-center justify-center">
          <Terminal size={32} className="text-[#00ff88]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Bhavesh Katragadda</h1>
        <p className="font-mono text-sm text-[#6b6b6b]">
          Cybersecurity student · builder · Linux enthusiast
        </p>
      </div>

      <LinksHub links={links} resumeUrl={RESUME_URL || undefined} />

      <p className="font-mono text-[10px] text-[#4a4a4a] mt-12">
        bhavesh.dev · links hub
      </p>
    </div>
  );
}
