import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

const UNAUTHORIZED_LOGIN_PATH = "/x9k2-manage/login?error=unauthorized";

export async function isAdminUserId(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  return isAdminUserId(supabase, user.id);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/x9k2-manage/login");
  }

  const admin = await isAdminUserId(supabase, user.id);

  if (!admin) {
    redirect(UNAUTHORIZED_LOGIN_PATH);
  }

  return true;
}
