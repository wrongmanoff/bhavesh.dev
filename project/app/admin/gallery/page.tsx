import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getGalleryItems } from "@/lib/data/gallery";
import { formatDate } from "@/lib/utils";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const items = await getGalleryItems();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gallery</h1>
          <p className="text-sm text-[#a0a0a0]">Manage visual memories.</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded bg-[#00ff88] text-black hover:bg-[#00cc6a] transition-colors"
        >
          <Plus size={16} />
          add image
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#1e1e1e] rounded-lg">
          <p className="font-mono text-sm text-[#6b6b6b]">no images yet</p>
          <Link
            href="/admin/gallery/new"
            className="inline-block mt-4 font-mono text-xs text-[#00ff88] hover:underline"
          >
            add your first image →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/admin/gallery/${item.id}`}>
              <Card hover className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <p className="text-[#6b6b6b] text-xs mt-1 capitalize">{item.category}</p>
                  {item.taken_at && (
                    <p className="text-[#4a4a4a] text-xs mt-1">{formatDate(item.taken_at)}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
