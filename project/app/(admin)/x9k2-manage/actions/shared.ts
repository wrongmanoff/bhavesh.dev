"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/is-admin";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createAdminActionClient() {
  await requireAdmin();
  return createClient();
}

export async function successResult(): Promise<AdminActionResult> {
  return { ok: true };
}

export async function errorResult(
  error: string,
  fieldErrors?: Record<string, string>
): Promise<AdminActionResult> {
  return { ok: false, error, fieldErrors };
}

export async function revalidateAdminPaths(...paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}