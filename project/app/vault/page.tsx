import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { getAchievements, getVaultStats } from "@/lib/data/achievements";

export const metadata: Metadata = {
  title: "Achievement Vault",
  description: "Certificates, hackathons, rankings, and milestones from my journey.",
};

export default async function VaultPage() {
  const achievements = await getAchievements();
  const stats = getVaultStats(achievements);

  const featured = achievements.filter((a) => a.featured);
  const rest = achievements.filter((a) => !a.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <SectionHeader
        label="~/vault"
        title="Achievement Vault"
        description="Certificates, hackathons, club positions, rankings, and badges — the proof of work."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="total" value={stats.total} />
        <Stat label="certificates" value={stats.totalCerts} />
        <Stat label="hackathons" value={stats.hackathons} />
        <Stat label="featured" value={stats.featured} />
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
          <p className="font-mono text-sm text-[#6b6b6b]">vault is empty — add achievements in admin</p>
        </div>
      ) : (
        <VaultGrid featured={featured} rest={rest} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-[#00ff88]">{value}</p>
      <p className="font-mono text-[10px] text-[#6b6b6b] uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}
