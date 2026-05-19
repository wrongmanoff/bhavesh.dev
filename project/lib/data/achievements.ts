import { createClient } from "@/lib/supabase/server";
import type { Achievement } from "@/types";

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("featured", { ascending: false })
    .order("date", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("getAchievements:", error.message);
    return [];
  }
  return (data ?? []) as Achievement[];
}

export function getVaultStats(achievements: Achievement[]) {
  return {
    totalCerts: achievements.filter((a) => a.type === "cert").length,
    hackathons: achievements.filter((a) => a.type === "hackathon").length,
    featured: achievements.filter((a) => a.featured).length,
    total: achievements.length,
  };
}
