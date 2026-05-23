import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/x9k2-manage/login");
  }

  const [feed, cyber, projects, reviews, achievements, links, gallery] = await Promise.all([
    supabase.from("life_feed").select("id", { count: "exact", head: true }),
    supabase.from("cyber_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("links").select("id", { count: "exact", head: true }),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Life Feed", count: feed.count ?? 0, href: "/x9k2-manage/feed" },
    { label: "Cyber", count: cyber.count ?? 0, href: "/x9k2-manage/cyber" },
    { label: "Projects", count: projects.count ?? 0, href: "/x9k2-manage/projects" },
    { label: "Reviews", count: reviews.count ?? 0, href: "/x9k2-manage/reviews" },
    { label: "Achievements", count: achievements.count ?? 0, href: "/x9k2-manage/vault" },
    { label: "Gallery", count: gallery.count ?? 0, href: "/x9k2-manage/gallery" },
    { label: "Links", count: links.count ?? 0, href: "/x9k2-manage/links" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-sm text-[#a0a0a0] mb-4">
        Manage content for Bhavesh OS.
      </p>
      <Link
        href="/x9k2-manage/now"
        className="inline-block font-mono text-xs text-[#00ff88] hover:underline mb-8"
      >
        edit /now page →
      </Link>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="p-5">
              <p className="font-mono text-xs text-[#6b6b6b] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#00ff88]">{stat.count}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
