"use client";

import { useEffect, useState } from "react";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { ChevronDown } from "lucide-react";

const ROLES = [
  "Cybersecurity Student",
  "Builder",
  "Linux Enthusiast",
  "Documenting the Journey",
];

export function HeroSection() {
  const [nameText, setNameText] = useState("");
  const fullName = "Bhavesh Katragadda";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setNameText(fullName.slice(0, i));
      if (i >= fullName.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [fullName]);

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 scanlines overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
        <p className="font-mono text-xs text-[#00ff88] mb-4 tracking-widest uppercase">
          bhavesh@os ~ init
        </p>

        <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          {nameText}
          <span className="inline-block w-0.5 h-[0.9em] bg-[#00ff88] ml-1 animate-[blink_1s_step-end_infinite] align-middle" />
        </h1>

        <p className="text-[#a0a0a0] text-sm sm:text-base mb-2">
          Cybersecurity Student • Builder • Linux Enthusiast
        </p>

        <p className="font-mono text-sm sm:text-base text-[#6b6b6b] h-6">
          <TypewriterText phrases={ROLES} className="text-[#00ff88]" />
        </p>
      </div>

      <a
        href="#explore"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6b6b6b] hover:text-[#00ff88] transition-colors animate-bounce"
        aria-label="Scroll to explore"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
