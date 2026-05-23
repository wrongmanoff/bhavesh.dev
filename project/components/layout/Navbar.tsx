"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_LINKS = [
  { href: "/feed", label: "feed" },
  { href: "/cyber", label: "cyber" },
  { href: "/projects", label: "projects" },
  { href: "/now", label: "now" },
  { href: "/reviews", label: "reviews" },
  { href: "/vault", label: "vault" },
  { href: "/gallery", label: "gallery" },
  { href: "/terminal", label: "terminal" },
  { href: "/links", label: "links" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1e1e1e]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <Terminal
            size={16}
            className="text-[#00ff88] group-hover:animate-pulse"
          />
          <span className="font-mono text-sm font-semibold text-white">
            bhavesh<span className="text-[#00ff88]">.dev</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-xs px-3 py-1.5 rounded transition-all duration-200",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-[#00ff88] bg-[#00ff88]/10"
                  : "text-[#a0a0a0] hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className="md:hidden text-[#a0a0a0] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-[#1e1e1e] px-4 py-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-sm px-3 py-2 rounded transition-all",
                  pathname === link.href
                    ? "text-[#00ff88] bg-[#00ff88]/10"
                    : "text-[#a0a0a0] hover:text-white hover:bg-white/5"
                )}
              >
                ~/{link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
