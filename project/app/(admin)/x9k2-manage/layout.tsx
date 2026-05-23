import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/is-admin";
import { LogoutButton } from "@/components/admin/LogoutButton";

const ADMIN_LINKS = [
  { href: "/x9k2-manage", label: "dashboard" },
  { href: "/x9k2-manage/feed", label: "life feed" },
  { href: "/x9k2-manage/cyber", label: "cyber" },
  { href: "/x9k2-manage/projects", label: "projects" },
  { href: "/x9k2-manage/now", label: "now" },
  { href: "/x9k2-manage/reviews", label: "reviews" },
  { href: "/x9k2-manage/vault", label: "vault" },
  { href: "/x9k2-manage/links", label: "links" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-[#1e1e1e]">
          <div>
            <p className="font-mono text-xs text-[#00ff88] mb-1">admin panel</p>
            <p className="text-xs text-[#6b6b6b] font-mono">{user?.email}</p>
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
