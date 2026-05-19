import { HeroSection } from "@/components/home/HeroSection";
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid";
import { CurrentlyDoingWidget } from "@/components/home/CurrentlyDoingWidget";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getNowPage } from "@/lib/data/now";

export default async function HomePage() {
  const now = await getNowPage();

  return (
    <>
      <HeroSection />

      <section id="explore" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionHeader
              label="navigate"
              title="Explore the OS"
              description="Quick access to every corner of my digital HQ."
              className="mb-6"
            />
            <QuickAccessGrid />
          </div>
          <div className="lg:col-span-1">
            <CurrentlyDoingWidget now={now} />
          </div>
        </div>
      </section>
    </>
  );
}
