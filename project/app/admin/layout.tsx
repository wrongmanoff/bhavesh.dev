import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/LogoutButton";

const ADMIN_LINKS = [
  { href: "/admin", label: "dashboard" },
  { href: "/admin/feed", label: "life feed" },
  { href: "/admin/cyber", label: "cyber" },
  { href: "/admin/projects", label: "projects" },
  { href: "/admin/now", label: "now" },
  { href: "/admin/reviews", label: "reviews" },
  { href: "/admin/vault", label: "vault" },
  { href: "/admin/links", label: "links" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-[#1e1e1e]">
          <div>
            <p className="font-mono text-xs text-[#00ff88] mb-1">admin panel</p>
            <p className="text-xs text-[#6b6b6b] font-mono">{user.email}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs px-3 py-1.5 rounded border border-[#1e1e1e] text-[#a0a0a0] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
