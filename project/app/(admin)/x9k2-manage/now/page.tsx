import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NowPageEditor } from "@/components/admin/NowPageEditor";
import { getNowPage } from "@/lib/data/now";
import type { NowPage } from "@/types";

export default async function AdminNowPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/x9k2-manage/login");

  const now = await getNowPage();
  if (!now) {
    return (
      <p className="font-mono text-sm text-[#6b6b6b]">
        No now_page row found. Run the schema migration seed.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Edit Now Page</h1>
      <NowPageEditor now={now as NowPage} />
    </div>
  );
}
