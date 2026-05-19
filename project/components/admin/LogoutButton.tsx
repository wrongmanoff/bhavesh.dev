"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="font-mono text-xs px-3 py-1.5 rounded border border-[#1e1e1e] text-[#6b6b6b] hover:text-red-400 hover:border-red-400/30 transition-colors"
    >
      logout
    </button>
  );
}
