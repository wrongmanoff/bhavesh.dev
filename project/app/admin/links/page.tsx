import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LinkEditor } from "@/components/admin/LinkEditor";
import type { Link as SiteLink } from "@/types";

export default async function AdminLinksPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .order("display_order", { ascending: true });

  const editing = (links as SiteLink[] | null)?.find((l) => l.id === searchParams.edit);

  if (searchParams.new === "1" || editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">{editing ? "Edit link" : "New link"}</h1>
          <Link href="/admin/links" className="font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88]">← back</Link>
        </div>
        <LinkEditor link={editing} />
        <p className="font-mono text-[10px] text-[#4a4a4a] mt-6">
          Resume PDF: set NEXT_PUBLIC_RESUME_URL in .env to your Supabase Storage public URL.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Links</h1>
        <Link href="/admin/links?new=1" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00ff88]/40 text-[#00ff88]">+ new link</Link>
      </div>
      <div className="space-y-2">
        {(links as SiteLink[] | null)?.map((l) => (
          <Link key={l.id} href={`/admin/links?edit=${l.id}`} className="block p-4 rounded-lg border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e]">
            <p className="text-sm text-white">{l.label}</p>
            <p className="font-mono text-[10px] text-[#6b6b6b] truncate">{l.url}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
